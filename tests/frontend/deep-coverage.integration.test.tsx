import {
  HttpResponse,
  act,
  apiError,
  http,
  masteryFixtures,
  renderWithProviders,
  resetStores,
  screen,
  server,
  signIn,
  userEvent,
  waitFor,
} from '../../frontend/src/test/harness';
import { MasteryPage } from '../../frontend/src/pages/Mastery';
import { Toasts } from '../../frontend/src/components/ui/Toasts';
import { LearningPathPage } from '../../frontend/src/pages/LearningPath';
import { QuizPage } from '../../frontend/src/pages/pending/Quiz';
import { MockExamPage } from '../../frontend/src/pages/pending/MockExam';
import { DistributionChart, DonutChart, TrendChart } from '../../frontend/src/components/charts/Charts';

/**
 * Second pass over the paths the first round of tests did not reach: concept drill-down,
 * "why this step", and the two flows (adaptive quiz, mock exam) whose full UI only runs
 * when the proposed endpoint answers. Those last two are exercised by temporarily giving
 * MSW a handler for the PROPOSED contract — clearly a hypothetical, which is why the
 * default handler set still 404s and every other test sees the real, unbuilt state.
 */

beforeEach(() => {
  resetStores();
  signIn();
  localStorage.setItem('haafiz.course_key', 'calculus');
});

