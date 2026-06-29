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
from features.skill.repository import SkillRepository
from features.skill.service import SkillService
from features.auth.repository import AuthRepository
from features.auth.service import AuthService
from features.requirement.repository import RequirementRepository
from features.requirement.service import RequirementService
from features.project_role.repository import ProjectRoleRepository
from features.project_role.service import ProjectRoleService


def get_system_role_service(db: AsyncSession = Depends(get_db)) -> SystemRoleService:
    return SystemRoleService(SystemRoleRepository(db))


def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(ProjectRepository(db))


def get_employee_service(db: AsyncSession = Depends(get_db)) -> EmployeeService:
    return EmployeeService(EmployeeRepository(db))


def get_feedback_service(db: AsyncSession = Depends(get_db)) -> FeedbackService:
    return FeedbackService(FeedbackRepository(db))


def get_skill_service(db: AsyncSession = Depends(get_db)) -> SkillService:
    return SkillService(SkillRepository(db))


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(AuthRepository(db))


def get_requirement_service(db: AsyncSession = Depends(get_db)) -> RequirementService:
    return RequirementService(RequirementRepository(db))


def get_project_role_service(db: AsyncSession = Depends(get_db)) -> ProjectRoleService:
    return ProjectRoleService(ProjectRoleRepository(db))
