from fastapi import APIRouter, Depends, Query

from core.dependencies import get_audit_log_service  
from features.audit.schemas import AuditLogResponse, EntityName, ActionType
from features.audit.service import AuditLogService

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get("", response_model=list[AuditLogResponse])
async def get_audit_logs(
    entity_name: EntityName | None = Query(default=None),
    entity_id: int | None = Query(default=None),
    action: ActionType | None = Query(default=None),
    changed_by_id: int | None = Query(default=None),
    service: AuditLogService = Depends(get_audit_log_service),
):
    return await service.get_logs(
        entity_name=entity_name,
        entity_id=entity_id,
        action=action,
        changed_by_id=changed_by_id,
    )