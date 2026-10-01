"""Shared FastAPI authentication dependencies."""
from __future__ import annotations

from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.core.security import decode_access_token
from backend.app.database import get_db_session
from backend.app.models.document import Student
from backend.app.services.api_errors import APIError

bearer = HTTPBearer(auto_error=False)


async def get_current_student(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> Student:
    """Authenticate a bearer token and load its active student identity."""
    if not credentials or credentials.scheme.lower() != "bearer":
        raise APIError(401, "authentication_required", "Authentication required. / Login zaroori hai.")
    try:
        student_id, role = decode_access_token(credentials.credentials, get_settings())
    except (jwt.PyJWTError, ValueError, KeyError):
        raise APIError(401, "invalid_token", "Invalid or expired token. / Token ghalat ya expire ho chuka hai.")
    student = await session.get(Student, student_id)
    if not student or student.role != role:
        raise APIError(401, "invalid_token", "Invalid or expired token. / Token ghalat ya expire ho chuka hai.")
    return student
