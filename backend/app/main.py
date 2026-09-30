"""HAAFIZ EDU FastAPI application entry point."""
from __future__ import annotations

import shutil

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.documents import router as documents_router
from backend.app.api.v1.learning import router as learning_router
from backend.app.core.config import get_settings
from backend.app.core.logging import configure_logging
from backend.app.core.middleware import SecurityHeadersMiddleware
from backend.app.services.api_errors import APIError

settings = get_settings()
configure_logging(settings.log_level)
app = FastAPI(title=settings.app_name, version="1.0.0", docs_url="/docs" if settings.app_env != "production" else None)
app.add_middleware(GZipMiddleware, minimum_size=1_000)
if settings.security_headers_enabled:
    app.add_middleware(SecurityHeadersMiddleware)
if settings.force_https:
    app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
app.include_router(learning_router, prefix="/api/v1")


@app.exception_handler(APIError)
async def api_error_handler(_request: Request, exc: APIError) -> JSONResponse:
    """Serialize expected errors using the stable public error contract."""
    body = {"error": exc.code, "message": exc.message}
    if exc.file is not None:
        body["file"] = exc.file
    if exc.details:
        body["details"] = exc.details
    return JSONResponse(body, status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
    """Return concise validation errors without stack traces or internal objects."""
    return JSONResponse(
        {"error": "validation_error", "message": "Request data is invalid. / Request data durust nahi hai.", "details": {"fields": [".".join(map(str, error["loc"])) for error in exc.errors()]}},
        status_code=422,
    )


@app.get("/api/health", tags=["operations"])
async def health() -> dict[str, object]:
    """Report process readiness and configured—not assumed—capabilities."""
    return {
        "status": "ok",
        "service": "haafiz-api",
        "environment": settings.app_env,
        "tesseract_installed": shutil.which(str(settings.tesseract_cmd)) is not None,
        "ai_providers_enabled": settings.enabled_ai_providers,
    }
