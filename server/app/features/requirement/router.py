from datetime import date

from fastapi import APIRouter, Depends, Query, status

from core.dependencies import get_requirement_service
from features.requirement.schemas import (
    AvailabilityFilter,
    MatchedEmployeePaginatedResponse,
    MatchedEmployeeResponse,
    RequirementCreate,
    RequirementResponse,
    RequirementUpdate,
    StackRequirementCreate,
    StackRequirementResponse,
)
from features.requirement.service import RequirementService
from features.auth.dependencies import get_current_user
from features.auth.schemas import TokenPayload

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
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.create(
        project_id=project_id,
        project_role_id=payload.project_role_id,
        requested_count=payload.requested_count,
        requested_by=current_user.id,
        stack_ids=payload.stack_ids,
        current_user=current_user,
    )


@router.get("/{project_id}/requirements", response_model=list[RequirementResponse])
async def get_requirements_for_project(
    project_id: int, service: RequirementService = Depends(get_requirement_service)
):
    return await service.get(project_id=project_id)


@router.get("/requirements/{request_id}", response_model=RequirementResponse)
async def get_requirement(
    request_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.get(request_id=request_id)


@router.get("/requirements", response_model=list[RequirementResponse])
async def list_requirements(
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.list_all()


@router.patch("/requirements/{request_id}", response_model=RequirementResponse)
async def update_requirement(
    request_id: int,
    payload: RequirementUpdate,
    service: RequirementService = Depends(get_requirement_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.update(
        request_id=request_id,
        user_id=current_user.id,
        requested_count=payload.requested_count,
        status=payload.status,
        resolved_by=payload.resolved_by,
    )


@router.delete("/requirements/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requirement(
    request_id: int,
    service: RequirementService = Depends(get_requirement_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.delete(request_id, current_user.id)


@router.post(
    "/requirements/{request_id}/stacks",
    response_model=StackRequirementResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_stack_requirement(
    request_id: int,
    payload: StackRequirementCreate,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.add_stack(request_id=request_id, stack_id=payload.stack_id)


@router.get(
    "/requirements/{request_id}/stacks",
    response_model=list[StackRequirementResponse],
)
async def list_stack_requirements(
    request_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.list_stacks(request_id=request_id)


@router.delete(
    "/requirements/{request_id}/stacks/{stack_request_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_stack_requirement(
    request_id: int,
    stack_request_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    await service.remove_stack(request_id=request_id, stack_request_id=stack_request_id)


@router.get(
    "/requirements/{request_id}/matches",
    response_model=list[MatchedEmployeeResponse],
    status_code=status.HTTP_200_OK,
)
async def get_matching_candidates(
    request_id: int,
    service: RequirementService = Depends(get_requirement_service),
):
    return await service.get_candidate_matches(request_id)


@router.get("/search/matches", response_model=MatchedEmployeePaginatedResponse)
async def search_candidates(
    identifier: str | None = Query(
        default=None,
        description="Search parameter accepting an ID, exact Email, or partial Name",
    ),
    skill_ids: list[int] = Query(default=[]),
    availability: AvailabilityFilter = Query(default=AvailabilityFilter.ALL),
    sort_by_experience: bool = Query(
        default=True, description="True for high-to-low, False for low-to-high"
    ),
    sort_by_proficiency: bool = Query(
        default=True, description="True for high-to-low, False for low-to-high"
    ),
    requirement_request_id: int | None = Query(
        default=None,
        description="Requirement request ID to check assignment exclusions against",
    ),
    available_after: date | None = Query(
        default=None, 
        description="Show employees whose capacity and contracts are valid after this date"
    ),
    service: RequirementService = Depends(get_requirement_service),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1),
):
    return await service.get_filtered_candidates(
        identifier=identifier,
        skill_ids=skill_ids,
        availability=availability.value,
        sort_by_experience=sort_by_experience,
        sort_by_proficiency=sort_by_proficiency,
        requirement_request_id=requirement_request_id,
        available_after=available_after,
        page=page,
        limit=limit,
    )