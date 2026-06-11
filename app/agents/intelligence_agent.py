import json
import os
import uuid
from datetime import datetime, timezone

from asyncpg import Pool
from google import genai


MOCK_LLM_RESPONSE = {
    "root_cause": "Unusually high sales velocity over weekend",
    "risk_score": 0.85,
    "recommended_action": "Place emergency order with supplier",
    "confidence": 0.92,
}


class IntelligenceAgent:
    def __init__(self, business_id: str, alert_id: str, pool: Pool):
        self.business_id = business_id
        self.alert_id = alert_id
        self.pool = pool

    async def analyze(self) -> dict:
        async with self.pool.acquire() as conn:
            alert = await conn.fetchrow(
                "SELECT id, alert_type, title, description, data, created_at FROM alerts WHERE id = $1::uuid AND business_id = $2::uuid",
                self.alert_id,
                self.business_id,
            )
            if not alert:
                raise ValueError(f"Alert {self.alert_id} not found")

            alert_data = alert["data"] or {}

            transactions = await conn.fetch(
                "SELECT occurred_at, amount FROM transactions WHERE business_id = $1::uuid AND occurred_at >= NOW() - interval '7 days' ORDER BY occurred_at DESC LIMIT 50",
                self.business_id,
            )

            similar_alerts = await conn.fetch(
                "SELECT id, alert_type, title, data, created_at, ai_analysis FROM alerts "
                "WHERE business_id = $1::uuid AND alert_type = $2 AND id != $3::uuid AND status = 'open' "
                "ORDER BY created_at DESC LIMIT 5",
                self.business_id,
                alert["alert_type"],
                self.alert_id,
            )

            inventory_data = None
            item_id = None
            if isinstance(alert_data, dict):
                item_id = alert_data.get("item_id")
            if item_id:
                inventory_data = await conn.fetchrow(
                    "SELECT id, name, current_stock, min_threshold, unit_cost, selling_price, created_at, updated_at "
                    "FROM inventory_items WHERE id = $1::uuid",
                    item_id,
                )

            context = {
                "alert": {
                    "id": str(alert["id"]),
                    "type": alert["alert_type"],
                    "title": alert["title"],
                    "description": alert["description"],
                    "data": alert_data,
                    "created_at": str(alert["created_at"]),
                },
                "transactions_last_7d": [
                    {
                        "occurred_at": str(t["occurred_at"]),
                        "amount": float(t["amount"]),
                    }
                    for t in transactions
                ],
                "similar_alerts": [
                    {
                        "id": str(s["id"]),
                        "type": s["alert_type"],
                        "title": s["title"],
                        "data": s["data"],
                        "created_at": str(s["created_at"]),
                    }
                    for s in similar_alerts
                ],
                "inventory_item": (
                    {
                        "name": inventory_data["name"],
                        "current_stock": int(inventory_data["current_stock"]),
                        "min_threshold": float(inventory_data["min_threshold"]),
                        "unit_cost": (
                            float(inventory_data["unit_cost"])
                            if inventory_data["unit_cost"]
                            else None
                        ),
                        "selling_price": (
                            float(inventory_data["selling_price"])
                            if inventory_data["selling_price"]
                            else None
                        ),
                    }
                    if inventory_data
                    else None
                ),
            }

            start = datetime.now(timezone.utc)
            analysis = self._call_llm(context)
            elapsed = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)

            await conn.execute(
                "UPDATE alerts SET ai_analysis = $1::jsonb WHERE id = $2::uuid",
                json.dumps(analysis),
                self.alert_id,
            )

            action_id = str(uuid.uuid4())
            await conn.execute(
                "INSERT INTO agent_actions (id, business_id, agent_type, action_type, input, output, reasoning, confidence_score, status, alert_id, execution_ms, created_at) "
                "VALUES ($1, $2, 'intelligence', 'analyze', $3::jsonb, $4::jsonb, $5, $6, 'completed', $7::uuid, $8, NOW())",
                action_id,
                self.business_id,
                json.dumps(context),
                json.dumps(analysis),
                analysis.get("root_cause", ""),
                analysis.get("confidence", 0),
                self.alert_id,
                elapsed,
            )

            return {
                "alert_id": self.alert_id,
                "analysis": analysis,
                "action_id": action_id,
            }

    def _call_llm(self, context: dict) -> dict:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your-gemini-api-key":
            try:
                client = genai.Client(api_key=api_key)
                prompt = f"""You are an AI operations analyst. Analyze this business alert and return only valid JSON.

Alert: {json.dumps(context.get('alert'))}
Recent transactions: {json.dumps(context.get('transactions_last_7d'))}
Similar past alerts: {json.dumps(context.get('similar_alerts'))}
Inventory data: {json.dumps(context.get('inventory_item'))}

Return a JSON object with these exact keys:
- "root_cause": string explaining the likely root cause
- "risk_score": float between 0 and 1
- "recommended_action": string
- "confidence": float between 0 and 1

Output only valid JSON, no markdown."""
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
                return json.loads(text)
            except Exception as e:
                print(f"Gemini API call failed: {e}, falling back to mock")
                return dict(MOCK_LLM_RESPONSE)
        return dict(MOCK_LLM_RESPONSE)


async def run_for_open_alerts(business_id: str, pool: Pool, alert_id: str | None = None) -> list[dict]:
    results = []
    async with pool.acquire() as conn:
        if alert_id:
            rows = await conn.fetch(
                "SELECT id FROM alerts WHERE id = $1::uuid AND business_id = $2::uuid AND status = 'open'",
                alert_id,
                business_id,
            )
        else:
            rows = await conn.fetch(
                "SELECT id FROM alerts WHERE business_id = $1::uuid AND status = 'open'",
                business_id,
            )

    for row in rows:
        agent = IntelligenceAgent(business_id, str(row["id"]), pool)
        result = await agent.analyze()
        results.append(result)

    return results
