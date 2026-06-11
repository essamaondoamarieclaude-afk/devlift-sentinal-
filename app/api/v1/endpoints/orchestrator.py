from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

import app.core.database as db
from app.agents.orchestrator import Orchestrator
from app.core.security import get_current_user

router = APIRouter()


class ProcessAlertRequest(BaseModel):
    alert_id: str


@router.post("/orchestrator/process_alert")
async def process_alert(
    req: ProcessAlertRequest,
    current_user: dict = Depends(get_current_user),
):
    business_id = current_user.get("business_id")
    if not business_id:
        raise HTTPException(status_code=400, detail="Missing business_id in token")
    if db.pool is None:
        raise RuntimeError("Database pool is not initialized")

    orchestrator = Orchestrator(business_id, db.pool)
    result = await orchestrator.process_alert(req.alert_id)
    return result
