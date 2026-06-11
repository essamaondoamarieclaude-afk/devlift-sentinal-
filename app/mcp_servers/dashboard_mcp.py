import json
import uuid

from asyncpg import Pool


async def push_notification(
    business_id: str,
    user_id: str | None,
    message: str,
    pool: Pool,
) -> dict:
    notification_id = str(uuid.uuid4())
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO notifications (id, business_id, user_id, message, is_read, created_at) "
            "VALUES ($1, $2, $3::uuid, $4, false, NOW())",
            notification_id,
            business_id,
            user_id,
            message,
        )
    print(f"[DASHBOARD] Notification {notification_id[:8]}... pushed for business {business_id[:8]}...")
    return {"status": "pushed", "notification_id": notification_id}
