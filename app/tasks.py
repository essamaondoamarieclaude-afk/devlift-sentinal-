import asyncio
import json
import os

from dotenv import load_dotenv

import asyncpg

from app.celery_app import celery_app

load_dotenv()


def run_async(coro):
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(name="process_new_alerts")
def process_new_alerts():
    url = os.getenv("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set")
        return {"status": "error", "message": "DATABASE_URL not set"}

    pool = None
    try:
        pool = run_async(asyncpg.create_pool(url, min_size=1, max_size=2, timeout=10))

        from app.agents.orchestrator import Orchestrator

        processed = []
        async def _run():
            async with pool.acquire() as conn:
                rows = await conn.fetch(
                    "SELECT a.id, a.business_id FROM alerts a "
                    "WHERE a.status = 'open' "
                    "AND NOT EXISTS (SELECT 1 FROM orchestrator_sessions s WHERE s.alert_id = a.id)"
                    "LIMIT 5"
                )
            for row in rows:
                alert_id = str(row["id"])
                business_id = str(row["business_id"])
                try:
                    orchestrator = Orchestrator(business_id, pool)
                    result = await orchestrator.process_alert(alert_id)
                    processed.append({"alert_id": alert_id, "status": "processed"})
                    print(f"Orchestrator processed alert {alert_id[:8]}...")
                except Exception as e:
                    processed.append({"alert_id": alert_id, "status": "failed", "error": str(e)})
                    print(f"Orchestrator failed for alert {alert_id[:8]}...: {e}")
            return processed

        processed = run_async(_run())
        return {"status": "completed", "processed": len(processed), "details": processed}

    except Exception as e:
        print(f"process_new_alerts error: {e}")
        return {"status": "error", "message": str(e)}

    finally:
        if pool:
            run_async(pool.close())


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        60.0,
        process_new_alerts.s(),
        name="process new alerts every 60 seconds",
    )
