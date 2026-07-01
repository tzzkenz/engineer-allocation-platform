from langchain_core.tools import tool
from features.employee.service import EmployeeService


def make_employees_tools(employee_service: EmployeeService):

    @tool
    async def find_resources(
        skill: str | None = None, check_for_available: bool = False
    ):
        """
        List out all the employees with their names, roles,optionally filtered based on skill name. Also returns the number of prjects he is part of.
        """

        employees_with_role = (
            await employee_service.list_all_employees_with_roll_for_agent(
                skill, check_for_available
            )
        )
        return employees_with_role

    return [find_resources]
