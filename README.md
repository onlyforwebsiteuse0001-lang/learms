# HAAFIZ EDU

Pakistan-first personalized learning system. This repository now contains the working API foundation and the first dashboard UI while the complete product is being developed iteratively.

## Implemented backend capabilities

- Persistent SQLite database with migrations-on-start
- Student and teacher registration/login with PBKDF2 password hashing
- Expiring bearer sessions
- Course catalogue and enrollment
- Concept-level mastery records
- Interpretable early BKT-style mastery updates
- Student tasks and completion tracking
- Personalized dashboard summary and weak-concept recommendations
- Seeded FSc Mathematics, Physics, and Computer Science content
- CORS support for local and Arena preview environments
- Interactive OpenAPI documentation

## Run the API

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Open `http://localhost:8000/docs` for the interactive API.

## Current UI

The existing `index.html` dashboard is the visual starting point. It can be opened directly or served with:

```bash
python3 -m http.server 5173
```

The interface will be migrated screen-by-screen to the HAAFIZ design system and connected to the API.

## Documentation

- [`docs/UX_RESEARCH.md`](docs/UX_RESEARCH.md) — research-backed interface principles and acceptance criteria

## Security note

SQLite is suitable for local development and the first deployable version. Production will use PostgreSQL, environment-managed secrets, rate limiting, email verification, password reset, and audited authorization policies before public enrollment.
