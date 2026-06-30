from fastapi import APIRouter, Depends

from core.dependencies import get_reporting_service
from features.reporting.schemas import (
    EngineerUtilization,
    PeriodicInsights,
    RotationCandidate,
    UpskillingGap,
)
from features.reporting.service import ReportingService

router = APIRouter(prefix="/reports", tags=["Reporting"])


@router.get("/utilization", response_model=list[EngineerUtilization])
async def get_utilization(
    service: ReportingService = Depends(get_reporting_service),
):
    return await service.get_engineer_utilization()


@router.get("/underutilized", response_model=list[EngineerUtilization])
async def get_underutilized(
    service: ReportingService = Depends(get_reporting_service),
):
    return await service.get_underutilized_engineers()


@router.get("/rotation_candidates", response_model=list[RotationCandidate])
async def get_rotation_candidates(
    threshold_days: int = 90,
    service: ReportingService = Depends(get_reporting_service),
):
    return await service.get_rotation_candidates(threshold_days)


@router.get("/upskilling_gaps", response_model=list[UpskillingGap])
async def get_upskilling_gaps(
    service: ReportingService = Depends(get_reporting_service),
):
    return await service.get_upskilling_gaps()


@router.get("/periodic_insights", response_model=PeriodicInsights)
async def get_periodic_insights(
    service: ReportingService = Depends(get_reporting_service),
):
    return await service.generate_periodic_insights()
