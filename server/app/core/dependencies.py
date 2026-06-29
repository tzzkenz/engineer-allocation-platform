# app/core/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.features.system_role.repository import SystemRoleRepository
from app.features.system_role.service import SystemRoleService
from app.features.employee.repository import EmployeeRepository
from app.features.employee.service import EmployeeService


def get_system_role_service(db: AsyncSession = Depends(get_db)) -> SystemRoleService:
    return SystemRoleService(SystemRoleRepository(db))

def get_employee_service(db: AsyncSession = Depends(get_db)) -> "EmployeeService":
    return EmployeeService(EmployeeRepository(db))
