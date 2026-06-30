import json

from langchain.tools import tool

from features.project.service import ProjectService


def _format_project(project) -> dict:
    return {
        "id": project.id,
        "name": project.name,
        "status": project.status,
        "start_date": project.start_date,
        "duration": project.duration,
    }


def build_project_tools(
    project_service: ProjectService, requesting_role: str | None = None
):

    @tool
    async def list_projects() -> list[dict]:
        """List all projects with their name, status, start date, and
        duration."""

        projects = await project_service.list_all()
        return json.dumps([_format_project(p) for p in projects], default=str)

    @tool
    async def get_project(project_id: int) -> dict:
        """Get details for a single project by ID, including its name,
        status, start date, and duration."""

        project = await project_service.get(project_id)
        return json.dumps(_format_project(project), default=str)

    @tool
    async def get_projects_nearing_completion(days: int = 14) -> list[dict]:
        """Return non-closed projects whose computed end date
        (start_date + duration) falls within the given number of days
        (default 14). Use for 'wrapping up soon' / 'ending this month'
        type questions."""

        projects = await project_service.get_nearing_completion(days=days)
        return json.dumps([_format_project(p) for p in projects], default=str)

    return [list_projects, get_project, get_projects_nearing_completion]
