from datetime import datetime

from langchain_core.tools import tool
from features.employee.service import EmployeeService
from features.agent.tools.helpers import (
    error_response,
    log_tool_event,
    success_response,
)


def make_employees_tools(employee_service: EmployeeService):

    @tool
    async def find_resources(
        skill: str | None = None,
        check_for_available: bool = False,
    ):
        """
        Find employees based on skill and availability.

        Use this tool when the user asks about:
        - employees with a specific skill (e.g., "Python developers")
        - available or free employees
        - employee roles, experience, or project load

        Args:
            skill:
                Optional. Filters employees by skill (case-insensitive).
                Example: "python", "react", "java"

            check_for_available:
                If True, returns only employees with fewer than 2 active projects.
                If False, returns all matching employees.

        Returns:
            A JSON string representing a list of employees. Each employee object contains:
            - id: Unique employee identifier
            - name: Employee name
            - email: Employee email
            - experience: Years of experience
            - date_of_joining: ISO formatted date (or null)
            - system_role_id: Role ID
            - system_role_name: Role name (e.g., Backend Engineer)
            - projects_count: Number of active projects
            - created_at: ISO formatted timestamp (or null)
            - updated_at: ISO formatted timestamp (or null)

        Notes:
            - The response is returned as a JSON string.
            - Always use this tool instead of guessing employee data.
            - Use `check_for_available=True` when the user asks for "available" or "free" employees.
        """

        try:
            data = await employee_service.list_all_employees_with_roll_for_agent(
                skill=skill,
                check_for_available=check_for_available,
            )

            log_tool_event(
                "employee_tool_logs.jsonl",
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "input": {
                        "skill": skill,
                        "check_for_available": check_for_available,
                    },
                    "output": data,
                },
            )

            return success_response(data)

        except Exception as e:
            log_tool_event(
                "employee_tool_logs.jsonl",
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "input": {
                        "skill": skill,
                        "check_for_available": check_for_available,
                    },
                    "error": str(e),
                },
            )

            return error_response(e)

    @tool
    async def get_employee_by_name(
        name: str,
    ):
        """
        Find employees by name (case-insensitive, partial match).

        Use this tool when the user asks about a specific employee by name,
        e.g., "who is John Smith" or "find employee named Priya".

        Args:
            name:
                Required. Full or partial employee name to search for.
                Example: "john", "Priya Nair"

        Returns:
            A JSON string representing a list of matching employees. Each employee
            object contains:
            - id: Unique employee identifier
            - name: Employee name
            - email: Employee email
            - experience: Years of experience
            - date_of_joining: ISO formatted date (or null)
            - system_role_id: Role ID
            - system_role_name: Role name (e.g., Backend Engineer)
            - projects_count: Number of active projects
            - created_at: ISO formatted timestamp (or null)
            - updated_at: ISO formatted timestamp (or null)

        Notes:
            - The response is returned as a JSON string.
            - Matching is partial and case-insensitive, so multiple employees
              may be returned if names are similar.
        """

        try:
            data = await employee_service.get_employee_by_name_for_agent(name=name)

            log_tool_event(
                "employee_tool_logs.jsonl",
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "input": {"name": name},
                    "output": data,
                },
            )

            return success_response(data)

        except Exception as e:
            log_tool_event(
                "employee_tool_logs.jsonl",
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "input": {"name": name},
                    "error": str(e),
                },
            )

            return error_response(e)

    return [find_resources, get_employee_by_name]
