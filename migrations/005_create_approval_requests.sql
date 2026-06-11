-- Migration: Create approval_requests table for human-in-loop gate
-- Run this in your Supabase SQL Editor or via psql

CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    actions JSONB NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_approval_requests_business_id ON approval_requests(business_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
