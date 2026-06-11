from pydantic import BaseModel


class DashboardKPIs(BaseModel):
    total_revenue_today: float
    active_alerts_count: int
    stock_health_percentage: float
    system_uptime: float