describe('MasteryPage — concept drill-down', () => {
  it('shows the BKT parameters behind the number, not just the number', async () => {
    renderWithProviders(<MasteryPage />, { authenticated: true });
    await screen.findAllByRole('meter');
    await userEvent.click(screen.getByRole('button', { name: /Limits/ }));

    // A student told "you are at 84%" deserves to see what produced it.
    expect(await screen.findByText('0.15')).toBeInTheDocument();
    expect(screen.getByText('0.10')).toBeInTheDocument();
    expect(screen.getByText('0.20')).toBeInTheDocument();
  });

  it('shows the attempt history for the selected concept', async () => {
    renderWithProviders(<MasteryPage />, { authenticated: true });
    await screen.findAllByRole('meter');
    await userEvent.click(screen.getByRole('button', { name: /Limits/ }));
    // 5 of 6 correct.
    expect(await screen.findByText('83%')).toBeInTheDocument();
  });

  it('reports a missing per-concept record instead of rendering blanks', async () => {
    server.use(
      http.get('/api/v1/mastery/:studentId/concept/:conceptId', () =>
        apiError(404, 'not_found', 'No mastery record / Koi record nahi'),
      ),
    );
    renderWithProviders(<MasteryPage />, { authenticated: true });
    await screen.findAllByRole('meter');
    await userEvent.click(screen.getByRole('button', { name: /Limits/ }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('sorts so the weakest concept is addressed first', async () => {
    renderWithProviders(<MasteryPage />, { authenticated: true });
    const meters = await screen.findAllByRole('meter');
    const values = meters.map((meter) => Number(meter.getAttribute('aria-valuenow')));
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it('handles a backend that omits the optional concept name', async () => {
    server.use(
      http.get('/api/v1/mastery/:studentId', () =>
        HttpResponse.json(masteryFixtures.map(({ name, ...rest }) => rest)),
      ),
    );
    renderWithProviders(<MasteryPage />, { authenticated: true });
    const meters = await screen.findAllByRole('meter');
    // Falls back to the concept id rather than rendering an empty label.
    expect(meters[0]).toHaveAttribute('aria-label', expect.stringMatching(/c-\d/));
  });
});

describe('LearningPathPage — why this step', () => {
  it('explains a step on demand with the evidence behind it', async () => {
    renderWithProviders(<LearningPathPage />, { authenticated: true });
    await screen.findByText('Chain rule');
    await userEvent.click(screen.getAllByRole('button', { name: /why/i })[0]);
    expect(await screen.findByText(/Depends on Derivatives/)).toBeInTheDocument();
  });

  it('says plainly when no path has been generated yet', async () => {
    server.use(
      http.get('/api/v1/path/current', () =>
        HttpResponse.json({ path_id: null, course_key: null, status: null, steps: [] }),
      ),
    );
    renderWithProviders(<LearningPathPage />, { authenticated: true });
    expect(await screen.findByRole('button', { name: /generate/i })).toBeInTheDocument();
    expect(screen.queryByText('Chain rule')).not.toBeInTheDocument();
  });

  it('reports a failed generation instead of leaving a stale path on screen', async () => {
    server.use(
      http.post('/api/v1/path/generate', () =>
        apiError(409, 'conflict', 'Not enough concepts / Kaafi concepts nahi'),
      ),
    );
    renderWithProviders(
      <>
        <LearningPathPage />
        <Toasts />
      </>,
      { authenticated: true },
    );
    await screen.findByText('Chain rule');
    await userEvent.click(screen.getByRole('button', { name: /generate|rebuild/i }));
    expect(await screen.findByText('Not enough concepts')).toBeInTheDocument();
  });
});

describe('Adaptive quiz — behaviour once the proposed endpoint exists', () => {
  const item = {
    item_id: 'item-1',
    concept_id: 'c-3',
    concept_name: 'Chain rule',
    prompt: 'Differentiate sin(3x).',
    options: ['3cos(3x)', 'cos(3x)', '3sin(3x)', '-3cos(3x)'],
    difficulty: 3,
    selection_reason: 'Lowest mastery among unlocked concepts.',
  };

  it('renders the question and the reason the bandit chose it', async () => {
    server.use(http.post('/api/v1/quiz/next', () => HttpResponse.json(item)));
    renderWithProviders(<QuizPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start practice' }));

    expect(await screen.findByText('Differentiate sin(3x).')).toBeInTheDocument();
    expect(screen.getByText(/Lowest mastery among unlocked concepts/)).toBeInTheDocument();
  });

  it('grades an answer and shows the explanation', async () => {
    server.use(
      http.post('/api/v1/quiz/next', () => HttpResponse.json(item)),
      http.post('/api/v1/quiz/answer', () =>
        HttpResponse.json({
          correct: true,
          mastery_percent: 64,
          explanation: 'The outer derivative is cos, the inner derivative is 3.',
          evidence: 'Chapter 3, page 40',
        }),
      ),
    );
    renderWithProviders(<QuizPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start practice' }));
    await screen.findByText('Differentiate sin(3x).');
    await userEvent.click(screen.getByText('3cos(3x)'));
    await userEvent.click(screen.getByRole('button', { name: /submit|answer/i }));

    expect(await screen.findByText(/The outer derivative is cos/)).toBeInTheDocument();
  });
});

describe('Mock exam — behaviour once the proposed endpoint exists', () => {
  const session = {
    exam_id: 'exam-1',
    duration_minutes: 1,
    total_marks: 2,
    questions: [
      { question_id: 'q-1', prompt: 'State the chain rule.', options: ['a', 'b'], marks: 1, concept_id: 'c-3' },
      { question_id: 'q-2', prompt: 'Differentiate x^2.', options: ['2x', 'x'], marks: 1, concept_id: 'c-2' },
    ],
  };

  it('renders the whole paper at once, as a real exam does', async () => {
    server.use(http.post('/api/v1/exam/start', () => HttpResponse.json(session, { status: 201 })));
    renderWithProviders(<MockExamPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start mock exam' }));

    expect(await screen.findByText(/State the chain rule/)).toBeInTheDocument();
    expect(screen.getByText(/Differentiate x\^2/)).toBeInTheDocument();
    // The clock is real and visible.
    expect(screen.getByText(/^\d?\d:\d\d$/)).toBeInTheDocument();
  });

  it('reports the per-concept breakdown after submission', async () => {
    server.use(
      http.post('/api/v1/exam/start', () => HttpResponse.json(session, { status: 201 })),
      http.post('/api/v1/exam/:examId/submit', () =>
        HttpResponse.json({
          exam_id: 'exam-1',
          score: 1,
          total_marks: 2,
          per_concept: [
            { concept_id: 'c-3', concept_name: 'Chain rule', score: 0, total: 1 },
            { concept_id: 'c-2', concept_name: 'Derivatives', score: 1, total: 1 },
          ],
        }),
      ),
    );
    renderWithProviders(<MockExamPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start mock exam' }));
    await screen.findByText(/State the chain rule/);
    // The A/B letter is aria-hidden, so the accessible name is the option text alone.
    await userEvent.click(screen.getAllByRole('button', { name: /^a$/ })[0]);
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));

    expect(await screen.findByText('Chain rule')).toBeInTheDocument();
    expect(screen.getByText('0/1')).toBeInTheDocument();
  });

  it('auto-submits when the clock runs out', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    let submitted = false;
    server.use(
      http.post('/api/v1/exam/start', () =>
        HttpResponse.json({ ...session, duration_minutes: 0.05 }, { status: 201 }),
      ),
      http.post('/api/v1/exam/:examId/submit', () => {
        submitted = true;
        return HttpResponse.json({ exam_id: 'exam-1', score: 0, total_marks: 2, per_concept: [] });
      }),
    );
    renderWithProviders(<MockExamPage />, { authenticated: true });
    await userEvent.click(screen.getByRole('button', { name: 'Start mock exam' }));
    await screen.findByText(/State the chain rule/);

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    await waitFor(() => expect(submitted).toBe(true));
    vi.useRealTimers();
  }, 20_000);
});

describe('Charts', () => {
  it('describes a distribution to assistive technology', () => {
    renderWithProviders(
      <DistributionChart
        ariaLabel="Mastery distribution"
        buckets={[
          { label: 'Not started', count: 2, color: 'var(--mastery-0)' },
          { label: 'Mastered', count: 1, color: 'var(--mastery-4)' },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: 'Mastery distribution' })).toBeInTheDocument();
  });

  it('survives an all-zero distribution without dividing by zero', () => {
    renderWithProviders(
      <DistributionChart ariaLabel="Empty" buckets={[{ label: 'None', count: 0, color: '#000' }]} />,
    );
    expect(screen.getByRole('img', { name: 'Empty' })).toBeInTheDocument();
  });

  it('plots a trend of points', () => {
    renderWithProviders(
      <TrendChart
        ariaLabel="Mastery over time"
        points={[
          { label: '2026-09-01', value: 0.2 },
          { label: '2026-09-08', value: 0.45 },
          { label: '2026-09-15', value: 0.6 },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: 'Mastery over time' })).toBeInTheDocument();
  });

  it('draws nothing for a single point rather than a misleading flat line', () => {
    // One measurement is not a trend; inventing a line from it would be a fake.
    renderWithProviders(<TrendChart ariaLabel="One point" points={[{ label: 'a', value: 0.5 }]} />);
    expect(screen.queryByRole('img', { name: 'One point' })).not.toBeInTheDocument();
  });

  it('renders a donut with the raw counts, not only a ring', () => {
    renderWithProviders(<DonutChart value={3} total={7} ariaLabel="Coverage" label="Concepts covered" />);
    expect(screen.getByRole('img', { name: 'Coverage' })).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('/7')).toBeInTheDocument();
  });

  it('never divides by a zero total', () => {
    renderWithProviders(<DonutChart value={0} total={0} ariaLabel="Nothing" label="Nothing yet" />);
    expect(screen.getByRole('img', { name: 'Nothing' })).toBeInTheDocument();
  });
});
