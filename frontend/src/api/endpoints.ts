import { api } from './client';
import type {
  Concept,
  DiagnosticAnswerResponse,
  DiagnosticResult,
  DiagnosticStartResponse,
  DocumentDetail,
  DocumentRecord,
  ExplainFeedback,
  HealthResponse,
  JobRecord,
  LearningPathResponse,
  LoginPayload,
  MasteryDetail,
  MasteryHistoryPoint,
  MasteryState,
  MockExamReport,
  MockExamSession,
  Paginated,
  PathStep,
  PracticeItem,
  PracticeResult,
  PlannerSchedule,
  PrerequisiteEdge,
  RegisterPayload,
  TextPage,
  TokenResponse,
  TutorTurn,
  WhyExplanation,
} from './types';

/**
 * One function per backend route. Everything above this line in the stack (hooks, pages)
 * refers to these, never to a raw URL string, so a contract change is a one-line edit.
 *
 * DEPLOYED  = read from Agent 1's committed source.
 * PROPOSED  = no implementation exists; the client will surface `not_implemented`.
 */

/* ---------------------------------------------------------- DEPLOYED */

export const health = () => api.get<HealthResponse>('/api/health', { auth: false });

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<TokenResponse>('/api/v1/auth/register', payload, { auth: false }),
  login: (payload: LoginPayload) => api.post<TokenResponse>('/api/v1/auth/login', payload, { auth: false }),
};

export const documentsApi = {
  list: (page = 1, pageSize = 50, signal?: AbortSignal) =>
    api.get<Paginated<DocumentRecord>>('/api/v1/documents', {
      query: { page, page_size: pageSize },
      signal,
    }),
  detail: (documentId: string, signal?: AbortSignal) =>
    api.get<DocumentDetail>(`/api/v1/documents/${documentId}`, { signal }),
  text: (documentId: string, page = 1, pageSize = 20, signal?: AbortSignal) =>
    api.get<Paginated<TextPage>>(`/api/v1/documents/${documentId}/text`, {
      query: { page, page_size: pageSize },
      signal,
    }),
  remove: (documentId: string) => api.del<void>(`/api/v1/documents/${documentId}`),
};

export const jobsApi = {
  status: (jobId: string, signal?: AbortSignal) => api.get<JobRecord>(`/api/v1/jobs/${jobId}`, { signal }),
  // Retrying only requeues documents already marked FAILED, so it is idempotent.
  retry: (jobId: string) => api.post<JobRecord>(`/api/v1/jobs/${jobId}/retry`, undefined, { retryable: false }),
};

export const conceptsApi = {
  list: (course: string, signal?: AbortSignal) =>
    api.get<Concept[]>('/api/v1/concepts', { query: { course }, signal }),
  prerequisites: (conceptId: string, signal?: AbortSignal) =>
    api.get<PrerequisiteEdge[]>(`/api/v1/concepts/${conceptId}/prerequisites`, { signal }),
};

export const diagnosticApi = {
  start: (courseKey: string, maxQuestions = 12) =>
    api.post<DiagnosticStartResponse>('/api/v1/diagnostic/start', {
      course_key: courseKey,
      max_questions: maxQuestions,
    }),
  answer: (sessionId: string, questionId: string, selectedIndex: number) =>
    api.post<DiagnosticAnswerResponse>(`/api/v1/diagnostic/${sessionId}/answer`, {
      question_id: questionId,
      selected_index: selectedIndex,
    }),
  result: (sessionId: string, signal?: AbortSignal) =>
    api.get<DiagnosticResult>(`/api/v1/diagnostic/${sessionId}/result`, { signal }),
};

export const masteryApi = {
  list: (studentId: string, signal?: AbortSignal) =>
    api.get<MasteryState[]>(`/api/v1/mastery/${studentId}`, { signal }),
  concept: (studentId: string, conceptId: string, signal?: AbortSignal) =>
    api.get<MasteryDetail>(`/api/v1/mastery/${studentId}/concept/${conceptId}`, { signal }),
};

export const pathApi = {
  generate: (courseKey: string) =>
    api.post<{ path_id: string; steps: PathStep[] }>('/api/v1/path/generate', { course_key: courseKey }),
  current: (signal?: AbortSignal) => api.get<LearningPathResponse>('/api/v1/path/current', { signal }),
  why: (conceptId: string, signal?: AbortSignal) =>
    api.get<WhyExplanation>(`/api/v1/path/why/${conceptId}`, { signal }),
};

/* ---------------------------------------------------------- PROPOSED
 * These call real URLs. When the route is absent the client converts the 404 into
 * `not_implemented` and the page renders a labelled "pending backend" panel.
 * No fallback data is invented at any layer.
 */

export const PENDING_ENDPOINTS = {
  tutor: 'POST /api/v1/tutor/message',
  quiz: 'POST /api/v1/quiz/next',
  explain: 'POST /api/v1/explain/grade',
  planner: 'POST /api/v1/planner/schedule',
  catchup: 'POST /api/v1/planner/catchup',
  exam: 'POST /api/v1/exam/start',
  analyticsHistory: 'GET /api/v1/analytics/mastery-history',
} as const;

export const tutorApi = {
  send: (courseKey: string, message: string, conceptId?: string | null, sessionId?: string | null) =>
    api.post<{ session_id: string; turns: TutorTurn[] }>('/api/v1/tutor/message', {
      course_key: courseKey,
      message,
      concept_id: conceptId ?? null,
      session_id: sessionId ?? null,
    }),
};

export const quizApi = {
  next: (courseKey: string) => api.post<PracticeItem>('/api/v1/quiz/next', { course_key: courseKey }),
  answer: (itemId: string, selectedIndex: number) =>
    api.post<PracticeResult>('/api/v1/quiz/answer', { item_id: itemId, selected_index: selectedIndex }),
};

export const explainApi = {
  grade: (conceptId: string, explanation: string) =>
    api.post<ExplainFeedback>('/api/v1/explain/grade', { concept_id: conceptId, explanation }),
};

export const plannerApi = {
  build: (courseKey: string, deadline: string, hoursPerWeek: number) =>
    api.post<PlannerSchedule>('/api/v1/planner/schedule', {
      course_key: courseKey,
      deadline,
      hours_per_week: hoursPerWeek,
    }),
  catchup: (courseKey: string, deadline: string, hoursPerWeek: number) =>
    api.post<PlannerSchedule>('/api/v1/planner/catchup', {
      course_key: courseKey,
      deadline,
      hours_per_week: hoursPerWeek,
    }),
};

export const examApi = {
  start: (courseKey: string, durationMinutes: number) =>
    api.post<MockExamSession>('/api/v1/exam/start', {
      course_key: courseKey,
      duration_minutes: durationMinutes,
    }),
  submit: (examId: string, answers: Array<{ question_id: string; selected_index: number }>) =>
    api.post<MockExamReport>(`/api/v1/exam/${examId}/submit`, { answers }),
};

export const analyticsApi = {
  masteryHistory: (signal?: AbortSignal) =>
    api.get<MasteryHistoryPoint[]>('/api/v1/analytics/mastery-history', { signal }),
};
