import json
import os
import uuid
from datetime import datetime, timezone

from asyncpg import Pool
from google import genai

from app.mcp_servers import dashboard_mcp, gmail_mcp, sms_mcp, whatsapp_mcp

MOCK_EXPLANATION = (
    "Alert triggered: Low stock detected for Widget. "
    "Current stock is 30 units, below the threshold of 100. "
    "A purchase order has been created for 200 units. "
    "Expected restock within 48 hours. No immediate action required."
)


class CommunicationAgent:
    def __init__(self, business_id: str, pool: Pool):
        self.business_id = business_id
        self.pool = pool

    async def generate_explanation(
        self,
        alert_data: dict,
        action_results: list | None = None,
        language: str = "en",
    ) -> str:
        prompt = self._build_prompt(alert_data, action_results or [], language)
        message = self._call_llm(prompt, language)
        return message

    async def send_notification(
        self,
        channel: str,
        recipient: str | None,
        message: str,
        user_id: str | None = None,
    ) -> dict:
        if channel == "whatsapp":
            if not recipient:
                return {"channel": channel, "status": "failed", "error": "Missing recipient phone"}
            result = await whatsapp_mcp.send_whatsapp(
                phone=recipient,
                message=message,
                business_id=self.business_id,
            )
            return {"channel": channel, "status": "sent", "result": result}

        elif channel == "email":
            if not recipient:
                return {"channel": channel, "status": "failed", "error": "Missing recipient email"}
            result = await gmail_mcp.send_email(
                to=recipient,
                subject="Devlift Sentinel Alert",
                body=message,
                business_id=self.business_id,
            )
            return {"channel": channel, "status": "sent", "result": result}

        elif channel == "sms":
            if not recipient:
                return {"channel": channel, "status": "failed", "error": "Missing recipient phone"}
            result = await sms_mcp.send_sms(
                phone=recipient,
                message=message,
                business_id=self.business_id,
            )
            return {"channel": channel, "status": "sent", "result": result}

        elif channel == "dashboard":
            result = await dashboard_mcp.push_notification(
                business_id=self.business_id,
                user_id=user_id,
                message=message,
                pool=self.pool,
            )
            return {"channel": channel, "status": "pushed", "result": result}

        else:
            return {"channel": channel, "status": "failed", "error": f"Unknown channel: {channel}"}

    async def format_report(self, incident_id: str) -> dict:
        async with self.pool.acquire() as conn:
            alert = await conn.fetchrow(
                "SELECT id, alert_type, priority, title, description, data, ai_analysis, status, created_at "
                "FROM alerts WHERE id = $1::uuid AND business_id = $2::uuid",
                incident_id,
                self.business_id,
            )
            if not alert:
                raise ValueError(f"Alert {incident_id} not found")

            actions = await conn.fetch(
                "SELECT agent_type, action_type, input, output, reasoning, confidence_score, status, execution_ms, created_at "
                "FROM agent_actions WHERE alert_id = $1::uuid AND business_id = $2::uuid ORDER BY created_at ASC",
                incident_id,
                self.business_id,
            )

        analysis = alert["ai_analysis"] or {}
        if isinstance(analysis, str):
            analysis = json.loads(analysis)

        action_log = []
        for a in actions:
            action_log.append({
                "agent": a["agent_type"],
                "action": a["action_type"],
                "status": a["status"],
                "reasoning": a["reasoning"],
                "confidence": float(a["confidence_score"]) if a["confidence_score"] else None,
                "duration_ms": a["execution_ms"],
                "timestamp": str(a["created_at"]),
            })

        report_lines = [
            f"# Incident Report: {alert['title']}",
            f"",
            f"**Alert ID:** {str(alert['id'])}",
            f"**Type:** {alert['alert_type']}",
            f"**Priority:** {alert['priority']}",
            f"**Status:** {alert['status']}",
            f"**Created:** {alert['created_at']}",
            f"**Resolved:** N/A",
            f"",
            f"## Description",
            f"{alert['description']}",
            f"",
            f"## AI Analysis",
            f"- **Root Cause:** {analysis.get('root_cause', 'N/A')}",
            f"- **Risk Score:** {analysis.get('risk_score', 'N/A')}",
            f"- **Recommended Action:** {analysis.get('recommended_action', 'N/A')}",
            f"- **Confidence:** {analysis.get('confidence', 'N/A')}",
            f"",
            f"## Actions Taken",
        ]
        if action_log:
            for a in action_log:
                report_lines.append(f"")
                report_lines.append(f"### {a['agent']}: {a['action']}")
                report_lines.append(f"- **Status:** {a['status']}")
                report_lines.append(f"- **Reasoning:** {a['reasoning']}")
                report_lines.append(f"- **Confidence:** {a['confidence']}")
                report_lines.append(f"- **Duration:** {a['duration_ms']}ms")
                report_lines.append(f"- **Timestamp:** {a['timestamp']}")
        else:
            report_lines.append("No automated actions were taken.")

        if alert["data"]:
            report_lines.append("")
            report_lines.append("## Raw Alert Data")
            report_lines.append(f"```json")
            report_lines.append(json.dumps(alert["data"], indent=2))
            report_lines.append(f"```")

        report = "\n".join(report_lines)

        report_id = str(uuid.uuid4())
        async with self.pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO agent_actions "
                "(id, business_id, agent_type, action_type, input, output, reasoning, confidence_score, status, alert_id, execution_ms, created_at) "
                "VALUES ($1, $2, 'communication', 'format_report', $3::jsonb, $4::jsonb, $5, 1.0, 'completed', $6::uuid, 0, NOW())",
                report_id,
                self.business_id,
                json.dumps({"incident_id": incident_id}),
                json.dumps({"report_length": len(report)}),
                f"Report generated for incident {incident_id}",
                incident_id,
            )

        return {
            "incident_id": incident_id,
            "report": report,
            "action_id": report_id,
        }

    def _build_prompt(self, alert_data: dict, action_results: list, language: str) -> str:
        action_summary = "No actions taken."
        if action_results:
            summary_lines = []
            for a in action_results:
                tool = a.get("tool", a.get("action_type", "unknown"))
                status = a.get("status", "unknown")
                summary_lines.append(f"- {tool}: {status}")
            action_summary = "\n".join(summary_lines)

        return f"""You are a senior operations manager for a business. Write a clear, concise, actionable message for the user based on the following:

Alert: {alert_data.get('title', 'N/A')} (priority: {alert_data.get('priority', 'N/A')})
Details: {alert_data.get('description', 'N/A')}
AI Actions taken: {action_summary}
Recommendation: {alert_data.get('recommended_action', alert_data.get('ai_analysis', {}).get('recommended_action', 'N/A'))}

Keep it under 150 words. Use {language} language. Tone: professional but not alarmist.
Output only the message text, no markdown formatting."""

    def _call_llm(self, prompt: str, language: str) -> str:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your-gemini-api-key":
            try:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
                return text
            except Exception as e:
                print(f"Gemini API call failed in CommunicationAgent: {e}, falling back to mock")
                return MOCK_EXPLANATION
        return MOCK_EXPLANATION


