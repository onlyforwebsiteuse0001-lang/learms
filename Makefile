.PHONY: setup dev test lint up down logs

setup:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements-dev.txt
	cd frontend && npm install
	@test -f .env || cp .env.example .env

dev:
	.venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

test:
	.venv/bin/pytest -q

lint:
	.venv/bin/ruff check backend tests
	cd frontend && npm run build

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f backend worker
