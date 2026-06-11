import asyncio
import os
import uuid

import asyncpg
from dotenv import load_dotenv

load_dotenv()


async def setup():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), timeout=10)
    bid = "3c267080-c916-4b5a-bb1d-61119ebc7596"

    # Update widget stock to be below threshold (already 80 < 100, but ensure)
    await conn.execute(
        "UPDATE inventory_items SET current_stock = 30, min_threshold = 100 WHERE business_id = $1::uuid AND name = 'Widget'",
        bid,
    )

    # Add enough transactions for velocity detection
    for _ in range(20):
        await conn.execute(
            "INSERT INTO transactions (id, business_id, transaction_type, amount, currency, occurred_at) "
            "VALUES ($1, $2, 'sale', 50, 'USD', NOW() - interval '1 hour' * floor(random() * 168)::int)",
            uuid.uuid4(),
            bid,
        )

    # Add a burst of recent transactions (last hour)
    for _ in range(15):
        await conn.execute(
            "INSERT INTO transactions (id, business_id, transaction_type, amount, currency, occurred_at) "
            "VALUES ($1, $2, 'sale', 50, 'USD', NOW())",
            uuid.uuid4(),
            bid,
        )

    print(f"Test data ready for business_id={bid}")

    # Run agent directly
    from app.agents.monitoring_agent import MonitoringAgent
    from app.core.database import pool as db_pool

    print("Running MonitoringAgent...")
    agent = MonitoringAgent(bid, db_pool)
    details = await agent.run()
    print(f"Alerts created: {len(details)}")
    for d in details:
        print(f"  - {d}")

    await conn.close()


asyncio.run(setup())
