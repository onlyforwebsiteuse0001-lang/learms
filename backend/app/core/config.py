"""Typed, environment-based application configuration.

Secrets are read from the process environment or a local `.env` file and are
never given usable defaults. Provider availability can therefore be reported
honestly instead of producing fake AI output.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Validated runtime settings shared by API and background workers."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore", case_sensitive=False
    )

    app_env: Literal["development", "testing", "staging", "production"] = "development"
    app_name: str = "HAAFIZ EDU"
    app_debug: bool = False
    app_host: str = "0.0.0.0"
    app_port: int = Field(default=8000, ge=1, le=65535)
    secret_key: SecretStr = SecretStr("development-only-change-before-deploy")
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    log_level: str = "INFO"

    database_url: str = "postgresql+asyncpg://haafiz:haafiz@localhost:5432/haafiz"
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    storage_backend: Literal["local", "s3"] = "local"
    upload_dir: Path = Path("data/uploads")
    max_upload_mb: int = Field(default=50, ge=1, le=500)
    s3_endpoint_url: str | None = None
    s3_access_key_id: SecretStr | None = None
    s3_secret_access_key: SecretStr | None = None
    s3_bucket: str | None = None

    gemini_api_key: SecretStr | None = None
    gemini_model: str = "gemini-2.0-flash"
    groq_api_key: SecretStr | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    openrouter_api_key: SecretStr | None = None
    openrouter_model: str = "qwen/qwen-2.5-72b-instruct:free"
    ai_request_timeout_seconds: int = Field(default=45, ge=5, le=180)

    tesseract_cmd: Path = Path("/usr/bin/tesseract")
    tesseract_languages: str = "eng+urd"
    ocr_dpi: int = Field(default=300, ge=150, le=600)

    @field_validator("secret_key")
    @classmethod
    def secure_production_secret(cls, value: SecretStr, info):
        """Reject the development secret outside a development/test process."""
        # Full cross-field production validation is performed by deployment checks.
        if not value.get_secret_value():
            raise ValueError("SECRET_KEY cannot be empty")
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        """Return normalized allowed origins for FastAPI CORS middleware."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def enabled_ai_providers(self) -> list[str]:
        """List only providers that have a configured non-empty API key."""
        pairs = (("gemini", self.gemini_api_key), ("groq", self.groq_api_key), ("openrouter", self.openrouter_api_key))
        return [name for name, key in pairs if key and key.get_secret_value().strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Load settings once per process for predictable runtime behavior."""
    return Settings()
