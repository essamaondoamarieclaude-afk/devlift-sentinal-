from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

import app.core.database as db
from app.agents.communication_agent import CommunicationAgent, communicate_for_alert
from app.agents.execution_agent import ExecutionAgent
from app.agents.intelligence_agent import IntelligenceAgent, run_for_open_alerts
from app.agents.monitoring_agent import MonitoringAgent
from app.core.security import get_current_user

router = APIRouter()


class ExecuteAction(BaseModel):
    tool: str
    arguments: dict


class ExecuteRequest(BaseModel):
    actions: list[ExecuteAction]
    risk_score: float = 0.0
    alert_id: str | None = None


class CommunicateRequest(BaseModel):
    alert_id: str
    channels: list[str]
    language: str = "en"
    recipients: dict | None = None
    user_id: str | None = None


@router.post("/agents/monitoring/run")
async def run_monitoring_agent(
    current_user: dict = Depends(get_current_user),
):
    business_id = current_user.get("business_id")
    if not business_id:
        raise HTTPException(status_code=400, detail="Missing business_id in token")

    if db.pool is None:
        raise RuntimeError("Database pool is not initialized")

    agent = MonitoringAgent(business_id, db.pool)
    details = await agent.run()

    return {
        "status": "completed",
        "alerts_created": len(details),
        "details": details,
    }


@router.post("/agents/intelligence/analyze")
async def run_intelligence_agent(
    alert_id: str | None = Query(None),
    current_user: dict = Depends(get_current_user),
):
    business_id = current_user.get("business_id")
    if not business_id:
        raise HTTPException(status_code=400, detail="Missing business_id in token")

    if db.pool is None:
        raise RuntimeError("Database pool is not initialized")

    results = await run_for_open_alerts(business_id, db.pool, alert_id)

    return {
        "status": "completed",
        "analyzed_alerts": len(results),
        "results": results,
    }


@router.post("/agents/execute")
async def run_execution_agent(
    req: ExecuteRequest,
    current_user: dict = Depends(get_current_user),
):
    business_id = current_user.get("business_id")
    if not business_id:
        raise HTTPException(status_code=400, detail="Missing business_id in token")

    if db.pool is None:
        raise RuntimeError("Database pool is not initialized")

    agent = ExecutionAgent(business_id, db.pool)
    result = await agent.execute(
        actions=[a.model_dump() for a in req.actions],
        risk_score=req.risk_score,
        alert_id=req.alert_id,
    )

    return result


@router.post("/agents/communicate")
async def run_communication_agent(
    req: CommunicateRequest,
    current_user: dict = Depends(get_current_user),
):
    business_id = current_user.get("business_id")
    if not business_id:
        raise HTTPException(status_code=400, detail="Missing business_id in token")

    if db.pool is None:
        raise RuntimeError("Database pool is not initialized")

    result = await communicate_for_alert(
        business_id=business_id,
        pool=db.pool,
        alert_id=req.alert_id,
        channels=req.channels,
        recipients=req.recipients,
        language=req.language,
        user_id=req.user_id,
    )

    return result
