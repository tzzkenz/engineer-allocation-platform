from jose import JWTError, jwt


from features.auth.schemas import LoginRequest
from features.auth.utils import (
    create_access_token,
    create_refresh_token,
    verify_password,
)
from features.auth.repository import AuthRepository
from exceptions import UnauthorizedException
from core.config import settings


class AuthService:
    def __init__(self, repo: AuthRepository):
        self.repo = repo

    async def login(self, payload: LoginRequest):
        employee = await self.repo.get_by_email(payload.username)

        if employee is None:
            raise UnauthorizedException("Invalid email or password")
        if not verify_password(payload.password, employee.password_hash):
            raise UnauthorizedException("Invalid email or password")

        access_token = create_access_token(
            {"id": employee.id, "system_role_id": employee.system_role_id}
        )
        refresh_token = create_refresh_token(
            {"id": employee.id, "system_role_id": employee.system_role_id}
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }


def refresh_token_service(refresh_token: str):
    try:
        payload = jwt.decode(
            refresh_token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )

        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token")

        email = payload.get("email")
        id = payload.get("id")
        role = payload.get("role")

        new_access_token = create_access_token({"id": id, "email": email, "role": role})

        return {"access_token": new_access_token, "token_type": "bearer"}

    except JWTError:
        raise UnauthorizedException("Invalid or expired refresh token")
