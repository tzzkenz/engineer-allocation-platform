from fastapi import APIRouter, Depends, Query, status

from core.dependencies import get_project_service
from features.project.service import ProjectService
from features.project.schemas import ProjectAssignedEmployeeResponse, ProjectCreate, ProjectEmployeeBatchCreate, ProjectEmployeeResponse, ProjectPaginatedResponse, ProjectResponse, ProjectStaffingStatusResponse, ProjectUpdate
from features.auth.dependencies import get_current_user
from features.auth.schemas import TokenPayload


router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=ProjectPaginatedResponse)
async def list_projects(
    service: ProjectService = Depends(get_project_service),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1),
):
    return await service.list_all(page=page, limit=limit)

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    service: ProjectService = Depends(get_project_service),
):
    return await service.get(project_id)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    service: ProjectService = Depends(get_project_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.create(payload, current_user.id)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    payload: ProjectUpdate,
    service: ProjectService = Depends(get_project_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.update(project_id, payload, current_user.id)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    service: ProjectService = Depends(get_project_service),
):
    await service.delete(project_id)


@router.post(
    "/allocations",
    response_model=list[ProjectEmployeeResponse],
    status_code=status.HTTP_201_CREATED,
)
async def allocate_employees_to_project(
    payload: ProjectEmployeeBatchCreate,
    service: ProjectService = Depends(get_project_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.allocate_employees_batch(payload, current_user.id)


@router.get("/{project_id}/status", response_model=ProjectStaffingStatusResponse)
async def get_project_staffing_status(
    project_id: int,
    service: ProjectService = Depends(get_project_service),
):
    return await service.get_project_staffing_status(project_id)

@router.get("/{project_id}/employees", response_model=list[ProjectAssignedEmployeeResponse])
async def get_project_employees(
    project_id: int,
    service: ProjectService = Depends(get_project_service),
):
    return await service.get_project_employees(project_id)