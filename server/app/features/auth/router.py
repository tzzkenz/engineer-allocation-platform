from fastapi import APIRouter, Depends

from features.auth.service import AuthService
from core.dependencies import get_auth_service
from features.auth.schemas import LoginRequest


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def list_employees(
    payload: LoginRequest, service: AuthService = Depends(get_auth_service)
):
    return await service.login(payload)
