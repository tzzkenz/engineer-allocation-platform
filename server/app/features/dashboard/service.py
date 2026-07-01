class DashboardService:
    def __init__(self, dashboard_repo):
        self.dashboard_repo = dashboard_repo

    async def get_dashboard_summary(self):
        project_status = await self.dashboard_repo.project_count()
        employee_count = await self.dashboard_repo.employee_count()
        employee_by_role = await self.dashboard_repo.employee_count_by_role()

        return {
            "projects_by_status": project_status,
            "total_employees": employee_count,
            "employees_by_role": employee_by_role,
        }
