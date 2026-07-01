import asyncio
from core.database import get_db
from features.employee.repository import EmployeeRepository


async def main():
    async for db in get_db():
        repo = EmployeeRepository(db)

        results, total = await repo.list_all_by_skill(skill="React")

        print(f"Total Employees: {total}\n")

        for emp, role_name, project_count in results:
            print(emp.name, role_name, project_count)


# Run async function
asyncio.run(main())
