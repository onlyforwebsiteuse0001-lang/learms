"""Small dependency-free HTTP hardening middleware."""
from __future__ import annotations

import re
import threading
import time
import uuid
from collections import defaultdict
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

REQUEST_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Attach request correlation and conservative browser security headers."""

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        """Validate a caller request ID, invoke downstream, and harden response headers."""
        supplied = request.headers.get("x-request-id", "")
        request_id = supplied if REQUEST_ID.fullmatch(supplied) else str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"
        response.headers["Cache-Control"] = "no-store" if request.url.path.startswith("/api/") else "no-cache"
        if request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

_METRICS_LOCK = threading.Lock()
_REQUEST_COUNT: dict[tuple[str, str, int], int] = defaultdict(int)
_REQUEST_DURATION: dict[tuple[str, str], tuple[int, float]] = defaultdict(lambda: (0, 0.0))


class MetricsMiddleware(BaseHTTPMiddleware):
    """Collect bounded-cardinality request counts and durations without request data."""

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        """Measure request duration and label by route template, never raw identifiers."""
        started = time.perf_counter()
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            return response
        finally:
            route = request.scope.get("route")
            path = getattr(route, "path", "unmatched")
            method = request.method
            elapsed = time.perf_counter() - started
            with _METRICS_LOCK:
                _REQUEST_COUNT[(method, path, status_code)] += 1
                count, total = _REQUEST_DURATION[(method, path)]
                _REQUEST_DURATION[(method, path)] = (count + 1, total + elapsed)


def prometheus_metrics() -> str:
    """Render process-local HTTP metrics in Prometheus exposition format."""
    lines = [
        "# HELP haafiz_http_requests_total Total HTTP requests.",
        "# TYPE haafiz_http_requests_total counter",
    ]
    with _METRICS_LOCK:
        for (method, path, status), count in sorted(_REQUEST_COUNT.items()):
            lines.append(f'haafiz_http_requests_total{{method="{method}",path="{path}",status="{status}"}} {count}')
        lines.extend(["# HELP haafiz_http_request_duration_seconds_sum Total request duration.", "# TYPE haafiz_http_request_duration_seconds_sum counter"])
        for (method, path), (count, total) in sorted(_REQUEST_DURATION.items()):
            labels = f'method="{method}",path="{path}"'
            lines.append(f"haafiz_http_request_duration_seconds_sum{{{labels}}} {total:.9f}")
            lines.append(f"haafiz_http_request_duration_seconds_count{{{labels}}} {count}")
    return "\n".join(lines) + "\n"
