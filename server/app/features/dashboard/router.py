from fastapi import APIRouter, Depends


from core.dependencies import get_dashboard_service
from features.dashboard.service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/projects/count")
async def get_project_count(
    service: DashboardService = Depends(get_dashboard_service),
):
    return await service.get_project_status_summary()
