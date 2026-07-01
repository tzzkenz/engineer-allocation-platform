from fastapi import APIRouter, Depends


from core.dependencies import get_dashboard_service
from features.dashboard.service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_dashboard_summary(
    service: DashboardService = Depends(get_dashboard_service),
):
    return await service.get_dashboard_summary()
