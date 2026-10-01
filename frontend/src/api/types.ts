/**
 * TypeScript mirrors of Agent 1's Pydantic contracts.
 *
 * Every shape here was read from `origin/arena/01a0f3e4-learms`:
 *   backend/app/schemas/auth.py, backend/app/schemas/document.py,
 *   backend/app/api/v1/learning.py (which returns plain dicts, not schema classes).
 * Field names are copied exactly — do not "tidy" them to camelCase.
 *
 * Shapes marked PROPOSED have no backend implementation yet. They exist so the UI can be
 * written against a concrete contract, and are documented in docs/frontend/CHANGES_NEEDED.md.
 */

/* ------------------------------------------------------------------ auth */

export interface TokenResponse {
  access_token: string;
  token_type: string;
  student_id: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/* ------------------------------------------------------------- documents */

export type DocumentStatus = 'queued' | 'processing' | 'success' | 'failed';
export type JobStatus = 'queued' | 'processing' | 'success' | 'partial' | 'failed';

export interface DocumentRecord {
  document_id: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  page_count: number | null;
  language_detected: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface TextPage {
  text_id: string;
  page_number: number | null;
  content: string;
  char_count: number;
  extraction_method: string;
  confidence: number | null;
}

export interface DocumentDetail extends DocumentRecord {
  text_pages: TextPage[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface UploadedFile {
  file_id: string;
  original_name: string;
  size_bytes: number;
  mime_type: string;
  status: string;
}

export interface UploadBatchResponse {
  job_id: string;
  status: string;
  files: UploadedFile[];
  message: string;
}

export interface JobRecord {
  job_id: string;
  total_files: number;
  completed_files: number;
  failed_files: number;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------- learning engine */

export interface Concept {
  concept_id: string;
  name: string;
  description: string | null;
  phase: string | null;
  confidence: number | null;
  extraction_method: string | null;
  evidence: string | null;
}

export interface PrerequisiteEdge {
  concept_id: string;
  name: string;
  confidence: number | null;
  evidence: string | null;
  approved: boolean;
}

export interface DiagnosticQuestion {
  question_id: string;
  prompt: string;
  /** Options only. `correct_index` is deliberately stripped server-side. */
  options: string[];
  difficulty: number | null;
}

export interface DiagnosticStartResponse {
  session_id: string;
  status: string;
  total_questions: number;
  question: DiagnosticQuestion;
}

export interface DiagnosticAnswerResponse {
  correct: boolean;
  mastery_percent: number;
  evidence: string | null;
  status: 'active' | 'complete';
  question: DiagnosticQuestion | null;
}

export interface DiagnosticAnswerRecord {
  question_id: string;
  correct: boolean;
  mastery_before: number;
  mastery_after: number;
}

export interface DiagnosticResult {
  session_id: string;
  status: string;
  answered: number;
  total: number;
  answers: DiagnosticAnswerRecord[];
}

export interface MasteryState {
  concept_id: string;
  name?: string;
  p_know: number;
  attempts: number;
  correct_attempts: number;
  last_updated: string | null;
}

export interface MasteryDetail extends MasteryState {
  p_learn?: number;
  p_slip?: number;
  p_guess?: number;
}

export interface PathStep {
  concept_id: string;
  name: string;
  position: number;
  reason: string | null;
  mastery?: number | null;
}

export interface LearningPathResponse {
  path_id: string | null;
  course_key: string | null;
  status: string | null;
  steps: PathStep[];
}

export interface WhyExplanation {
  concept_id: string;
  name: string;
  reason: string | null;
  evidence: string | null;
  position?: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  environment: string;
  tesseract_installed: boolean;
  ai_providers_enabled: string[];
}

/* ------------------------------------------------- PROPOSED (not deployed) */

/** PROPOSED — `POST /api/v1/tutor/message` */
export interface TutorTurn {
  role: 'student' | 'tutor';
  content: string;
  /** Socratic level: 1 = nudge, 4 = worked example. */
  hint_level?: number;
  concept_id?: string | null;
  created_at?: string;
}

/** PROPOSED — `POST /api/v1/quiz/next` */
export interface PracticeItem {
  item_id: string;
  concept_id: string;
  concept_name: string;
  prompt: string;
  options: string[];
  difficulty: number | null;
  /** Why the bandit picked this concept. */
  selection_reason?: string | null;
}

/** PROPOSED — `POST /api/v1/quiz/answer` */
export interface PracticeResult {
  correct: boolean;
  mastery_percent: number;
  explanation: string | null;
  evidence: string | null;
}

/** PROPOSED — `POST /api/v1/explain/grade` */
export interface ExplainFeedback {
  coverage_percent: number;
  covered_points: string[];
  missing_points: string[];
  misconceptions: string[];
  next_action: string | null;
}

/** PROPOSED — `GET|POST /api/v1/planner/schedule` */
export interface PlannerBlock {
  date: string;
  concept_id: string;
  concept_name: string;
  minutes: number;
  activity: 'study' | 'practice' | 'review' | 'exam';
}

export interface PlannerSchedule {
  generated_at: string;
  deadline: string;
  hours_per_week: number;
  blocks: PlannerBlock[];
  /** Concepts that do not fit before the deadline at the stated pace. */
  at_risk: string[];
}

/** PROPOSED — `POST /api/v1/exam/start` */
export interface MockExamQuestion {
  question_id: string;
  prompt: string;
  options: string[];
  marks: number;
  concept_id: string;
}

export interface MockExamSession {
  exam_id: string;
  duration_minutes: number;
  total_marks: number;
  questions: MockExamQuestion[];
}

export interface MockExamReport {
  exam_id: string;
  score: number;
  total_marks: number;
  per_concept: Array<{ concept_id: string; concept_name: string; score: number; total: number }>;
}

/** PROPOSED — `GET /api/v1/analytics/mastery-history` */
export interface MasteryHistoryPoint {
  date: string;
  average_mastery: number;
  concepts_measured: number;
}
