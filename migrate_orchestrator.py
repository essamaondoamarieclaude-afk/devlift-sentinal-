import asyncio
import os
from dotenv import load_dotenv

import asyncpg

load_dotenv()


async def run():
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
        print("Migration 007 applied: orchestrator tables created")
    finally:
        await conn.close()


asyncio.run(run())
