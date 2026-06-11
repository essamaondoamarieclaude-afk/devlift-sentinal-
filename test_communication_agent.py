import asyncio
import json
import os
from dotenv import load_dotenv

import asyncpg

load_dotenv()

BUSINESS_ID = "3c267080-c916-4b5a-bb1d-61119ebc7596"
ITEM_ID = "f6e52e6a-8b20-41ec-80b9-6768aaa95dce"


async def run_migration():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), timeout=10)
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                business_id UUID NOT NULL,
                user_id UUID,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT now()
            )
        """)
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_notifications_business_id ON notifications(business_id)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)")
        print("Migration applied: notifications table created")
    finally:
        await conn.close()


async def test_communication_agent():
    pool = await asyncpg.create_pool(os.getenv("DATABASE_URL"), min_size=1, max_size=2, timeout=10)

    from app.agents.communication_agent import CommunicationAgent

    agent = CommunicationAgent(BUSINESS_ID, pool)

    print("=" * 60)
    print("TEST 1: generate_explanation with Gemini")
    print("=" * 60)

    alert_data = {
        "title": "Low stock: Widget",
        "priority": "high",
        "description": "Stock for 'Widget' is 30, below threshold of 100. A velocity spike of 21 transactions in 1 hour was also detected (7-day avg: 0.3/hr).",
        "alert_type": "low_stock",
        "data": {
            "item_id": ITEM_ID,
            "current_stock": 30,
            "min_threshold": 100,
        },
        "ai_analysis": {
            "root_cause": "A single bulk transaction of 1500 units caused stock to drop below threshold.",
            "risk_score": 0.85,
            "recommended_action": "Place emergency order with supplier for 200 units.",
            "confidence": 0.92,
        },
        "recommended_action": "Place emergency order with supplier for 200 units.",
    }

    action_results = [
        {"tool": "send_whatsapp", "status": "success"},
        {"tool": "create_purchase_order", "status": "success", "po_number": "PO-ABCD1234"},
        {"tool": "update_inventory", "status": "success", "new_stock": 200},
    ]

    message = await agent.generate_explanation(alert_data, action_results, language="en")
    print(f"\n--- Generated Message (EN) ---\n{message}\n")

    print("=" * 60)
    print("TEST 2: French output")
    print("=" * 60)

    msg_fr = await agent.generate_explanation(alert_data, action_results, language="French")
    print(f"\n--- Generated Message (FR) ---\n{msg_fr}\n")

    print("=" * 60)
    print("TEST 3: Send notifications via WhatsApp stub and dashboard")
    print("=" * 60)

    wa_result = await agent.send_notification(
        channel="whatsapp",
        recipient="+1234567890",
        message=message,
    )
    print(f"WhatsApp: {wa_result}")

    dash_result = await agent.send_notification(
        channel="dashboard",
        recipient=None,
        message=message,
        user_id=None,
    )
    print(f"Dashboard: {dash_result}")

    print("=" * 60)
    print("TEST 4: format_report for an alert")
    print("=" * 60)

    try:
        async with pool.acquire() as conn:
            first_alert = await conn.fetchval(
                "SELECT id FROM alerts WHERE business_id = $1 LIMIT 1",
                BUSINESS_ID,
            )
        if first_alert:
            report_result = await agent.format_report(str(first_alert))
            print(f"\n--- Report (first 600 chars) ---\n{report_result['report'][:600]}...\n")
        else:
            print("No alerts found to generate report")
    except ValueError as e:
        print(f"Report generation skipped: {e}")

    print("=" * 60)
    print("TEST 5: Full communicate_for_alert pipeline")
    print("=" * 60)

    try:
        async with pool.acquire() as conn:
            target_alert = await conn.fetchval(
                "SELECT id FROM alerts WHERE business_id = $1 AND status = 'open' LIMIT 1",
                BUSINESS_ID,
            )
        if target_alert:
            from app.agents.communication_agent import communicate_for_alert

            pipeline_result = await communicate_for_alert(
                business_id=BUSINESS_ID,
                pool=pool,
                alert_id=str(target_alert),
                channels=["whatsapp", "dashboard"],
                recipients={"whatsapp": "+1234567890"},
                language="en",
            )
            print(f"Pipeline result:")
            print(f"  Alert ID: {pipeline_result['alert_id'][:8]}...")
            print(f"  Message: {pipeline_result['message'][:100]}...")
            for n in pipeline_result["notifications"]:
                print(f"  Notification: {n}")
        else:
            print("No open alerts found for pipeline test")
    except ValueError as e:
        print(f"Pipeline test skipped: {e}")

    await pool.close()


asyncio.run(run_migration())
asyncio.run(test_communication_agent())
