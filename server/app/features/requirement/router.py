from fastapi import APIRouter, Depends, status

from core.dependencies import get_requirement_service
from features.requirement.schemas import (
    RequirementCreate,
    RequirementResponse,
    RequirementUpdate,
)
from features.requirement.service import RequirementService

router = APIRouter(prefix="/project", tags=["Project requirements"])


@router.post(
    "/{project_id}/requirements",
    response_model=RequirementResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_requirement(
    payload: RequirementCreate,
    project_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.create(
        project_id=project_id,
        project_role_id=payload.project_role_id,
        requested_count=payload.requested_count,
        requested_by=payload.requested_by,
    )


@router.get("/{project_id}/requirements", response_model=list[RequirementResponse])
async def get_requirements_for_project(
    project_id: int, service: RequirementService = Depends(get_requirement_service)
):
    return await service.get(project_id=project_id)


@router.get("/{request_id}", response_model=RequirementResponse)
async def get_requirement(
    request_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.get(request_id=request_id)


@router.get("/", response_model=list[RequirementResponse])
async def list_requirements(
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.list()


@router.patch("/{request_id}", response_model=RequirementResponse)
async def update_requirement(
    request_id: int,
    payload: RequirementUpdate,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.update(
        request_id=request_id,
        requested_count=payload.requested_count,
        status=payload.status,
        resolved_by=payload.resolved_by,
    )


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requirement(
    request_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    await service.delete(request_id)
