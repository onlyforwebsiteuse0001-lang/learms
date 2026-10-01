"""HAAFIZ EDU API — working foundation with persistent SQLite storage."""
from __future__ import annotations

import hashlib
import hmac
import os
import secrets
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, Field

ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("HAAFIZ_DB", ROOT / "haafiz.db"))
app = FastAPI(title="HAAFIZ EDU API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_origin_regex=r"https://.*\.e2b\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCHEMA = """
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'student', language TEXT NOT NULL DEFAULT 'roman-urdu',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, code TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '', accent TEXT NOT NULL DEFAULT '#6255e7', created_by INTEGER REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS enrollments (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(user_id, course_id)
);
CREATE TABLE IF NOT EXISTS concepts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL, chapter TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS mastery (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
  probability REAL NOT NULL DEFAULT .25, attempts INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL,
  PRIMARY KEY(user_id, concept_id)
);
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, subject TEXT NOT NULL, due_at TEXT NOT NULL, duration INTEGER NOT NULL DEFAULT 25,
  completed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL, label TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'text',
  category TEXT NOT NULL DEFAULT 'general', updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id INTEGER REFERENCES users(id), action TEXT NOT NULL,
  entity TEXT NOT NULL, entity_id TEXT, details TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
);
"""

@contextmanager
def db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def password_hash(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"{salt.hex()}:{digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    salt, expected = stored.split(":", 1)
    actual = password_hash(password, bytes.fromhex(salt)).split(":", 1)[1]
    return hmac.compare_digest(actual, expected)


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with db() as conn:
        conn.executescript(SCHEMA)
        if not conn.execute("SELECT 1 FROM courses").fetchone():
            courses = [
                ("FSc Mathematics", "MATH-12", "Calculus, vectors and analytical geometry", "#6657e8"),
                ("FSc Physics", "PHY-12", "Mechanics, waves and modern physics", "#168b68"),
                ("Computer Science", "CS-12", "Programming fundamentals and data structures", "#dd762e"),
            ]
            conn.executemany("INSERT INTO courses(title,code,description,accent) VALUES(?,?,?,?)", courses)
            concepts = [
                (1, "Limits and continuity", "Calculus", 1), (1, "Differentiation", "Calculus", 2),
                (1, "Integration techniques", "Integration", 3), (2, "Vectors", "Mechanics", 1),
                (2, "Laws of motion", "Mechanics", 2), (3, "Variables and control flow", "Programming", 1),
                (3, "Arrays and objects", "Data structures", 2),
            ]
            conn.executemany("INSERT INTO concepts(course_id,title,chapter,position) VALUES(?,?,?,?)", concepts)
        defaults = [
            ("site_name", "HAAFIZ", "Platform name", "text", "branding", now()),
            ("tagline", "Parho samajh kar. Aage barho yaqeen se.", "Platform tagline", "text", "branding", now()),
            ("primary_color", "#5b4be8", "Primary colour", "color", "branding", now()),
            ("registration_enabled", "true", "Allow new registrations", "boolean", "access", now()),
            ("teacher_registration", "true", "Allow teacher registration", "boolean", "access", now()),
            ("tutor_enabled", "true", "Socratic tutor", "boolean", "features", now()),
            ("diagnostic_enabled", "true", "Adaptive diagnostic", "boolean", "features", now()),
            ("whatsapp_enabled", "false", "WhatsApp delivery", "boolean", "features", now()),
            ("maintenance_mode", "false", "Maintenance mode", "boolean", "system", now()),
            ("support_email", "support@haafiz.edu.pk", "Support email", "email", "general", now()),
        ]
        conn.executemany("INSERT OR IGNORE INTO settings(key,value,label,kind,category,updated_at) VALUES(?,?,?,?,?,?)", defaults)
        admin_email = os.getenv("HAAFIZ_ADMIN_EMAIL", "admin@haafiz.edu.pk").lower()
        if not conn.execute("SELECT 1 FROM users WHERE role='admin'").fetchone():
            conn.execute("INSERT INTO users(name,email,password_hash,role,created_at) VALUES(?,?,?,?,?)",
                         ("System Admin", admin_email, password_hash(os.getenv("HAAFIZ_ADMIN_PASSWORD", "ChangeMe123!")), "admin", now()))

init_db()

class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = "student"

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class TaskInput(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    subject: str = Field(min_length=2, max_length=80)
    due_at: datetime
    duration: int = Field(default=25, ge=5, le=300)

class AttemptInput(BaseModel):
    concept_id: int
    correct: bool

class CourseInput(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    code: str = Field(min_length=2, max_length=30)
    description: str = Field(default="", max_length=500)
    accent: str = Field(default="#5b4be8", pattern=r"^#[0-9a-fA-F]{6}$")

class SettingInput(BaseModel):
    value: str = Field(max_length=500)

class RoleInput(BaseModel):
    role: str


def public_user(row: sqlite3.Row) -> dict:
    return {key: row[key] for key in ("id", "name", "email", "role", "language", "created_at")}


def issue_session(conn: sqlite3.Connection, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    expires = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    conn.execute("INSERT INTO sessions(token,user_id,expires_at) VALUES(?,?,?)", (token, user_id, expires))
    return token


def current_user(authorization: Annotated[str | None, Header()] = None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Login required")
    token = authorization.removeprefix("Bearer ")
    with db() as conn:
        row = conn.execute("""SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id
                            WHERE s.token=? AND s.expires_at>?""", (token, now())).fetchone()
    if not row:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired")
    return public_user(row)

def require_admin(user=Depends(current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Administrator access required")
    return user

def audit(conn: sqlite3.Connection, user_id: int, action: str, entity: str, entity_id=None, details=""):
    conn.execute("INSERT INTO audit_logs(actor_id,action,entity,entity_id,details,created_at) VALUES(?,?,?,?,?,?)",
                 (user_id, action, entity, str(entity_id) if entity_id is not None else None, details, now()))

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "haafiz-edu"}

@app.post("/api/auth/register", status_code=201)
def register(data: RegisterInput):
    if data.role not in {"student", "teacher"}:
        raise HTTPException(400, "Role must be student or teacher")
    with db() as conn:
        setting = conn.execute("SELECT value FROM settings WHERE key='registration_enabled'").fetchone()
        if setting and setting["value"] != "true":
            raise HTTPException(403, "New registrations are currently closed")
        if data.role == "teacher":
            setting = conn.execute("SELECT value FROM settings WHERE key='teacher_registration'").fetchone()
            if setting and setting["value"] != "true":
                raise HTTPException(403, "Teacher registration is currently closed")
        try:
            cursor = conn.execute("INSERT INTO users(name,email,password_hash,role,created_at) VALUES(?,?,?,?,?)",
                                  (data.name.strip(), data.email.lower(), password_hash(data.password), data.role, now()))
        except sqlite3.IntegrityError:
            raise HTTPException(409, "An account with this email already exists")
        token = issue_session(conn, cursor.lastrowid)
        user = conn.execute("SELECT * FROM users WHERE id=?", (cursor.lastrowid,)).fetchone()
    return {"token": token, "user": public_user(user)}

@app.post("/api/auth/login")
def login(data: LoginInput):
    with db() as conn:
        user = conn.execute("SELECT * FROM users WHERE email=?", (data.email.lower(),)).fetchone()
        if not user or not verify_password(data.password, user["password_hash"]):
            raise HTTPException(401, "Email or password is incorrect")
        token = issue_session(conn, user["id"])
    return {"token": token, "user": public_user(user)}

@app.get("/api/me")
def me(user=Depends(current_user)):
    return user

@app.get("/api/courses")
def list_courses(user=Depends(current_user)):
    with db() as conn:
        rows = conn.execute("""SELECT c.*, COALESCE(e.progress,0) progress,
          CASE WHEN e.user_id IS NULL THEN 0 ELSE 1 END enrolled
          FROM courses c LEFT JOIN enrollments e ON e.course_id=c.id AND e.user_id=? ORDER BY c.id""", (user["id"],)).fetchall()
    return [dict(row) for row in rows]

@app.post("/api/courses/{course_id}/enroll", status_code=201)
def enroll(course_id: int, user=Depends(current_user)):
    with db() as conn:
        if not conn.execute("SELECT 1 FROM courses WHERE id=?", (course_id,)).fetchone():
            raise HTTPException(404, "Course not found")
        conn.execute("INSERT OR IGNORE INTO enrollments(user_id,course_id) VALUES(?,?)", (user["id"], course_id))
        concepts = conn.execute("SELECT id FROM concepts WHERE course_id=?", (course_id,)).fetchall()
        conn.executemany("INSERT OR IGNORE INTO mastery(user_id,concept_id,updated_at) VALUES(?,?,?)",
                         [(user["id"], concept["id"], now()) for concept in concepts])
    return {"enrolled": True, "course_id": course_id}

@app.get("/api/mastery")
def mastery_map(user=Depends(current_user)):
    with db() as conn:
        rows = conn.execute("""SELECT m.concept_id, m.probability, m.attempts, m.updated_at,
          x.title concept, x.chapter, c.title course FROM mastery m JOIN concepts x ON x.id=m.concept_id
          JOIN courses c ON c.id=x.course_id WHERE m.user_id=? ORDER BY c.id,x.position""", (user["id"],)).fetchall()
    return [dict(row) | {"mastery_percent": round(row["probability"] * 100)} for row in rows]

@app.post("/api/mastery/attempt")
def record_attempt(data: AttemptInput, user=Depends(current_user)):
    with db() as conn:
        current = conn.execute("SELECT * FROM mastery WHERE user_id=? AND concept_id=?",
                               (user["id"], data.concept_id)).fetchone()
        if not current:
            raise HTTPException(404, "Enroll in this course before recording attempts")
        # Interpretable early BKT-style update; pyBKT calibration follows after pilot data.
        p = current["probability"]
        slip, guess, learn = .10, .20, .12
        evidence = (p * (1-slip)) / (p*(1-slip) + (1-p)*guess) if data.correct else (p*slip) / (p*slip + (1-p)*(1-guess))
        updated = evidence + (1-evidence)*learn
        conn.execute("UPDATE mastery SET probability=?,attempts=attempts+1,updated_at=? WHERE user_id=? AND concept_id=?",
                     (updated, now(), user["id"], data.concept_id))
    return {"concept_id": data.concept_id, "mastery_percent": round(updated*100), "why": "Updated from your latest practice attempt"}

@app.get("/api/tasks")
def list_tasks(user=Depends(current_user)):
    with db() as conn:
        rows = conn.execute("SELECT * FROM tasks WHERE user_id=? ORDER BY completed,due_at", (user["id"],)).fetchall()
    return [dict(row) | {"completed": bool(row["completed"])} for row in rows]

@app.post("/api/tasks", status_code=201)
def create_task(data: TaskInput, user=Depends(current_user)):
    with db() as conn:
        cursor = conn.execute("INSERT INTO tasks(user_id,title,subject,due_at,duration) VALUES(?,?,?,?,?)",
                              (user["id"], data.title, data.subject, data.due_at.isoformat(), data.duration))
        row = conn.execute("SELECT * FROM tasks WHERE id=?", (cursor.lastrowid,)).fetchone()
    return dict(row) | {"completed": False}

@app.patch("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: int, user=Depends(current_user)):
    with db() as conn:
        task = conn.execute("SELECT * FROM tasks WHERE id=? AND user_id=?", (task_id, user["id"])).fetchone()
        if not task:
            raise HTTPException(404, "Task not found")
        completed = 0 if task["completed"] else 1
        conn.execute("UPDATE tasks SET completed=? WHERE id=?", (completed, task_id))
    return {"id": task_id, "completed": bool(completed)}

@app.get("/api/dashboard")
def dashboard(user=Depends(current_user)):
    with db() as conn:
        enrolled = conn.execute("SELECT COUNT(*) n FROM enrollments WHERE user_id=?", (user["id"],)).fetchone()["n"]
        due = conn.execute("SELECT COUNT(*) n FROM tasks WHERE user_id=? AND completed=0", (user["id"],)).fetchone()["n"]
        avg = conn.execute("SELECT AVG(probability) avg FROM mastery WHERE user_id=?", (user["id"],)).fetchone()["avg"]
        weak = conn.execute("""SELECT x.title,ROUND(m.probability*100) mastery FROM mastery m
          JOIN concepts x ON x.id=m.concept_id WHERE m.user_id=? ORDER BY m.probability LIMIT 3""", (user["id"],)).fetchall()
    return {"student": user["name"], "courses": enrolled, "tasks_due": due,
            "average_mastery": round((avg or 0)*100), "weak_concepts": [dict(x) for x in weak],
            "next_action": "Enroll in your first course" if not enrolled else "Continue your weakest concept"}

# ---- Public configuration and administrator control plane -----------------
@app.get("/api/config")
def public_config():
    public_keys = {"site_name", "tagline", "primary_color", "registration_enabled", "teacher_registration", "tutor_enabled", "diagnostic_enabled", "whatsapp_enabled", "support_email"}
    with db() as conn:
        rows = conn.execute("SELECT key,value,kind FROM settings").fetchall()
    return {r["key"]: (r["value"] == "true" if r["kind"] == "boolean" else r["value"]) for r in rows if r["key"] in public_keys}

@app.get("/api/admin/overview")
def admin_overview(admin=Depends(require_admin)):
    with db() as conn:
        counts = {table: conn.execute(f"SELECT COUNT(*) n FROM {table}").fetchone()["n"]
                  for table in ("users", "courses", "enrollments", "concepts", "tasks")}
        roles = [dict(r) for r in conn.execute("SELECT role,COUNT(*) count FROM users GROUP BY role").fetchall()]
        recent = [dict(r) for r in conn.execute("""SELECT a.*,u.name actor FROM audit_logs a
                   LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT 8""").fetchall()]
    return {"counts": counts, "roles": roles, "recent_activity": recent}

@app.get("/api/admin/users")
def admin_users(q: str = "", admin=Depends(require_admin)):
    with db() as conn:
        rows = conn.execute("""SELECT id,name,email,role,language,created_at FROM users
          WHERE name LIKE ? OR email LIKE ? ORDER BY id DESC LIMIT 200""", (f"%{q}%", f"%{q}%")).fetchall()
    return [dict(r) for r in rows]

@app.patch("/api/admin/users/{user_id}/role")
def admin_change_role(user_id: int, data: RoleInput, admin=Depends(require_admin)):
    if data.role not in {"student", "teacher", "admin"}:
        raise HTTPException(400, "Invalid role")
    if user_id == admin["id"] and data.role != "admin":
        raise HTTPException(400, "You cannot remove your own admin access")
    with db() as conn:
        if not conn.execute("SELECT 1 FROM users WHERE id=?", (user_id,)).fetchone():
            raise HTTPException(404, "User not found")
        conn.execute("UPDATE users SET role=? WHERE id=?", (data.role, user_id))
        audit(conn, admin["id"], "role.changed", "user", user_id, data.role)
    return {"id": user_id, "role": data.role}

@app.get("/api/admin/settings")
def admin_settings(admin=Depends(require_admin)):
    with db() as conn:
        rows = conn.execute("SELECT * FROM settings ORDER BY category,label").fetchall()
    return [dict(r) for r in rows]

@app.patch("/api/admin/settings/{key}")
def admin_update_setting(key: str, data: SettingInput, admin=Depends(require_admin)):
    with db() as conn:
        row = conn.execute("SELECT * FROM settings WHERE key=?", (key,)).fetchone()
        if not row:
            raise HTTPException(404, "Setting not found")
        if row["kind"] == "boolean" and data.value not in {"true", "false"}:
            raise HTTPException(400, "Boolean value must be true or false")
        conn.execute("UPDATE settings SET value=?,updated_at=? WHERE key=?", (data.value, now(), key))
        audit(conn, admin["id"], "setting.updated", "setting", key, data.value)
    return {"key": key, "value": data.value}

@app.post("/api/admin/courses", status_code=201)
def admin_create_course(data: CourseInput, admin=Depends(require_admin)):
    with db() as conn:
        cursor = conn.execute("INSERT INTO courses(title,code,description,accent,created_by) VALUES(?,?,?,?,?)",
                              (data.title, data.code.upper(), data.description, data.accent, admin["id"]))
        audit(conn, admin["id"], "course.created", "course", cursor.lastrowid, data.title)
        row = conn.execute("SELECT * FROM courses WHERE id=?", (cursor.lastrowid,)).fetchone()
    return dict(row)

@app.put("/api/admin/courses/{course_id}")
def admin_update_course(course_id: int, data: CourseInput, admin=Depends(require_admin)):
    with db() as conn:
        if not conn.execute("SELECT 1 FROM courses WHERE id=?", (course_id,)).fetchone():
            raise HTTPException(404, "Course not found")
        conn.execute("UPDATE courses SET title=?,code=?,description=?,accent=? WHERE id=?",
                     (data.title, data.code.upper(), data.description, data.accent, course_id))
        audit(conn, admin["id"], "course.updated", "course", course_id, data.title)
    return {"id": course_id, **data.model_dump()}

@app.get("/api/admin/audit")
def admin_audit(admin=Depends(require_admin)):
    with db() as conn:
        rows = conn.execute("""SELECT a.*,u.name actor FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_id
          ORDER BY a.id DESC LIMIT 200""").fetchall()
    return [dict(r) for r in rows]

# Serve only approved web assets; application source and data are never exposed.
@app.get("/", include_in_schema=False)
def web_index():
    return FileResponse(ROOT.parent / "index.html")

@app.get("/styles.css", include_in_schema=False)
def web_styles():
    return FileResponse(ROOT.parent / "styles.css", media_type="text/css")

@app.get("/script.js", include_in_schema=False)
def web_script():
    return FileResponse(ROOT.parent / "script.js", media_type="application/javascript")
