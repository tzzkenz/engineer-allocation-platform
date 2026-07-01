import asyncio
from core.database import get_db
from features.project.repository import ProjectRepository
from features.project.service import ProjectService


async def main():
    async for db in get_db():
        repo = ProjectService(ProjectRepository(db))

        results = repo.list_all_for_agent()

        print(f"Total Employees: {results}\n")


# Run async function
asyncio.run(main())