async def communicate_for_alert(
    business_id: str,
    pool: Pool,
    alert_id: str,
    channels: list[str],
    recipients: dict | None = None,
    language: str = "en",
    user_id: str | None = None,
) -> dict:
    async with pool.acquire() as conn:
        alert = await conn.fetchrow(
            "SELECT id, alert_type, priority, title, description, data, ai_analysis, created_at "
            "FROM alerts WHERE id = $1::uuid AND business_id = $2::uuid",
            alert_id,
            business_id,
        )
        if not alert:
            raise ValueError(f"Alert {alert_id} not found")

        recent_actions = await conn.fetch(
            "SELECT action_type, status, output, created_at "
            "FROM agent_actions "
            "WHERE alert_id = $1::uuid AND business_id = $2::uuid AND agent_type = 'execution' "
            "ORDER BY created_at DESC LIMIT 10",
            alert_id,
            business_id,
        )

    ai_analysis = alert["ai_analysis"] or {}
    if isinstance(ai_analysis, str):
        ai_analysis = json.loads(ai_analysis)

    alert_data = {
        "title": alert["title"],
        "priority": alert["priority"],
        "description": alert["description"],
        "alert_type": alert["alert_type"],
        "data": alert["data"],
        "ai_analysis": ai_analysis,
        "recommended_action": ai_analysis.get("recommended_action", ""),
    }

    action_results = []
    for a in recent_actions:
        action_results.append({
            "tool": a["action_type"],
            "status": a["status"],
            "timestamp": str(a["created_at"]),
        })

    agent = CommunicationAgent(business_id, pool)
    message = await agent.generate_explanation(alert_data, action_results, language)

    recipients = recipients or {}
    notification_results = []
    for channel in channels:
        recipient = recipients.get(channel)
        result = await agent.send_notification(
            channel=channel,
            recipient=recipient,
            message=message,
            user_id=user_id,
        )
        notification_results.append(result)

    action_id = str(uuid.uuid4())
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO agent_actions "
            "(id, business_id, agent_type, action_type, input, output, reasoning, confidence_score, status, alert_id, execution_ms, created_at) "
            "VALUES ($1, $2, 'communication', 'communicate', $3::jsonb, $4::jsonb, $5, 1.0, 'completed', $6::uuid, 0, NOW())",
            action_id,
            business_id,
            json.dumps({"alert_id": alert_id, "channels": channels, "language": language}),
            json.dumps({"message_length": len(message), "channels_sent": [r["channel"] for r in notification_results]}),
            f"Communicated alert {alert_id} via {', '.join(channels)}",
            alert_id,
        )

    return {
        "alert_id": alert_id,
        "message": message,
        "notifications": notification_results,
        "action_id": action_id,
    }
