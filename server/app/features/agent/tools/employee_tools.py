from langchain_core.tools import tool
from features.employee.service import EmployeeService


def make_employees_tools(employee_service: EmployeeService):

    @tool
    async def find_available_resources():
        """
        List out all the employees with their names
        """

        employees_with_role = (
            await employee_service.list_all_employees_with_roll_for_agent()
        )
        return employees_with_role

    return [find_available_resources]
