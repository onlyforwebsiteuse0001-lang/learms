"""Add concept graph, diagnostic, mastery and path tables.

Revision ID: 20261001_02
Revises: 20261001_01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20261001_02"
down_revision = "20261001_01"
branch_labels = None
depends_on = None
U = postgresql.UUID(as_uuid=True)


def upgrade() -> None:
    """Create evidence-grounded learning engine tables."""
    op.create_table("concepts", sa.Column("concept_id", U, primary_key=True), sa.Column("student_id", U, sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False), sa.Column("course_key", sa.String(120), nullable=False), sa.Column("name", sa.String(200), nullable=False), sa.Column("normalized_name", sa.String(200), nullable=False), sa.Column("description", sa.Text, nullable=False), sa.Column("difficulty", sa.Integer, nullable=False, server_default="1"), sa.Column("phase", sa.String(30), nullable=False, server_default="foundation"), sa.Column("extraction_method", sa.String(40), nullable=False), sa.Column("confidence", sa.Float, nullable=False), sa.Column("evidence", sa.Text, nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.UniqueConstraint("student_id", "course_key", "normalized_name", name="uq_concept_student_course_name"))
    op.create_index("ix_concepts_student_id", "concepts", ["student_id"]); op.create_index("ix_concepts_course_key", "concepts", ["course_key"])
    op.create_table("concept_documents", sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True), sa.Column("document_id", U, sa.ForeignKey("documents.document_id", ondelete="CASCADE"), primary_key=True), sa.Column("evidence", sa.Text, nullable=False))
    op.create_table("prerequisites", sa.Column("prerequisite_id", U, primary_key=True), sa.Column("student_id", U, sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False), sa.Column("prerequisite_concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False), sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False), sa.Column("confidence", sa.Float, nullable=False), sa.Column("evidence", sa.Text, nullable=False), sa.Column("extraction_method", sa.String(40), nullable=False), sa.Column("approved", sa.Boolean, nullable=False, server_default=sa.false()))
    op.create_index("ix_prerequisites_student_id", "prerequisites", ["student_id"])
    op.create_table("diagnostic_questions", sa.Column("question_id", U, primary_key=True), sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False), sa.Column("prompt", sa.Text, nullable=False), sa.Column("options", sa.JSON, nullable=False), sa.Column("correct_index", sa.Integer, nullable=False), sa.Column("difficulty", sa.Integer, nullable=False, server_default="1"), sa.Column("evidence", sa.Text, nullable=False))
    op.create_index("ix_diagnostic_questions_concept_id", "diagnostic_questions", ["concept_id"])
    op.create_table("diagnostic_sessions", sa.Column("session_id", U, primary_key=True), sa.Column("student_id", U, sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False), sa.Column("course_key", sa.String(120), nullable=False), sa.Column("status", sa.String(20), nullable=False), sa.Column("current_index", sa.Integer, nullable=False, server_default="0"), sa.Column("question_ids", sa.JSON, nullable=False), sa.Column("answers", sa.JSON, nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.Column("completed_at", sa.DateTime(timezone=True)))
    op.create_index("ix_diagnostic_sessions_student_id", "diagnostic_sessions", ["student_id"])
    op.create_table("bkt_parameters", sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True), sa.Column("p_learn", sa.Float, nullable=False), sa.Column("p_slip", sa.Float, nullable=False), sa.Column("p_guess", sa.Float, nullable=False), sa.Column("source", sa.String(30), nullable=False), sa.Column("sample_size", sa.Integer, nullable=False, server_default="0"))
    op.create_table("mastery_state", sa.Column("student_id", U, sa.ForeignKey("students.student_id", ondelete="CASCADE"), primary_key=True), sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True), sa.Column("p_know", sa.Float, nullable=False), sa.Column("attempts", sa.Integer, nullable=False, server_default="0"), sa.Column("correct_attempts", sa.Integer, nullable=False, server_default="0"), sa.Column("last_updated", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_table("learning_paths", sa.Column("path_id", U, primary_key=True), sa.Column("student_id", U, sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False), sa.Column("course_key", sa.String(120), nullable=False), sa.Column("status", sa.String(20), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False)); op.create_index("ix_learning_paths_student_id", "learning_paths", ["student_id"])
    op.create_table("path_steps", sa.Column("step_id", U, primary_key=True), sa.Column("path_id", U, sa.ForeignKey("learning_paths.path_id", ondelete="CASCADE"), nullable=False), sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False), sa.Column("position", sa.Integer, nullable=False), sa.Column("phase", sa.String(30), nullable=False), sa.Column("reason", sa.Text, nullable=False), sa.Column("completed", sa.Boolean, nullable=False, server_default=sa.false())); op.create_index("ix_path_steps_path_id", "path_steps", ["path_id"])
    op.create_table("bandit_state", sa.Column("student_id", U, sa.ForeignKey("students.student_id", ondelete="CASCADE"), primary_key=True), sa.Column("concept_id", U, sa.ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True), sa.Column("alpha", sa.Float, nullable=False), sa.Column("beta", sa.Float, nullable=False), sa.Column("observations", sa.Integer, nullable=False, server_default="0"), sa.Column("last_reward", sa.Float))


def downgrade() -> None:
    """Remove learning engine tables in dependency order."""
    for table in ["bandit_state", "path_steps", "learning_paths", "mastery_state", "bkt_parameters", "diagnostic_sessions", "diagnostic_questions", "prerequisites", "concept_documents", "concepts"]:
        op.drop_table(table)
