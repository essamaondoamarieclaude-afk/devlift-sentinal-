import json
import uuid
from datetime import datetime, timezone

from asyncpg import Pool

from app.mcp_servers import erp_mcp, gmail_mcp, whatsapp_mcp


class ExecutionAgent:
    def __init__(self, business_id: str, pool: Pool):
        self.business_id = business_id
        self.pool = pool

    async def execute(
        self,
        actions: list[dict],
        risk_score: float = 0.0,
        alert_id: str | None = None,
    ) -> dict:
        if risk_score > 0.85:
            return await self._require_approval(actions, risk_score, alert_id)

        results = []
        for action in actions:
            result = await self._execute_single(action, alert_id)
            results.append(result)

        return {
            "status": "completed",
            "total_actions": len(actions),
            "results": results,
        }

    async def _execute_single(self, action: dict, alert_id: str | None) -> dict:
        tool = action.get("tool", "")
        arguments = action.get("arguments", {})
        action_id = str(uuid.uuid4())
        start = datetime.now(timezone.utc)

        try:
            output, error = await self._dispatch(tool, arguments)

            elapsed = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)

            async with self.pool.acquire() as conn:
                await conn.execute(
                    "INSERT INTO agent_actions "
                    "(id, business_id, agent_type, action_type, input, output, reasoning, confidence_score, status, alert_id, execution_ms, created_at) "
                    "VALUES ($1, $2, 'execution', $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9::uuid, $10, NOW())",
                    action_id,
                    self.business_id,
                    f"execute_{tool}",
                    json.dumps(arguments),
                    json.dumps(output) if output else json.dumps({"error": error}),
                    error or f"Executed {tool} successfully",
                    1.0 if not error else 0.0,
                    "completed" if not error else "failed",
                    alert_id,
                    elapsed,
                )

            if error:
                return {"tool": tool, "status": "failed", "error": error, "action_id": action_id}
            return {"tool": tool, "status": "success", "output": output, "action_id": action_id}

        except Exception as e:
            elapsed = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)
            error_msg = f"{type(e).__name__}: {e}"

            async with self.pool.acquire() as conn:
                await conn.execute(
                    "INSERT INTO agent_actions "
                    "(id, business_id, agent_type, action_type, input, output, reasoning, confidence_score, status, alert_id, execution_ms, created_at) "
                    "VALUES ($1, $2, 'execution', $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9::uuid, $10, NOW())",
                    action_id,
                    self.business_id,
                    f"execute_{tool}",
                    json.dumps(arguments),
                    json.dumps({"error": error_msg}),
                    error_msg,
                    0.0,
                    "failed",
                    alert_id,
                    elapsed,
                )

            return {"tool": tool, "status": "error", "error": error_msg, "action_id": action_id}

    async def _dispatch(self, tool: str, arguments: dict) -> tuple[dict | None, str | None]:
        if tool == "send_whatsapp":
            phone = arguments.get("phone")
            message = arguments.get("message")
            if not phone or not message:
                return None, "Missing required arguments: phone, message"
            output = await whatsapp_mcp.send_whatsapp(
                phone=phone,
                message=message,
                business_id=arguments.get("business_id", self.business_id),
            )
            return output, None

        elif tool == "send_email":
            to = arguments.get("to")
            subject = arguments.get("subject")
            body = arguments.get("body")
            if not to or not subject or not body:
                return None, "Missing required arguments: to, subject, body"
            output = await gmail_mcp.send_email(
                to=to,
                subject=subject,
                body=body,
                business_id=arguments.get("business_id", self.business_id),
            )
            return output, None

        elif tool == "create_purchase_order":
            supplier_id = arguments.get("supplier_id")
            items = arguments.get("items")
            if not supplier_id or not items:
                return None, "Missing required arguments: supplier_id, items"
            output = await erp_mcp.create_purchase_order(
                supplier_id=supplier_id,
                items=items,
                business_id=arguments.get("business_id", self.business_id),
            )
            return output, None

        elif tool == "update_inventory":
            return await self._update_inventory(arguments)

        else:
            return None, f"Unknown tool: {tool}"

    async def _update_inventory(self, arguments: dict) -> tuple[dict | None, str | None]:
        item_id = arguments.get("item_id")
        quantity = arguments.get("quantity")
        if not item_id or quantity is None:
            return None, "Missing required arguments: item_id, quantity"

        async with self.pool.acquire() as conn:
            item = await conn.fetchrow(
                "SELECT id, current_stock FROM inventory_items WHERE id = $1::uuid AND business_id = $2::uuid",
                item_id,
                self.business_id,
            )
            if not item:
                return None, f"Inventory item {item_id} not found"

            new_stock = int(item["current_stock"]) + int(quantity)
            await conn.execute(
                "UPDATE inventory_items SET current_stock = $1, updated_at = NOW() WHERE id = $2::uuid",
                new_stock,
                item_id,
            )

        return {"item_id": item_id, "previous_stock": int(item["current_stock"]), "new_stock": new_stock}, None

    async def _require_approval(
        self,
        actions: list[dict],
        risk_score: float,
        alert_id: str | None,
    ) -> dict:
        request_id = str(uuid.uuid4())
        async with self.pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO approval_requests (id, business_id, alert_id, actions, risk_score, status, created_at) "
                "VALUES ($1, $2, $3::uuid, $4::jsonb, $5, 'pending', NOW())",
                request_id,
                self.business_id,
                alert_id,
                json.dumps(actions),
                risk_score,
            )

        return {
            "action": "requires_approval",
            "request_id": request_id,
            "risk_score": risk_score,
            "message": f"Risk score {risk_score} exceeds threshold of 0.85. Approval required before execution.",
        }
