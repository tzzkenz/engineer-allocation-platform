from fastapi import APIRouter, Depends, status

from core.dependencies import get_project_service
from features.project.service import ProjectService
from features.project.schemas import ProjectCreate, ProjectResponse, ProjectUpdate


router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    service: ProjectService = Depends(get_project_service),
):
    return await service.list()


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
