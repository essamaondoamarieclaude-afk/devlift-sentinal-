import json
import uuid
from datetime import datetime, timedelta, timezone

from asyncpg import Pool


class MonitoringAgent:
    def __init__(self, business_id: str, pool: Pool):
        self.business_id = business_id
        self.pool = pool
        self.alerts_created: list[dict] = []

    async def run(self) -> list[dict]:
        async with self.pool.acquire() as conn:
            await self._check_low_stock(conn)
            await self._check_velocity_anomaly(conn)
        return self.alerts_created

    async def _check_low_stock(self, conn):
        items = await conn.fetch(
            "SELECT id, name, current_stock, min_threshold FROM inventory_items WHERE business_id = $1::uuid",
            self.business_id,
        )
        for item in items:
            if item["current_stock"] < item["min_threshold"]:
                existing = await conn.fetchval(
                    "SELECT id FROM alerts WHERE business_id = $1::uuid AND alert_type = 'low_stock' AND status = 'open' AND data->>'item_id' = $2",
                    self.business_id,
                    str(item["id"]),
                )
                if not existing:
                    alert_id = await self._create_alert(
                        conn,
                        alert_type="low_stock",
                        priority="high",
                        title=f"Low stock: {item['name']}",
                        description=(
                            f"Stock for '{item['name']}' is {item['current_stock']}, "
                            f"below threshold of {item['min_threshold']}."
                        ),
                        data={
                            "item_id": str(item["id"]),
                            "current_stock": int(item["current_stock"]),
                            "min_threshold": float(item["min_threshold"]),
                        },
                    )
                    self.alerts_created.append({"type": "low_stock", "item": item["name"], "alert_id": alert_id})

    async def _check_velocity_anomaly(self, conn):
        now = datetime.now(timezone.utc)
        one_hour_ago = now - timedelta(hours=1)
        seven_days_ago = now - timedelta(days=7)

        recent_count = await conn.fetchval(
            "SELECT COUNT(*) FROM transactions WHERE business_id = $1::uuid AND occurred_at >= $2",
            self.business_id,
            one_hour_ago,
        )

        week_count = await conn.fetchval(
            "SELECT COUNT(*) FROM transactions WHERE business_id = $1::uuid AND occurred_at >= $2",
            self.business_id,
            seven_days_ago,
        )

        hourly_avg = (week_count or 0) / (7 * 24) if week_count else 0

        if hourly_avg > 0 and (recent_count or 0) > 2 * hourly_avg:
            existing = await conn.fetchval(
                "SELECT id FROM alerts WHERE business_id = $1::uuid AND alert_type = 'velocity_spike' AND status = 'open'",
                self.business_id,
            )
            if not existing:
                alert_id = await self._create_alert(
                    conn,
                    alert_type="velocity_spike",
                    priority="medium",
                    title="Transaction velocity spike detected",
                    description=(
                        f"Recent 1-hour transaction count ({recent_count}) "
                        f"exceeds 2x the hourly average ({hourly_avg:.1f})."
                    ),
                    data={"recent_1h_count": recent_count, "hourly_avg_7d": round(hourly_avg, 2)},
                )
                self.alerts_created.append({"type": "velocity_spike", "alert_id": alert_id})

    async def _create_alert(self, conn, alert_type: str, priority: str, title: str, description: str, data: dict) -> str:
        alert_id = str(uuid.uuid4())
        await conn.execute(
            "INSERT INTO alerts (id, business_id, alert_type, priority, title, description, data, status, created_at) "
            "VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, 'open', NOW())",
            alert_id,
            self.business_id,
            alert_type,
            priority,
            title,
            description,
            json.dumps(data),
        )
        return alert_id
