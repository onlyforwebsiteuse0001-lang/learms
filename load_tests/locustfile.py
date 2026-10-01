"""Authenticated-read Locust workload; provide TEST_BEARER_TOKEN for protected routes."""
from __future__ import annotations

import os

from locust import HttpUser, between, task


class HaafizUser(HttpUser):
    """Representative low-bandwidth learner read workload."""

    wait_time = between(1, 3)

    def on_start(self) -> None:
        """Configure optional pre-created student token without embedding credentials."""
        token = os.getenv("TEST_BEARER_TOKEN")
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    @task(5)
    def health(self) -> None:
        """Exercise cheap operational endpoint."""
        self.client.get("/api/health", name="GET /api/health")

    @task(3)
    def documents(self) -> None:
        """Exercise bounded document listing."""
        self.client.get("/api/v1/documents?page=1&page_size=20", headers=self.headers, name="GET /api/v1/documents")

    @task(2)
    def current_path(self) -> None:
        """Exercise current recommendation path."""
        self.client.get("/api/v1/path/current", headers=self.headers, name="GET /api/v1/path/current")
