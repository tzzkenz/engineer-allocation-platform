from datetime import date, timedelta

from sqlalchemy.exc import IntegrityError

from exceptions import ConflictException, NotFoundException, UnknownException
from features.project.repository import ProjectRepository
from models.project import Project, StatusType
from features.project.schemas import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, repo: ProjectRepository):
        self.repo = repo

    async def get(self, project_id: int) -> Project:
        project = await self.repo.get_by_id(project_id)
        if project is None:
            raise NotFoundException("Project not found in DB")
        return project

    async def list_all(self) -> list[Project]:
        return await self.repo.list_all()

    async def create(self, data: ProjectCreate) -> Project:
        name = data.name.strip()

        existing = await self.repo.get_by_name(name)
        if existing is not None:
            raise ConflictException(f"Project with name '{name}' already exists")

        try:
            project = await self.repo.create(
                name=name,
                status=data.status,
                start_date=data.start_date,
                duration=data.duration,
            )
            await self.repo.db.commit()
            await self.repo.db.refresh(project)
            return project

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException(f"Project with name '{name}' already exists")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def update(self, project_id: int, data: ProjectUpdate) -> Project:
        project = await self.get(project_id)

        update_data = {}

        if data.name is not None:
            name = data.name.strip()

            existing = await self.repo.get_by_name(name)
            if existing is not None and existing.id != project_id:
                raise ConflictException(f"Project with name '{name}' already exists")

            update_data["name"] = name

        if data.start_date is not None:
            update_data["start_date"] = data.start_date

        if data.duration is not None:
            update_data["duration"] = data.duration

        if not update_data:
            return project

        try:
            project = await self.repo.update(project, **update_data)
            await self.repo.db.commit()
            await self.repo.db.refresh(project)
            return project

        except IntegrityError:
            await self.repo.db.rollback()
            raise UnknownException("Database integrity error during update")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def delete(self, project_id: int) -> None:
        project = await self.get(project_id)

        try:
            await self.repo.soft_delete(project)
            await self.repo.db.commit()

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Cannot delete project as it is in use")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def get_nearing_completion(self, days: int = 14) -> list[Project]:

        projects = await self.repo.list_all()
        today = date.today()
        cutoff = today + timedelta(days=days)

        result = []
        for project in projects:
            if (
                project.status != StatusType.ONGOING
                or project.start_date is None
                or project.duration is None
            ):
                continue

            end_date = project.start_date + timedelta(weeks=project.duration)

            if today <= end_date <= cutoff:
                result.append(project)

        return result
