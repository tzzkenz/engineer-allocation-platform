from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    access_token: str
    token_type: str
    refresh_token: str | None = Field(default=None)


class TokenPayload(BaseModel):
    id: int
    email: EmailStr
    role: str


class RefreshRequest(BaseModel):
    refresh_token: str
