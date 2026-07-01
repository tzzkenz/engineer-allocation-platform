from langchain_core.tools import tool
from features.project.service import ProjectService


def make_project_tools(project_service: ProjectService):

    @tool
    async def list_projects():
        """
        Returns lits of projects
        """

        data = await project_service.list_all_for_agent()
        print(data)
        return data

    return [list_projects]
