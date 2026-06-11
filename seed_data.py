import asyncio
import os
import uuid

import asyncpg
from dotenv import load_dotenv

load_dotenv()


async def seed():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), timeout=10)
    bid = uuid.uuid4()

    await conn.execute(
        "INSERT INTO businesses (id, name) VALUES ($1, 'Test Biz')", bid
    )
    await conn.execute(
        "INSERT INTO inventory_items (id, business_id, name, current_stock, min_threshold) VALUES ($1, $2, 'Widget', 80, 100)",
        uuid.uuid4(),
        bid,
    )
    await conn.execute(
        "INSERT INTO transactions (id, business_id, transaction_type, amount, currency, occurred_at) VALUES ($1, $2, 'sale', 1500, 'USD', NOW())",
        uuid.uuid4(),
        bid,
    )
    await conn.execute(
        "INSERT INTO alerts (id, business_id, alert_type, priority, title, status, created_at) VALUES ($1, $2, 'inventory', 'high', 'Low stock warning', 'open', NOW())",
        uuid.uuid4(),
        bid,
    )

    print(f"OK Seeded business_id={bid}")
    await conn.close()


asyncio.run(seed())
