# app/core/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from features.system_role.repository import SystemRoleRepository
from features.system_role.service import SystemRoleService
from features.project.service import ProjectService
from features.project.repository import ProjectRepository
from features.employee.repository import EmployeeRepository
from features.employee.service import EmployeeService
from features.feedback.service import FeedbackService
from features.feedback.repository import FeedbackRepository


def get_system_role_service(db: AsyncSession = Depends(get_db)) -> SystemRoleService:
    return SystemRoleService(SystemRoleRepository(db))


def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(ProjectRepository(db))


def get_employee_service(db: AsyncSession = Depends(get_db)) -> EmployeeService:
    return EmployeeService(EmployeeRepository(db))


def get_feedback_service(db: AsyncSession = Depends(get_db)) -> FeedbackService:
    return FeedbackService(FeedbackRepository(db))
