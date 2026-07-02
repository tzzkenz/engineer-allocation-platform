from datetime import date, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.insight_report import InsightReport
from models.project_requirement_request import ProjectRequirementRequest
from models.employee import Employee
from models.employee_skill import EmployeeSkill
from models.project import Project, StatusType
from models.project_employee import ProjectEmployee

ROTATION_THRESHOLD_DAYS = 90
LOW_PROFICIENCY_BAR = 2


class InsightRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_project_counts(self) -> dict[int, int]:
        stmt = (
            select(
                ProjectEmployee.employee_id,
                func.count(ProjectEmployee.id),
            )
            .join(Project, ProjectEmployee.project_id == Project.id)
            .where(
                ProjectEmployee.date_exited.is_(None),
                Project.status == StatusType.ONGOING,
            )
            .group_by(ProjectEmployee.employee_id)
        )

        result = await self.db.execute(stmt)
        return dict(result.all())

    async def get_active_employees(self) -> list[Employee]:
        stmt = select(Employee).where(Employee.end_date.is_(None))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_stale_assignments(self) -> list[tuple[ProjectEmployee, str]]:
        cutoff = date.today() - timedelta(days=ROTATION_THRESHOLD_DAYS)

        stmt = (
            select(ProjectEmployee, Project.name)
            .join(Project, ProjectEmployee.project_id == Project.id)
            .where(
                ProjectEmployee.date_exited.is_(None),
                Project.status == StatusType.ONGOING,
                ProjectEmployee.is_shadow.is_(False),
                ProjectEmployee.date_assigned <= cutoff,
            )
        )

        result = await self.db.execute(stmt)
        return list(result.all())

    async def get_open_requirement_requests(self) -> list[ProjectRequirementRequest]:
        stmt = (
            select(ProjectRequirementRequest)
            .options(selectinload(ProjectRequirementRequest.stack_requests))
            .where(
                ProjectRequirementRequest.assigned_count
                < ProjectRequirementRequest.requested_count
            )
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def count_qualified_employees(self, stack_ids: list[int]) -> int:
        if not stack_ids:
            return 0

        stmt = select(func.count(func.distinct(EmployeeSkill.employee_id))).where(
            EmployeeSkill.skill_id.in_(stack_ids),
            EmployeeSkill.proficiency >= LOW_PROFICIENCY_BAR,
            EmployeeSkill.is_interest.is_(False),
        )

        result = await self.db.execute(stmt)
        return result.scalar() or 0

    async def get_interested_low_proficiency_employees(
        self, stack_ids: list[int]
    ) -> list[int]:

        if not stack_ids:
            return []

        stmt = select(EmployeeSkill.employee_id).where(
            EmployeeSkill.skill_id.in_(stack_ids),
            EmployeeSkill.is_interest.is_(True),
        )

        result = await self.db.execute(stmt)
        return [row[0] for row in result.all()]

    async def create_report(self, report_data: dict[str, Any]) -> InsightReport:
        report = InsightReport(**report_data)
        self.db.add(report)
        await self.db.flush()
        return report

    async def get_latest_report(self) -> InsightReport | None:
        stmt = select(InsightReport).order_by(InsightReport.created_at.desc()).limit(1)

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
