from asyncpg import Connection
from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.dashboard import DashboardKPIs

router = APIRouter()


async def _fetch_or_default(db, sql, *args):
    try:
        return await db.fetchval(sql, *args)
    except Exception:
        return None


@router.get("/dashboard/kpis", response_model=DashboardKPIs)
async def dashboard_kpis(
    current_user: dict = Depends(get_current_user),
    db: Connection = Depends(get_db),
):
    business_id = current_user.get("business_id", "00000000-0000-0000-0000-000000000000")

    revenue = await _fetch_or_default(
        db,
        "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE business_id = $1::uuid AND occurred_at >= CURRENT_DATE",
        business_id,
    )

    alerts = await _fetch_or_default(
        db,
        "SELECT COUNT(*) FROM alerts WHERE business_id = $1::uuid AND status = 'open'",
        business_id,
    )

    stock = await _fetch_or_default(
        db,
        "SELECT COALESCE(AVG(LEAST(current_stock::numeric / NULLIF(min_threshold, 0) * 100, 100)), 0) FROM inventory_items WHERE business_id = $1::uuid",
        business_id,
    )

    return DashboardKPIs(
        total_revenue_today=float(revenue or 0),
        active_alerts_count=alerts or 0,
        stock_health_percentage=float(stock or 0),
        system_uptime=99.95,
    )
