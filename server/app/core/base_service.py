class BaseService:
    def __init__(self, repo, audit_repo):
        self.repo = repo
        self.audit_repo = audit_repo

    async def _audit(
        self,
        entity,
        entity_id,
        action,
        user_id,
        field=None,
        old=None,
        new=None,
    ):
        await self.audit_repo.create(
            {
                "entity_name": entity,
                "entity_id": entity_id,
                "action": action,
                "field_name": field,
                "old_value": old,
                "new_value": new,
                "changed_by_id": user_id,
            }
        )

    async def audit_create(self, entity, entity_id, user_id):
        await self._audit(entity, entity_id, "CREATE", user_id)

    async def audit_delete(self, entity, entity_id, user_id):
        await self._audit(entity, entity_id, "DELETE", user_id)

    async def audit_update_fields(
        self,
        entity,
        entity_id,
        old_obj,
        new_data,
        user_id,
    ):
        for field, new_val in new_data.items():
            old_val = getattr(old_obj, field, None)

            old_str = str(old_val) if old_val is not None else None
            new_str = str(new_val) if new_val is not None else None

            if old_str != new_str:
                await self._audit(
                    entity,
                    entity_id,
                    "UPDATE",
                    user_id,
                    field,
                    old_str,
                    new_str,
                )
