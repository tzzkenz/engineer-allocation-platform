class DashboardService:
    def __init__(self, dashboard_repo):
        self.dashboard_repo = dashboard_repo

    async def get_dashboard(self):
        project_status = await self.dashboard_repo.project_count()
        employee_count = await self.dashboard_repo.employee_count()
        employee_by_role = await self.dashboard_repo.employee_count_by_role()

        project_coverage = await self.dashboard_repo.all_project_coverage()

        return {
            "employees": {
                "total": employee_count,
                "by_role": employee_by_role,
            },
            "projects": {
                "by_status": project_status,
                "coverage": project_coverage,
            },
        }
