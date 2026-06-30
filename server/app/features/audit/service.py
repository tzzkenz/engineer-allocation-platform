from typing import Any
from features.audit.repository import AuditLogRepository
from models.audit_log import AuditLog, EntityName, ActionType


class AuditLogService:
    def __init__(self, repo: AuditLogRepository):
        self.repo = repo

    async def create_log(self, log_data: dict[str, Any]) -> AuditLog:
        # Internal helper method invoked inside other feature business layers
        log = await self.repo.create(log_data)
        await self.repo.db.commit()
        return log

    async def get_logs(
        self,
        entity_name: EntityName | None = None,
        entity_id: int | None = None,
        action: ActionType | None = None,
        changed_by_id: int | None = None,
    ) -> list[AuditLog]:
        return await self.repo.list_filtered(
            entity_name=entity_name,
            entity_id=entity_id,
            action=action,
            changed_by_id=changed_by_id,
        )