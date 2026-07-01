from datetime import datetime

from langchain_core.tools import tool
from features.project.service import ProjectService
from features.agent.tools.helpers import (
    error_response,
    log_tool_event,
    success_response,
)


def make_project_tools(project_service: ProjectService):

    @tool
    async def list_projects():
        """
        Retrieve a list of all projects.

        Use this tool when the user asks about:
        - all projects
        - project listings
        - project summaries or statuses

        Returns:
            A list of project objects. Each project contains:
            - id: Unique project identifier
            - name: Project name
            - status: Current project status (e.g., active, completed)
            - start_date: ISO formatted start date (or null)
            - end_date: ISO formatted end date (or null)

        Notes:
            - This tool returns raw project data as a list of dictionaries.
            - Do NOT generate or assume project data manually.
            - If the user asks for filtered projects (by status, name, etc.),
            this tool may still be used, but filtering may need to be handled in reasoning.
        """

        try:
            data = await project_service.list_all_for_agent()

            log_tool_event(
                "project_tool_logs.jsonl",
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "output": data,
                },
            )

            return success_response(data)

        except Exception as e:
            log_tool_event(
                "project_tool_logs.jsonl",
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "error": str(e),
                },
            )

            return error_response(e)

    return [list_projects]
