"""Celery worker configuration for OCR and concept extraction jobs."""
from celery import Celery

from backend.app.core.config import get_settings

settings = get_settings()
celery = Celery(
    "haafiz",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["backend.app.tasks"],
)
celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=15 * 60,
    task_soft_time_limit=14 * 60,
    worker_prefetch_multiplier=1,
)
