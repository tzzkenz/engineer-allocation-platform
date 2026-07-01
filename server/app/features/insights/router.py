from fastapi import APIRouter, Depends, status

from core.dependencies import get_insight_service
from features.insights.schemas import InsightReportResponse
from features.insights.services import InsightService

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.post(
    "/generate",
    response_model=InsightReportResponse,
    status_code=status.HTTP_201_CREATED,
)
async def generate_insight_report(
    service: InsightService = Depends(get_insight_service),
):
    return await service.generate_report()


@router.get("/latest", response_model=InsightReportResponse)
async def get_latest_report(
    service: InsightService = Depends(get_insight_service),
):
    return await service.get_latest_report()


@router.get("/metrics")
async def get_metrics(
    service: InsightService = Depends(get_insight_service),
):
    return await service.compute_metrics()
