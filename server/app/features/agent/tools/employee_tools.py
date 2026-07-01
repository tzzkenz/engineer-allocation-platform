import json
from datetime import datetime

from langchain_core.tools import tool
from features.employee.service import EmployeeService


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

            response = json.dumps(data, indent=2, default=str)

            with open("employee_tool_logs.jsonl", "a") as f:
                f.write(
                    json.dumps(
                        {
                            "timestamp": datetime.utcnow().isoformat(),
                            "input": {
                                "skill": skill,
                                "check_for_available": check_for_available,
                            },
                            "output": data,
                        }
                    )
                    + "\n"
                )
            return response

        except Exception as e:
            error_response = {"error": str(e)}

            with open("employee_tool_logs.jsonl", "a") as f:
                f.write(
                    json.dumps(
                        {
                            "timestamp": datetime.utcnow().isoformat(),
                            "input": {
                                "skill": skill,
                                "check_for_available": check_for_available,
                            },
                            "error": str(e),
                        }
                    )
                    + "\n"
                )
            return json.dumps(error_response)

    return [find_resources]
