from datetime import datetime, timedelta

import bcrypt
from jose import JWTError, jwt

from core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


def create_access_token(payload):
    to_encode = payload.copy()
    expire = datetime.now() + timedelta(minutes=settings.jwt_expiry_minutes)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.jwt_secret, settings.jwt_algorithm)


def decode_access_token(token: str):
    try:
        return jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
    except JWTError:
        return None


def create_refresh_token(payload):
    to_encode = payload.copy()
    expire = datetime.now() + timedelta(days=7)
    to_encode["exp"] = expire
    to_encode["type"] = "refresh"
    return jwt.encode(to_encode, settings.jwt_secret, settings.jwt_algorithm)
