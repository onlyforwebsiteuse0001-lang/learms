"""Minimal student authentication routes for Phase 1 document ownership."""
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from backend.app.database import get_db_session
from backend.app.models.document import Student
from backend.app.schemas.auth import StudentLogin, StudentRegister, TokenResponse
from backend.app.services.api_errors import APIError

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: StudentRegister, session: Annotated[AsyncSession, Depends(get_db_session)]) -> TokenResponse:
    """Register a student and return a signed access token."""
    email = data.email.lower()
    if await session.scalar(select(Student.student_id).where(Student.email == email)):
        raise APIError(409, "email_exists", "An account already exists for this email. / Is email ka account pehle se maujood hai.")
    student = Student(name=data.name.strip(), email=email, password_hash=hash_password(data.password), role="student")
    session.add(student)
    await session.flush()
    return TokenResponse(access_token=create_access_token(student.student_id, student.role, get_settings()), student_id=student.student_id)


@router.post("/login", response_model=TokenResponse)
async def login(data: StudentLogin, session: Annotated[AsyncSession, Depends(get_db_session)]) -> TokenResponse:
    """Authenticate an existing student without exposing which credential failed."""
    student = (await session.execute(select(Student).where(Student.email == data.email.lower()))).scalar_one_or_none()
    if not student or not verify_password(data.password, student.password_hash):
        raise APIError(401, "invalid_credentials", "Email or password is incorrect. / Email ya password ghalat hai.")
    return TokenResponse(access_token=create_access_token(student.student_id, student.role, get_settings()), student_id=student.student_id)
