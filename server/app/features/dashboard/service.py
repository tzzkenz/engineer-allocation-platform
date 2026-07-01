from features.dashboard.repository import DashboardRepository


class DashboardService:
    def __init__(self, dashboard_repo: DashboardRepository):
        self.dashboard_repo = dashboard_repo

    async def get_dashboard(self):
        employees_total = await self.dashboard_repo.employee_count()
        employees_by_role = await self.dashboard_repo.employee_count_by_role()
        projects_by_status = await self.dashboard_repo.project_count_with_status()
        projects_total = await self.dashboard_repo.project_count()
        skill_coverage = await self.dashboard_repo.skill_coverage_by_skill()

        return {
            "employees": {
                "total": employees_total,
                "by_role": employees_by_role,
            },
            "projects": {
                "total": projects_total,
                "by_status": projects_by_status,
            },
            "skill_coverage": skill_coverage,
        }
