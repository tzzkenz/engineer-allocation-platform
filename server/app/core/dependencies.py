# app/core/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from features.system_role.repository import SystemRoleRepository
from features.system_role.service import SystemRoleService


def get_system_role_service(db: AsyncSession = Depends(get_db)) -> SystemRoleService:
    return SystemRoleService(SystemRoleRepository(db))
