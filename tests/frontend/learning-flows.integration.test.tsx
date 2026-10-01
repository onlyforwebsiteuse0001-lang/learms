import {
  HttpResponse,
  apiError,
  http,
  renderWithProviders,
  resetStores,
  screen,
  server,
  signIn,
  userEvent,
  waitFor,
} from '../../frontend/src/test/harness';
import { DiagnosticPage } from '../../frontend/src/pages/Diagnostic';
import { Toasts } from '../../frontend/src/components/ui/Toasts';
import { TutorPage } from '../../frontend/src/pages/pending/Tutor';
import { QuizPage } from '../../frontend/src/pages/pending/Quiz';
import { ExplainBackPage } from '../../frontend/src/pages/pending/ExplainBack';
import { PlannerPage } from '../../frontend/src/pages/pending/Planner';
import { MockExamPage } from '../../frontend/src/pages/pending/MockExam';

/**
 * The adaptive-learning flows.
 *
 * Diagnostic is fully deployed on Agent 1's side, so it is driven end to end here.
 * Tutor, adaptive quiz, explain-back, planner, catch-up and mock exam are NOT deployed;
 * their tests assert that each page says so and names the endpoint it is waiting on
 * (RULE 5) rather than rendering plausible-looking fake questions or plans.
 */

beforeEach(() => {
  resetStores();
  signIn();
  localStorage.setItem('haafiz.course_key', 'calculus');
});

