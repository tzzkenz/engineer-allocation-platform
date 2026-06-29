from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from exceptions import UnauthorizedException
from features.auth.schemas import TokenPayload
from features.auth.utils import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise UnauthorizedException("Invalid or expired token")
    return TokenPayload(**payload)


def require_role(*roles: int):
    def role_checker(
        current_user: TokenPayload = Depends(get_current_user),
    ) -> TokenPayload:
        if current_user.system_role_id not in roles:
            raise UnauthorizedException("You do not have permisson for this action")
        return current_user

    return role_checker
