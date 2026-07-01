from fastapi import APIRouter, Depends, status

from core.dependencies import get_system_role_service
from features.system_role.schemas import (
    SystemRoleCreate,
    SystemRolePatch,
    SystemRoleResponse,
)
from features.system_role.service import SystemRoleService
from features.auth.dependencies import get_current_user
from features.auth.schemas import TokenPayload

router = APIRouter(prefix="/system_roles", tags=["System Roles"])


@router.get("", response_model=list[SystemRoleResponse])
async def list_system_roles(
    service: SystemRoleService = Depends(get_system_role_service),
):
    return await service.list()


@router.get("/{role_id}", response_model=SystemRoleResponse)
async def get_system_role(
    role_id: int,
    service: SystemRoleService = Depends(get_system_role_service),
):
    return await service.get(role_id)


@router.post("", response_model=SystemRoleResponse, status_code=status.HTTP_201_CREATED)
async def create_system_role(
    payload: SystemRoleCreate,
    service: SystemRoleService = Depends(get_system_role_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.create(payload.name, current_user.id)


@router.patch("/{role_id}", response_model=SystemRoleResponse)
async def update_system_role(
    role_id: int,
    payload: SystemRolePatch,
    service: SystemRoleService = Depends(get_system_role_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.update(role_id, payload.name, current_user.id)


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_system_role(
    role_id: int,
    service: SystemRoleService = Depends(get_system_role_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.delete(role_id, current_user.id)
