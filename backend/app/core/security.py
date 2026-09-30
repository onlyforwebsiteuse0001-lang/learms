"""Password hashing and JWT authentication primitives."""
from __future__ import annotations

import hashlib
import hmac
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import jwt

from backend.app.core.config import Settings


def hash_password(password: str, salt: bytes | None = None) -> str:
    """Hash a password with salted PBKDF2-SHA256 for storage."""
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"{salt.hex()}:{digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    """Verify a password without timing-sensitive string comparison."""
    try:
        salt_hex, expected = stored.split(":", 1)
        actual = hash_password(password, bytes.fromhex(salt_hex)).split(":", 1)[1]
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_access_token(student_id: uuid.UUID, role: str, settings: Settings) -> str:
    """Create a time-limited signed access token for one student."""
    issued = datetime.now(timezone.utc)
    payload = {"sub": str(student_id), "role": role, "iat": issued, "exp": issued + timedelta(minutes=settings.access_token_minutes)}
    return jwt.encode(payload, settings.secret_key.get_secret_value(), algorithm="HS256")


def decode_access_token(token: str, settings: Settings) -> tuple[uuid.UUID, str]:
    """Validate token signature/expiry and return subject and role."""
    payload = jwt.decode(token, settings.secret_key.get_secret_value(), algorithms=["HS256"])
    return uuid.UUID(payload["sub"]), str(payload.get("role", "student"))
