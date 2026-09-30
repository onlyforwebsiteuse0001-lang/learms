"""Create students and document processing tables.

Revision ID: 20261001_01
Revises: None
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20261001_01"
down_revision = None
branch_labels = None
depends_on = None

document_status = postgresql.ENUM("queued", "processing", "success", "failed", name="document_status", create_type=False)
job_status = postgresql.ENUM("queued", "processing", "partial", "success", "failed", name="job_status", create_type=False)


def upgrade() -> None:
    """Create Step 2 tables, enums, constraints, and query indexes."""
    bind = op.get_bind()
    document_status.create(bind, checkfirst=True)
    job_status.create(bind, checkfirst=True)
    op.create_table("students",
        sa.Column("student_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False), sa.Column("email", sa.String(320), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("role", sa.String(30), nullable=False, server_default="student"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("email", name="uq_students_email"))
    op.create_index("ix_students_email", "students", ["email"], unique=True)
    op.create_table("processing_jobs",
        sa.Column("job_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False),
        sa.Column("total_files", sa.Integer(), nullable=False), sa.Column("completed_files", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("failed_files", sa.Integer(), nullable=False, server_default="0"), sa.Column("status", job_status, nullable=False, server_default="queued"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.create_index("ix_processing_jobs_student_status", "processing_jobs", ["student_id", "status"])
    op.create_table("documents",
        sa.Column("document_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("processing_jobs.job_id", ondelete="SET NULL")),
        sa.Column("original_name", sa.String(255), nullable=False), sa.Column("stored_path", sa.String(1024), nullable=False),
        sa.Column("mime_type", sa.String(120), nullable=False), sa.Column("size_bytes", sa.BigInteger(), nullable=False),
        sa.Column("page_count", sa.Integer()), sa.Column("language_detected", sa.String(20), nullable=False, server_default="unknown"),
        sa.Column("status", document_status, nullable=False, server_default="queued"), sa.Column("error_message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("processed_at", sa.DateTime(timezone=True)))
    op.create_index("ix_documents_student_created", "documents", ["student_id", sa.text("created_at DESC")])
    op.create_index("ix_documents_status", "documents", ["status"])
    op.create_table("document_text",
        sa.Column("text_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("document_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("documents.document_id", ondelete="CASCADE"), nullable=False),
        sa.Column("page_number", sa.Integer()), sa.Column("content", sa.Text(), nullable=False), sa.Column("char_count", sa.Integer(), nullable=False),
        sa.Column("extraction_method", sa.String(40), nullable=False), sa.Column("confidence", sa.Float()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.create_index("ix_document_text_document", "document_text", ["document_id"])


def downgrade() -> None:
    """Drop Step 2 objects in dependency-safe order."""
    op.drop_table("document_text")
    op.drop_table("documents")
    op.drop_table("processing_jobs")
    op.drop_table("students")
    job_status.drop(op.get_bind(), checkfirst=True)
    document_status.drop(op.get_bind(), checkfirst=True)
