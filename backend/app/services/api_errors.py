"""Stable bilingual user-facing API errors."""
from __future__ import annotations


class APIError(Exception):
    """An expected API failure safe to serialize to a student."""

    def __init__(self, status_code: int, code: str, message: str, *, file: str | None = None, details: dict | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.file = file
        self.details = details or {}
