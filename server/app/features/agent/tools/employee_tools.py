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
        Returns a list of employees with:
        - name
        - role
        - number of active projects
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
