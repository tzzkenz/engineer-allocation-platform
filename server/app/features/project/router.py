from fastapi import APIRouter, Depends, status

from core.dependencies import get_employee_service, get_project_service
from features.project.service import ProjectService
from features.project.schemas import ProjectCreate, ProjectEmployeeBatchCreate, ProjectEmployeeResponse, ProjectResponse, ProjectStaffingStatusResponse, ProjectUpdate
from features.auth.dependencies import get_current_user
from features.auth.schemas import TokenPayload
from features.employee.service import EmployeeService


router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    service: ProjectService = Depends(get_project_service),
):
    return await service.list_all()


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
):
    return await service.create(payload)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    payload: ProjectUpdate,
    service: ProjectService = Depends(get_project_service),
):
    return await service.update(project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    service: ProjectService = Depends(get_project_service),
):
    await service.delete(project_id)



@router.post(
    "/allocations", 
    response_model=list[ProjectEmployeeResponse], 
    status_code=status.HTTP_201_CREATED
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