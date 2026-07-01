from sqlalchemy.exc import IntegrityError

from models import SystemRole
from features.system_role.repository import SystemRoleRepository
from exceptions import ConflictException, NotFoundException, UnknownException
from core.base_service import BaseService
from features.audit.repository import AuditLogRepository


class SystemRoleService(BaseService):
    def __init__(self, repo: SystemRoleRepository, audit_repo: AuditLogRepository):
        super().__init__(repo, audit_repo)

    async def get(self, role_id: int) -> SystemRole:
        role = await self.repo.get_by_id(role_id)
        if role is None:
            raise NotFoundException("System role not found in DB")
        return role

    async def list(self) -> list[SystemRole]:
        return await self.repo.list_all()

    async def create(self, name: str, user_id: int) -> SystemRole:
        name = name.strip()
        existing = await self.repo.get_by_name(name)
        if existing is not None:
            raise ConflictException(f"System role with {name} already exists")
        try:
            role = await self.repo.create(name)

            # await self.audit_create(
            #     "SYSTEM_ROLE",
            #     role.id,
            #     user_id,
            # )

            await self.repo.db.commit()
            return role
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException(f"System role with {name} already exists")

    async def update(self, role_id: int, name: str | None, user_id: int) -> SystemRole:
        role = await self.get(role_id)

        if name is None:
            return role

        name = name.strip()
        existing = await self.repo.get_by_name(name)
        if existing is not None and existing.id != role_id:
            raise ConflictException("Name already exists")

        try:
            # old_data = {"name": role.name}
            # new_data = {"name": name}
            role = await self.repo.update(role, name)

            # await self.audit_update_fields(
            #     "SYSTEM_ROLE",
            #     role_id,
            #     role,
            #     new_data,
            #     user_id,
            # )

            await self.repo.db.commit()
            await self.repo.db.refresh(role)
            return role
        except IntegrityError:
            await self.repo.db.rollback()
            raise UnknownException("Something went wrong")

    async def delete(self, role_id: int, user_id: int) -> None:
        role = await self.get(role_id)
        try:
            await self.repo.soft_delete(role)

            # await self.audit_delete(
            #     "SYSTEM_ROLE",
            #     role_id,
            #     user_id,
            # )

            await self.repo.db.commit()
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Cannot delete role as it is in use")
