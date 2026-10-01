import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { RequireAuth } from './components/layout/RequireAuth';
import { Toasts } from './components/ui/Toasts';
import { AnalyticsPage } from './pages/Analytics';
import { AuthPage } from './pages/Auth';
import { ConceptsPage } from './pages/Concepts';
import { DashboardPage } from './pages/Dashboard';
import { DiagnosticPage } from './pages/Diagnostic';
import { DocumentsPage } from './pages/Documents';
import { LearningPathPage } from './pages/LearningPath';
import { LibraryPage } from './pages/Library';
import { NotFoundPage } from './pages/NotFound';
import { UploadPage } from './pages/Upload';
import { ExplainBackPage } from './pages/pending/ExplainBack';
import { MockExamPage } from './pages/pending/MockExam';
import { PlannerPage } from './pages/pending/Planner';
import { QuizPage } from './pages/pending/Quiz';
import { TutorPage } from './pages/pending/Tutor';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="concepts" element={<ConceptsPage />} />
          <Route path="mastery" element={<MasteryRoute />} />
          <Route path="path" element={<LearningPathPage />} />
          <Route path="diagnostic" element={<DiagnosticPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="library" element={<LibraryPage />} />

          {/* UI complete, backend endpoint not deployed — each renders a labelled panel. */}
          <Route path="tutor" element={<TutorPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="explain" element={<ExplainBackPage />} />
          <Route path="planner" element={<PlannerPage variant="schedule" />} />
          <Route path="catchup" element={<PlannerPage variant="catchup" />} />
          <Route path="exam" element={<MockExamPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toasts />
    </>
  );
}

// Lazy-free indirection so the mastery page keeps a stable import graph for tests.
import { MasteryPage } from './pages/Mastery';
function MasteryRoute() {
  return <MasteryPage />;
}
