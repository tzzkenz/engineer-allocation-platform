from fastapi import APIRouter, Depends, status


from features.project_role.service import ProjectRoleService
from core.dependencies import get_project_role_service
from features.project_role.schemas import (
    ProjectRoleCreate,
    ProjectRoleResponse,
    ProjectRoleUpdate,
)

router = APIRouter(prefix="/project-roles", tags=["Project Roles"])


@router.post(
    "/",
    response_model=ProjectRoleResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project_role(
    payload: ProjectRoleCreate,
    service: ProjectRoleService = Depends(get_project_role_service),
):
    return await service.create(payload.name)


@router.get(
    "/{role_id}",
    response_model=ProjectRoleResponse,
)
async def get_project_role(
    role_id: int,
    service: ProjectRoleService = Depends(get_project_role_service),
):
    return await service.get(role_id)


@router.get(
    "/",
    response_model=list[ProjectRoleResponse],
)
async def list_project_roles(
    service: ProjectRoleService = Depends(get_project_role_service),
):
    return await service.list()


@router.put(
    "/{role_id}",
    response_model=ProjectRoleResponse,
)
async def update_project_role(
    role_id: int,
    payload: ProjectRoleUpdate,
    service: ProjectRoleService = Depends(get_project_role_service),
):
    return await service.update(role_id, payload.name)


@router.delete(
    "/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_project_role(
    role_id: int,
    service: ProjectRoleService = Depends(get_project_role_service),
):
    await service.delete(role_id)
    return None
