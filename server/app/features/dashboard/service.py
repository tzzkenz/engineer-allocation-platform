class DashboardService:
    def __init__(self, dashboard_repo):
        self.dashboard_repo = dashboard_repo

    async def get_project_status_summary(self):
        return await self.dashboard_repo.project_count()
