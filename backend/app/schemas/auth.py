"""Authentication request and response contracts."""
import uuid

from pydantic import BaseModel, EmailStr, Field


class StudentRegister(BaseModel):
    """New student credentials."""

    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class StudentLogin(BaseModel):
    """Existing student credentials."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Bearer access token and authenticated student identity."""

    access_token: str
    token_type: str = "bearer"
    student_id: uuid.UUID
