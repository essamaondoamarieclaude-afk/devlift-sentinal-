import json
import uuid
from datetime import datetime, timezone

from asyncpg import Pool

from app.agents.communication_agent import communicate_for_alert
from app.agents.execution_agent import ExecutionAgent
from app.agents.intelligence_agent import IntelligenceAgent

RISK_THRESHOLD = 0.85
AUTO_CHANNELS = ["whatsapp", "dashboard"]
RISKY_CHANNELS = ["dashboard"]


def _default_actions(alert_type: str, alert_data: dict, analysis: dict) -> list[dict]:
    if alert_type == "low_stock":
        item_id = alert_data.get("data", {}).get("item_id")
        actions = []
        if item_id:
            actions.append({
                "tool": "update_inventory",
                "arguments": {"item_id": item_id, "quantity": 200},
            })
        actions.append({
            "tool": "create_purchase_order",
            "arguments": {
                "supplier_id": "default-supplier",
                "items": [{"name": "Restock Order", "quantity": 200, "unit_cost": 0}],
            },
        })
        return actions

    elif alert_type == "velocity_spike":
        return [
            {
                "tool": "send_whatsapp",
                "arguments": {
                    "phone": "+1234567890",
                    "message": "Alert: Unusual transaction velocity detected. Review required.",
                },
            },
        ]

    elif alert_type == "inventory":
        item_id = alert_data.get("data", {}).get("item_id")
        actions = [
            {
                "tool": "send_email",
                "arguments": {
                    "to": "ops@business.com",
                    "subject": f"Alert: {alert_data.get('title', 'Inventory Issue')}",
                    "body": f"Action required: {alert_data.get('description', '')}",
                },
            },
        ]
        if item_id:
            actions.append({
                "tool": "update_inventory",
                "arguments": {"item_id": item_id, "quantity": 100},
            })
        return actions

    return []


class Orchestrator:
    def __init__(self, business_id: str, pool: Pool):
        self.business_id = business_id
        self.pool = pool
        self.session_id: str | None = None

    async def process_alert(self, alert_id: str) -> dict:
        alert = await self._fetch_alert(alert_id)
        if not alert:
            raise ValueError(f"Alert {alert_id} not found for business {self.business_id}")

        self.session_id = await self._create_session(alert_id)

        steps = []

        # ── Step 1: Intelligence ────────────────────────────────────
        await self._log_decision("intelligence", "Started intelligence analysis", {"alert_id": alert_id})
        await self._update_session({"step": "intelligence"})

        intelligence = IntelligenceAgent(self.business_id, alert_id, self.pool)
        analysis_result = await intelligence.analyze()

        analysis = analysis_result["analysis"]
        await self._log_decision(
            "intelligence",
            "Analysis complete",
            {
                "risk_score": analysis.get("risk_score"),
                "root_cause": analysis.get("root_cause"),
                "recommended_action": analysis.get("recommended_action"),
                "confidence": analysis.get("confidence"),
            },
        )
        steps.append({"step": "intelligence", "result": analysis_result})

        # ── Step 2: Decide & Execute ────────────────────────────────
        risk_score = analysis.get("risk_score", 0.0)
        recommended_actions = analysis.get("recommended_actions") or _default_actions(
            alert["alert_type"], alert, analysis,
        )

        await self._update_session({"step": "execution", "risk_score": risk_score, "actions": recommended_actions})

        should_auto_execute = risk_score <= RISK_THRESHOLD
        execution_result = None

        if should_auto_execute:
            await self._log_decision(
                "execution",
                f"Auto-executing {len(recommended_actions)} action(s) (risk_score={risk_score})",
                {"risk_score": risk_score, "actions": recommended_actions},
            )
            agent = ExecutionAgent(self.business_id, self.pool)
            execution_result = await agent.execute(
                actions=recommended_actions,
                risk_score=risk_score,
                alert_id=alert_id,
            )
        else:
            await self._log_decision(
                "execution",
                f"Risk score {risk_score} exceeds threshold {RISK_THRESHOLD}. Requiring approval.",
                {"risk_score": risk_score, "actions": recommended_actions},
            )
            agent = ExecutionAgent(self.business_id, self.pool)
            execution_result = await agent.execute(
                actions=recommended_actions,
                risk_score=risk_score,
                alert_id=alert_id,
            )

        steps.append({"step": "execution", "result": execution_result})

        # ── Step 3: Communication ───────────────────────────────────
        channels = AUTO_CHANNELS if should_auto_execute else RISKY_CHANNELS
        await self._log_decision(
            "communication",
            f"Sending notifications via {', '.join(channels)}",
            {"channels": channels, "language": "en"},
        )
        await self._update_session({"step": "communication"})

        try:
            communication_result = await communicate_for_alert(
                business_id=self.business_id,
                pool=self.pool,
                alert_id=alert_id,
                channels=channels,
                recipients={"whatsapp": "+1234567890"},
                language="en",
            )
        except Exception as e:
            communication_result = {"error": f"{type(e).__name__}: {e}"}

        steps.append({"step": "communication", "result": communication_result})

        # ── Finalize ────────────────────────────────────────────────
        await self._log_decision("orchestrator", "Pipeline complete", {"total_steps": len(steps)})
        await self._update_session({"step": "completed", "completed_at": str(datetime.now(timezone.utc))})

        return {
            "session_id": self.session_id,
            "alert_id": alert_id,
            "business_id": self.business_id,
            "analysis": analysis,
            "execution": execution_result,
            "communication": communication_result,
            "steps": steps,
        }

    async def _fetch_alert(self, alert_id: str) -> dict | None:
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT id, business_id, alert_type, title, description, data FROM alerts WHERE id = $1::uuid AND business_id = $2::uuid",
                alert_id,
                self.business_id,
            )
            if not row:
                return None
            return {
                "id": str(row["id"]),
                "alert_type": row["alert_type"],
                "title": row["title"],
                "description": row["description"],
                "data": row["data"] or {},
            }

    async def _create_session(self, alert_id: str) -> str:
        session_id = str(uuid.uuid4())
        async with self.pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO orchestrator_sessions (session_id, business_id, alert_id, state, created_at, updated_at) "
                "VALUES ($1, $2, $3::uuid, $4::jsonb, NOW(), NOW())",
                session_id,
                self.business_id,
                alert_id,
                json.dumps({"step": "started"}),
            )
        return session_id

    async def _update_session(self, state: dict):
        async with self.pool.acquire() as conn:
            await conn.execute(
                "UPDATE orchestrator_sessions SET state = $1::jsonb, updated_at = NOW() WHERE session_id = $2",
                json.dumps(state),
                self.session_id,
            )

    async def _log_decision(self, step: str, decision: str, details: dict):
        async with self.pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO orchestrator_decisions (id, session_id, step, decision, details, created_at) "
                "VALUES ($1, $2, $3, $4, $5::jsonb, NOW())",
                str(uuid.uuid4()),
                self.session_id,
                step,
                decision,
                json.dumps(details),
            )
