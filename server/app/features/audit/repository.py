from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.audit_log import AuditLog, EntityName, ActionType


class AuditLogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, log_data: dict[str, Any]) -> AuditLog:
        log = AuditLog(**log_data)
        self.db.add(log)
        await self.db.flush()
        return log

    async def list_filtered(
        self,
        entity_name: EntityName | None = None,
        entity_id: int | None = None,
        action: ActionType | None = None,
        changed_by_id: int | None = None,
    ) -> list[AuditLog]:
        stmt = select(AuditLog)

        if entity_name is not None:
            stmt = stmt.where(AuditLog.entity_name == entity_name)
        if entity_id is not None:
            stmt = stmt.where(AuditLog.entity_id == entity_id)
        if action is not None:
            stmt = stmt.where(AuditLog.action == action)
        if changed_by_id is not None:
            stmt = stmt.where(AuditLog.changed_by_id == changed_by_id)

        stmt = stmt.order_by(AuditLog.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars())