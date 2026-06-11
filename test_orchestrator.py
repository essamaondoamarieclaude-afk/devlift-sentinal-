import asyncio
import json
import os
from dotenv import load_dotenv

import asyncpg

load_dotenv()

BUSINESS_ID = "3c267080-c916-4b5a-bb1d-61119ebc7596"


async def run_migration():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), timeout=10)
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS orchestrator_sessions (
                session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                business_id UUID NOT NULL,
                alert_id UUID NOT NULL,
                state JSONB NOT NULL DEFAULT '{}',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_orchestrator_sessions_business_id ON orchestrator_sessions(business_id)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_orchestrator_sessions_alert_id ON orchestrator_sessions(alert_id)")
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS orchestrator_decisions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                session_id UUID REFERENCES orchestrator_sessions(session_id),
                step VARCHAR(50) NOT NULL,
                decision TEXT NOT NULL,
                details JSONB NOT NULL DEFAULT '{}',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_orchestrator_decisions_session_id ON orchestrator_decisions(session_id)")
        print("Migration applied: orchestrator tables created")
    finally:
        await conn.close()


async def test_orchestrator():
    pool = await asyncpg.create_pool(os.getenv("DATABASE_URL"), min_size=1, max_size=3, timeout=10)

    from app.agents.orchestrator import Orchestrator

    # Find an open alert
    async with pool.acquire() as conn:
        alert = await conn.fetchrow(
            "SELECT id, alert_type, title, description FROM alerts WHERE business_id = $1 AND status = 'open' LIMIT 1",
            BUSINESS_ID,
        )

    if not alert:
        print("No open alerts found. Creating one...")

        import uuid
        alert_id = str(uuid.uuid4())
        async with pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO alerts (id, business_id, alert_type, priority, title, description, data, status, created_at) "
                "VALUES ($1, $2, 'low_stock', 'high', 'Test: Low stock Widget', 'Stock for Widget is 30, below threshold of 100.', $3::jsonb, 'open', NOW())",
                alert_id,
                BUSINESS_ID,
                json.dumps({"item_id": "f6e52e6a-8b20-41ec-80b9-6768aaa95dce", "current_stock": 30, "min_threshold": 100}),
            )
        print(f"Created test alert: {alert_id}")
        alert = {"id": alert_id, "alert_type": "low_stock"}

    alert_id = str(alert["id"])
    print(f"\n{'=' * 60}")
    print(f"Processing alert: {alert_id}")
    print(f"Type: {alert['alert_type']}")
    print(f"{'=' * 60}\n")

    orchestrator = Orchestrator(BUSINESS_ID, pool)
    result = await orchestrator.process_alert(alert_id)

    # Print summary
    print("\n" + "=" * 60)
    print("ORCHESTRATOR RESULT")
    print("=" * 60)
    print(f"Session ID: {result['session_id']}")
    print(f"Alert ID: {result['alert_id'][:8]}...")

    print(f"\n--- Analysis ---")
    analysis = result["analysis"]
    print(f"  Root cause: {analysis.get('root_cause', 'N/A')}")
    print(f"  Risk score: {analysis.get('risk_score', 'N/A')}")
    print(f"  Recommended action: {analysis.get('recommended_action', 'N/A')}")
    print(f"  Confidence: {analysis.get('confidence', 'N/A')}")

    print(f"\n--- Execution ---")
    exec_result = result["execution"]
    if exec_result:
        if exec_result.get("action") == "requires_approval":
            print(f"  Status: REQUIRES APPROVAL")
            print(f"  Request ID: {exec_result['request_id']}")
            print(f"  Message: {exec_result['message']}")
        else:
            print(f"  Status: {exec_result.get('status', 'N/A')}")
            for r in exec_result.get("results", []):
                print(f"  [{r['status']}] {r['tool']}: {r.get('output', r.get('error', ''))}")

    print(f"\n--- Communication ---")
    comm_result = result["communication"]
    if comm_result:
        if "error" in comm_result:
            print(f"  Error: {comm_result['error']}")
        else:
            print(f"  Message: {comm_result.get('message', '')[:120]}...")
            for n in comm_result.get("notifications", []):
                print(f"  [{n['status']}] {n['channel']}")

    print(f"\n--- Decision Log (orchestrator_decisions) ---")
    async with pool.acquire() as conn:
        decisions = await conn.fetch(
            "SELECT step, decision, created_at FROM orchestrator_decisions WHERE session_id = $1 ORDER BY created_at ASC",
            result["session_id"],
        )
        for d in decisions:
            print(f"  [{d['created_at']}] {d['step']:20s} | {d['decision'][:80]}")

    await pool.close()
    print("\nDone.")


asyncio.run(run_migration())
asyncio.run(test_orchestrator())
