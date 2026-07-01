from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db

from features.system_role.repository import SystemRoleRepository
from features.project.repository import ProjectRepository
from features.employee.repository import EmployeeRepository
from features.feedback.repository import FeedbackRepository
from features.skill.repository import SkillRepository
from features.auth.repository import AuthRepository
from features.requirement.repository import RequirementRepository
from features.project_role.repository import ProjectRoleRepository
from features.audit.repository import AuditLogRepository
from features.reporting.repository import ReportingRepository

from features.system_role.service import SystemRoleService
from features.project.service import ProjectService
from features.employee.service import EmployeeService
from features.feedback.service import FeedbackService
from features.skill.service import SkillService
from features.auth.service import AuthService
from features.requirement.service import RequirementService
from features.project_role.service import ProjectRoleService
from features.audit.service import AuditLogService
from features.reporting.service import ReportingService
from features.dashboard.repository import DashboardRepository
from features.dashboard.service import DashboardService
from features.agent.agent import make_llm
from features.insights.repository import InsightRepository
from features.insights.services import InsightService


def get_audit_repo(db: AsyncSession) -> AuditLogRepository:
    return AuditLogRepository(db)


def get_system_role_service(
    db: AsyncSession = Depends(get_db),
) -> SystemRoleService:
    return SystemRoleService(
        SystemRoleRepository(db),
        get_audit_repo(db),
    )


def get_project_service(
    db: AsyncSession = Depends(get_db),
) -> ProjectService:
    return ProjectService(
        ProjectRepository(db),
        get_audit_repo(db),
    )


def get_employee_service(
    db: AsyncSession = Depends(get_db),
) -> EmployeeService:
    return EmployeeService(
        EmployeeRepository(db),
        get_audit_repo(db),
    )


def get_feedback_service(
    db: AsyncSession = Depends(get_db),
) -> FeedbackService:
    return FeedbackService(
        FeedbackRepository(db),
        get_audit_repo(db),
    )


def get_skill_service(
    db: AsyncSession = Depends(get_db),
) -> SkillService:
    return SkillService(
        SkillRepository(db),
    )


def get_requirement_service(
    db: AsyncSession = Depends(get_db),
) -> RequirementService:
    return RequirementService(
        RequirementRepository(db),
        get_audit_repo(db),
    )


def get_project_role_service(
    db: AsyncSession = Depends(get_db),
) -> ProjectRoleService:
    return ProjectRoleService(
        ProjectRoleRepository(db),
    )


def get_auth_service(
    db: AsyncSession = Depends(get_db),
) -> AuthService:
    return AuthService(AuthRepository(db))


def get_audit_log_service(
    db: AsyncSession = Depends(get_db),
) -> AuditLogService:
    return AuditLogService(AuditLogRepository(db))


def get_reporting_service(
    db: AsyncSession = Depends(get_db),
) -> ReportingService:
    return ReportingService(ReportingRepository(db))


def get_dashboard_service(
    db: AsyncSession = Depends(get_db),
) -> ReportingService:
    return DashboardService(DashboardRepository(db))


def get_insight_service(db: AsyncSession = Depends(get_db)) -> InsightService:
    return InsightService(InsightRepository(db), make_llm())
