from langchain.tools import tool

from features.employee.service import EmployeeService


def build_employee_tools(
    employee_service: EmployeeService, requesting_role: str | None = None
):

    @tool
    async def list_all_employees() -> list[dict]:
        """Return all employees in the company, including their name, email,
        experience, date of joining, and system role. Use this when asked to
        list, browse, or search across all employees (e.g. "who works here",
        "list all engineers")."""

        # if requesting_role not in ("HR", "ADMIN"):
        # return [{"error": "Not authorized to list all employees."}]
        return await employee_service.list()

    @tool
    async def get_employee(employee_id: int) -> dict:
        """Get full details for a single employee by their numeric ID,
        including name, email, experience, and date of joining."""

        return await employee_service.get(employee_id)

    @tool
    async def get_employee_skills(employee_id: int) -> list[dict]:
        """Get the list of skills for a specific employee by their ID,
        including skill name, type, proficiency level, and whether the
        skill is marked as an area of interest (for upskilling)."""

        skills = await employee_service.get_skills(employee_id)
        return [s.model_dump() for s in skills]

    return [list_all_employees, get_employee, get_employee_skills]
