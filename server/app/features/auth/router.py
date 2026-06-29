from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from features.auth.service import AuthService
from core.dependencies import get_auth_service


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def list_employees(
    payload: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service),
):
    return await service.login(payload)
