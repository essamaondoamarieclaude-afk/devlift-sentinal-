import asyncio
import json
import os
from dotenv import load_dotenv

import asyncpg

load_dotenv()

BUSINESS_ID = "3c267080-c916-4b5a-bb1d-61119ebc7596"


async def run_migration():
    url = os.getenv("DATABASE_URL")
    conn = await asyncpg.connect(url)
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS approval_requests (
                id UUID PRIMARY KEY,
                business_id UUID NOT NULL,
                alert_id UUID,
                actions JSONB NOT NULL,
                risk_score DOUBLE PRECISION NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ,
                reviewed_by VARCHAR(255),
                reviewed_at TIMESTAMPTZ
            )
        """)
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_approval_requests_business_id ON approval_requests(business_id)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status)")
        print("Migration applied: approval_requests table created")
    finally:
        await conn.close()


async def test_execution_agent():
    pool = await asyncpg.create_pool(os.getenv("DATABASE_URL"), min_size=1, max_size=2, timeout=10)

    from app.agents.execution_agent import ExecutionAgent

    agent = ExecutionAgent(BUSINESS_ID, pool)

    print("=" * 60)
    print("TEST 1: Execute low-risk actions (risk_score = 0.5)")
    print("=" * 60)

    actions = [
        {
            "tool": "send_whatsapp",
            "arguments": {
                "phone": "+1234567890",
                "message": "Alert: Low stock detected for Widget. Current stock: 30, threshold: 100.",
            },
        },
        {
            "tool": "send_email",
            "arguments": {
                "to": "supplier@example.com",
                "subject": "Purchase Order - Urgent Restock",
                "body": "Please process an urgent restock order for Widget (Qty: 200).",
            },
        },
        {
            "tool": "create_purchase_order",
            "arguments": {
                "supplier_id": "sup-widget-co",
                "items": [{"name": "Widget", "quantity": 200, "unit_cost": 12.50}],
            },
        },
    ]

    result = await agent.execute(actions, risk_score=0.5)
    print(f"Status: {result['status']}")
    print(f"Total: {result['total_actions']}")
    for r in result["results"]:
        print(f"  [{r['status']}] {r['tool']}: {r.get('output', r.get('error'))}")

    print()
    print("=" * 60)
    print("TEST 2: Update inventory directly via Supabase")
    print("=" * 60)

    actions2 = [
        {
            "tool": "update_inventory",
            "arguments": {
                "item_id": "f6e52e6a-8b20-41ec-80b9-6768aaa95dce",
                "quantity": 200,
            },
        },
    ]

    result2 = await agent.execute(actions2, risk_score=0.5)
    for r in result2["results"]:
        print(f"  [{r['status']}] {r['tool']}: {r.get('output', r.get('error'))}")

    print()
    print("=" * 60)
    print("TEST 3: High-risk action blocked by human-in-loop gate (risk_score > 0.85)")
    print("=" * 60)

    actions3 = [
        {
            "tool": "create_purchase_order",
            "arguments": {
                "supplier_id": "sup-expensive",
                "items": [{"name": "Widget", "quantity": 10000, "unit_cost": 50.00}],
            },
        },
    ]

    result3 = await agent.execute(actions3, risk_score=0.92)
    print(f"Action: {result3['action']}")
    print(f"Request ID: {result3['request_id']}")
    print(f"Risk Score: {result3['risk_score']}")
    print(f"Message: {result3['message']}")

    print()
    print("=" * 60)
    print("TEST 4: Unknown tool should fail gracefully")
    print("=" * 60)

    actions4 = [
        {
            "tool": "nonexistent_tool",
            "arguments": {},
        },
    ]

    result4 = await agent.execute(actions4, risk_score=0.3)
    for r in result4["results"]:
        print(f"  [{r['status']}] {r['tool']}: {r.get('error', r.get('output'))}")

    print()
    print("=" * 60)
    print("CHECK: agent_actions table entries")
    print("=" * 60)

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT action_type, status, confidence_score, execution_ms, created_at "
            "FROM agent_actions WHERE agent_type = 'execution' ORDER BY created_at DESC LIMIT 5"
        )
        for row in rows:
            print(f"  {row['action_type']:30s} | {row['status']:10s} | conf={row['confidence_score']} | {row['created_at']}")

    await pool.close()


asyncio.run(test_execution_agent())
