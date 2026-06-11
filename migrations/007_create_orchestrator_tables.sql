-- Migration: Create orchestrator_sessions + orchestrator_decisions tables

CREATE TABLE IF NOT EXISTS orchestrator_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    alert_id UUID NOT NULL,
    state JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orchestrator_sessions_business_id ON orchestrator_sessions(business_id);
CREATE INDEX IF NOT EXISTS idx_orchestrator_sessions_alert_id ON orchestrator_sessions(alert_id);

CREATE TABLE IF NOT EXISTS orchestrator_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES orchestrator_sessions(session_id),
    step VARCHAR(50) NOT NULL,
    decision TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orchestrator_decisions_session_id ON orchestrator_decisions(session_id);