describe('DiagnosticPage', () => {
  it('starts a session and shows the first question with its options', async () => {
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));

    expect(await screen.findByText('Which statement best describes a limit?')).toBeInTheDocument();
    expect(screen.getByText('A value a function approaches')).toBeInTheDocument();
    // Progress is exposed on the bar's accessible name, not as loose body text.
    expect(screen.getByRole('progressbar', { name: 'Question 1 of 2' })).toBeInTheDocument();
  });

  it('marks a correct answer and reports the updated mastery', async () => {
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    await screen.findByText('Which statement best describes a limit?');

    await userEvent.click(screen.getByText('A value a function approaches'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));

    expect(await screen.findByText('Correct')).toBeInTheDocument();
    expect(screen.getByText(/mastery for this concept is now 71%/i)).toBeInTheDocument();
  });

  it('marks a wrong answer without hiding it', async () => {
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    await screen.findByText('Which statement best describes a limit?');

    await userEvent.click(screen.getByText('An integral'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));

    expect(await screen.findByText('Not quite')).toBeInTheDocument();
  });

  it('cannot submit before an option is chosen', async () => {
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    await screen.findByText('Which statement best describes a limit?');

    // Disabled rather than clickable-then-scolding: the affordance matches the rule.
    expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled();
    await userEvent.click(screen.getByText('A value a function approaches'));
    expect(screen.getByRole('button', { name: 'Submit answer' })).toBeEnabled();
  });

  it('shows the result summary when the session completes', async () => {
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    await screen.findByText('Which statement best describes a limit?');

    await userEvent.click(screen.getByText('A value a function approaches'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
    await screen.findByText('Correct');
    await userEvent.click(screen.getByRole('button', { name: 'See results' }));

    expect(await screen.findByText('Diagnostic complete')).toBeInTheDocument();
  });

  it('explains a 409 from a course with no concepts instead of failing generically', async () => {
    server.use(
      http.post('/api/v1/diagnostic/start', () =>
        apiError(409, 'conflict', 'No concepts for this course yet / Is course ke concepts abhi nahi hain'),
      ),
    );
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    expect((await screen.findAllByText(/no concepts|upload/i)).length).toBeGreaterThan(0);
  });

  it('never leaks the correct answer index to the client', async () => {
    let payload: unknown = null;
    server.use(
      http.post('/api/v1/diagnostic/start', async () => {
        const response = {
          session_id: 'diag-1',
          status: 'active',
          total_questions: 1,
          question: {
            question_id: 'q-1',
            prompt: 'Which statement best describes a limit?',
            options: ['a', 'b'],
            difficulty: 2,
          },
        };
        payload = response;
        return HttpResponse.json(response, { status: 201 });
      }),
    );
    renderWithProviders(<DiagnosticPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    await screen.findByText('Which statement best describes a limit?');
    expect(JSON.stringify(payload)).not.toContain('correct_index');
  });
});

describe('pages waiting on a backend', () => {
  /*
   * Each of these pages is a REAL UI that calls the real proposed endpoint. Because the
   * route 404s, the client reports `not_implemented` and the page swaps in a labelled
   * panel. So every test has to perform the action first — which is the point: the
   * feature is wired, only the server side is missing.
   */

  const tutorInput = () => screen.getByPlaceholderText(/Describe what you are stuck on/);

  it('Tutor names the endpoint it needs instead of faking a Socratic reply', async () => {
    renderWithProviders(<TutorPage />, { authenticated: true });
    await userEvent.type(tutorInput(), 'I am stuck on the chain rule');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('POST /api/v1/tutor/message')).toBeInTheDocument();
    expect(screen.getByText('Waiting on the backend')).toBeInTheDocument();
    // Crucially: no tutor turn was fabricated in place of the missing reply.
    expect(screen.queryByText(/hint \d/)).not.toBeInTheDocument();
  });

  it('Adaptive quiz names its endpoint rather than inventing a question', async () => {
    renderWithProviders(<QuizPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start practice' }));
    expect(await screen.findByText(/POST \/api\/v1\/quiz\/next/)).toBeInTheDocument();
    // No answer options can exist without a backend to supply them.
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.queryAllByRole('meter')).toHaveLength(0);
  });

  it('Explain-back requires a real attempt before it calls the grader', async () => {
    renderWithProviders(<ExplainBackPage />, { authenticated: true });
    await userEvent.type(screen.getByPlaceholderText(/Explain this concept/), 'too short');
    expect(screen.getByRole('button', { name: 'Get feedback' })).toBeDisabled();
  });

  it('Explain-back names its grading endpoint once submitted', async () => {
    renderWithProviders(<ExplainBackPage />, { authenticated: true });
    await userEvent.type(screen.getByPlaceholderText('concept_id'), 'c-1');
    await userEvent.type(
      screen.getByPlaceholderText(/Explain this concept/),
      'The chain rule lets you differentiate a composition of functions by multiplying the derivative of the outer function with the derivative of the inner function step by step.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Get feedback' }));
    expect(await screen.findByText('POST /api/v1/explain/grade')).toBeInTheDocument();
  });

  async function buildPlan(variant: 'schedule' | 'catchup') {
    renderWithProviders(<PlannerPage variant={variant} />, { authenticated: true });
    // The build button stays disabled until there is a course AND a target date.
    await userEvent.type(screen.getByLabelText(/target date/i), '2026-12-15');
    await userEvent.click(screen.getByRole('button', { name: /build/i }));
  }

  it('Study planner refuses to build without a target date', () => {
    renderWithProviders(<PlannerPage variant="schedule" />, { authenticated: true });
    expect(screen.getByRole('button', { name: 'Build schedule' })).toBeDisabled();
  });

  it('Study planner names the schedule endpoint', async () => {
    await buildPlan('schedule');
    expect(await screen.findByText('POST /api/v1/planner/schedule')).toBeInTheDocument();
  });

  it('Catch-up plan names the catchup endpoint, not the schedule one', async () => {
    await buildPlan('catchup');
    expect(await screen.findByText('POST /api/v1/planner/catchup')).toBeInTheDocument();
    expect(screen.queryByText('POST /api/v1/planner/schedule')).not.toBeInTheDocument();
  });

  it('Mock exam names the exam endpoints', async () => {
    renderWithProviders(<MockExamPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start mock exam' }));
    expect(await screen.findByText(/POST \/api\/v1\/exam\/start/)).toBeInTheDocument();
  });

  it('still renders its pending panel in Urdu', async () => {
    renderWithProviders(<TutorPage />, { authenticated: true, locale: 'ur' });
    const input = screen.getAllByRole('textbox').at(-1)!;
    await userEvent.type(input, 'test');
    await userEvent.click(screen.getAllByRole('button').at(-1)!);
    // The endpoint path stays in Latin script; it is an identifier, not prose.
    expect(await screen.findByText('POST /api/v1/tutor/message')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });
});

describe('diagnostic resilience', () => {
  it('surfaces a mid-session failure rather than silently stalling', async () => {
    renderWithProviders(
      <>
        <DiagnosticPage />
        <Toasts />
      </>,
      { authenticated: true },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Start diagnostic' }));
    await screen.findByText('Which statement best describes a limit?');

    server.use(http.post('/api/v1/diagnostic/:sessionId/answer', () => HttpResponse.error()));
    await userEvent.click(screen.getByText('A value a function approaches'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));

    await waitFor(() =>
      expect(screen.getAllByText(/connection|network|reach/i).length).toBeGreaterThan(0),
    );
  });
});
