from sqlalchemy.exc import IntegrityError

from models.project_role import ProjectRole
from features.project_role.repository import ProjectRoleRepository
from exceptions import ConflictException, NotFoundException, UnknownException
from features import project_role


class ProjectRoleService:
    def __init__(self, repo: ProjectRoleRepository):
        self.repo = repo

    async def get(self, role_id: int) -> ProjectRole:
        role = await self.repo.get_by_id(role_id)
        if role is None:
            raise NotFoundException("Project role not found")
        return role

    async def list(self) -> list[ProjectRole]:
        return await self.repo.list_all()

    async def create(self, name: str) -> ProjectRole:
        try:
            # optional: prevent duplicates
            existing = await self.repo.get_by_name(name)
            if existing:
                raise ConflictException("Project role with this name already exists")
            
            result = await self.repo.create(name)
            
            await self.repo.db.commit()
            await self.repo.db.refresh(result)

            return result
            

        except ConflictException:
            raise
        except IntegrityError:
            raise ConflictException("Project role already exists")
        except Exception:
            raise UnknownException("Failed to create project role")

    async def update(self, role_id: int, name: str) -> ProjectRole:
        try:
            role = await self.repo.get_by_id(role_id)
            if role is None:
                raise NotFoundException("Project role not found")

            # optional: check duplicate name
            existing = await self.repo.get_by_name(name)
            if existing and existing.id != role_id:
                raise ConflictException("Project role with this name already exists")

            return await self.repo.update(role, name)

        except (NotFoundException, ConflictException):
            raise
        except IntegrityError:
            raise ConflictException("Project role update conflict")
        except Exception:
            raise UnknownException("Failed to update project role")

    async def delete(self, role_id: int) -> None:
        try:
            role = await self.repo.get_by_id(role_id)
            if role is None:
                raise NotFoundException("Project role not found")

            await self.repo.soft_delete(role)

        except NotFoundException:
            raise
        except Exception:
            raise UnknownException("Failed to delete project role")
