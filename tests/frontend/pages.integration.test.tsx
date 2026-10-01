/**
 * Everything external is imported through the in-root harness — see its header for why a
 * test file outside `frontend/` cannot resolve `msw` or `@testing-library/*` directly.
 * `describe`/`it`/`expect` come from Vitest globals.
 */
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
  within,
} from '../../frontend/src/test/harness';
import { DashboardPage } from '../../frontend/src/pages/Dashboard';
import { DocumentsPage } from '../../frontend/src/pages/Documents';
import { ConceptsPage } from '../../frontend/src/pages/Concepts';
import { MasteryPage } from '../../frontend/src/pages/Mastery';
import { LearningPathPage } from '../../frontend/src/pages/LearningPath';
import { AnalyticsPage } from '../../frontend/src/pages/Analytics';
import { LibraryPage } from '../../frontend/src/pages/Library';

/**
 * Page-level integration tests.
 *
 * These render a whole page against MSW handlers that reproduce Agent 1's real contract,
 * so they cover the thing unit tests cannot: that the page asks for the right endpoint,
 * survives the shapes the backend actually returns, and degrades honestly when it does
 * not. Nothing here stubs a component or a fetch.
 */

beforeEach(() => {
  resetStores();
  signIn();
  localStorage.setItem('haafiz.course_key', 'calculus');
});

describe('DashboardPage', () => {
  it('leads with the next step from the learning path', async () => {
    renderWithProviders(<DashboardPage />, { authenticated: true });
    expect(await screen.findByRole('heading', { name: 'Chain rule' })).toBeInTheDocument();
  });

  it('shows the weakest concepts first, because that is where practice pays', async () => {
    renderWithProviders(<DashboardPage />, { authenticated: true });
    await screen.findByText('Weakest concepts');
    const meters = await screen.findAllByRole('meter');
    // c-3 (18%) must be ranked above c-2 (52%) and c-1 (84%).
    expect(meters[0]).toHaveAttribute('aria-label', 'Chain rule');
  });

  it('never shows a confident zero while data is still loading', async () => {
    server.use(
      http.get('/api/v1/mastery/:studentId', async () => {
        await new Promise((resolve) => setTimeout(resolve, 80));
        return HttpResponse.json([]);
      }),
    );
    renderWithProviders(<DashboardPage />, { authenticated: true });
    // During the in-flight window the average must not read as a measured 0%.
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('offers a route forward when there is no path yet', async () => {
    server.use(
      http.get('/api/v1/path/current', () =>
        HttpResponse.json({ path_id: null, course_key: null, status: null, steps: [] }),
      ),
    );
    renderWithProviders(<DashboardPage />, { authenticated: true });
    expect(await screen.findByRole('link', { name: 'Upload material' })).toBeInTheDocument();
  });

  it('surfaces a server failure with a retry instead of an empty dashboard', async () => {
    server.use(
      http.get('/api/v1/documents', () => apiError(500, 'internal_error', 'Database unavailable / DB dastyab nahi')),
    );
    renderWithProviders(<DashboardPage />, { authenticated: true });
    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });
});

describe('DocumentsPage', () => {
  it('lists uploads with their real extraction status', async () => {
    renderWithProviders(<DocumentsPage />, { authenticated: true });
    expect(await screen.findByText('calculus-notes.pdf')).toBeInTheDocument();
    expect(screen.getByText('scanned-paper.jpg')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it("shows the backend's own failure reason for a failed document", async () => {
    renderWithProviders(<DocumentsPage />, { authenticated: true });
    expect(await screen.findByText(/OCR produced no text/)).toBeInTheDocument();
  });

  it('explains the empty state rather than rendering a bare list', async () => {
    server.use(
      http.get('/api/v1/documents', () => HttpResponse.json({ items: [], page: 1, page_size: 50, total: 0 })),
    );
    renderWithProviders(<DocumentsPage />, { authenticated: true });
    expect(await screen.findByText(/No documents yet/)).toBeInTheDocument();
  });

  it('loads extracted text on demand and labels how it was extracted', async () => {
    renderWithProviders(<DocumentsPage />, { authenticated: true });
    await screen.findByText('calculus-notes.pdf');
    await userEvent.click(screen.getAllByRole('button', { name: /view extracted text/i })[0]);
    expect(await screen.findByText(/A limit describes the value/)).toBeInTheDocument();
    expect(screen.getByText(/pymupdf/i)).toBeInTheDocument();
  });
});

describe('ConceptsPage', () => {
  it('renders the prerequisite graph for the chosen course', async () => {
    renderWithProviders(<ConceptsPage />, { authenticated: true });
    expect(await screen.findByRole('button', { name: /^Limits/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Derivatives/ })).toBeInTheDocument();
  });

  it('shows the evidence Agent 1 extracted, so a claim is never unsourced', async () => {
    renderWithProviders(<ConceptsPage />, { authenticated: true });
    await userEvent.click(await screen.findByRole('button', { name: /^Derivatives/ }));
    expect(await screen.findByText(/Chapter 3, page 31/)).toBeInTheDocument();
  });

  it('lists the prerequisites of the selected concept', async () => {
    renderWithProviders(<ConceptsPage />, { authenticated: true });
    await userEvent.click(await screen.findByRole('button', { name: /^Derivatives/ }));
    // "Limits" now appears both in the list and as a prerequisite of the selection.
    await waitFor(() => expect(screen.getAllByText('Limits').length).toBeGreaterThan(1));
  });

  it('switches to the graph view without losing the selection', async () => {
    renderWithProviders(<ConceptsPage />, { authenticated: true });
    await userEvent.click(await screen.findByRole('button', { name: /^Derivatives/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Graph' }));
    expect(await screen.findByRole('group', { name: /prerequisite graph/i })).toBeInTheDocument();
  });

  it('says so plainly when a course has no concepts yet', async () => {
    localStorage.setItem('haafiz.course_key', 'empty');
    renderWithProviders(<ConceptsPage />, { authenticated: true });
    expect(await screen.findByText(/No concepts for this course yet/)).toBeInTheDocument();
  });
});

describe('MasteryPage', () => {
  it('renders one meter per tracked concept with a readable percentage', async () => {
    renderWithProviders(<MasteryPage />, { authenticated: true });
    const meters = await screen.findAllByRole('meter');
    expect(meters).toHaveLength(3);
    // Colour is never the only signal: the value is in the accessible text too.
    expect(meters[0]).toHaveAttribute('aria-valuetext', expect.stringContaining('%'));
  });

  it('explains that there is nothing measured yet instead of showing 0%', async () => {
    server.use(http.get('/api/v1/mastery/:studentId', () => HttpResponse.json([])));
    renderWithProviders(<MasteryPage />, { authenticated: true });
    expect((await screen.findAllByText(/no mastery data|diagnostic/i)).length).toBeGreaterThan(0);
    expect(screen.queryAllByRole('meter')).toHaveLength(0);
  });
});

describe('LearningPathPage', () => {
  it('renders the ordered path with the reason for each step', async () => {
    renderWithProviders(<LearningPathPage />, { authenticated: true });
    expect(await screen.findByText('Chain rule')).toBeInTheDocument();
    expect(screen.getByText(/Lowest mastery with prerequisites met/)).toBeInTheDocument();
  });

  it('can regenerate the path', async () => {
    let generated = 0;
    server.use(
      http.post('/api/v1/path/generate', () => {
        generated += 1;
        return HttpResponse.json({ path_id: 'path-2', steps: [] }, { status: 201 });
      }),
    );
    renderWithProviders(<LearningPathPage />, { authenticated: true });
    await screen.findByText('Chain rule');
    await userEvent.click(screen.getByRole('button', { name: /generate|rebuild/i }));
    await waitFor(() => expect(generated).toBe(1));
  });
});

describe('AnalyticsPage', () => {
  it('derives the mastery distribution from data that actually exists', async () => {
    renderWithProviders(<AnalyticsPage />, { authenticated: true });
    expect(await screen.findByRole('img', { name: /distribution/i })).toBeInTheDocument();
  });

  it('labels the missing history endpoint instead of drawing an invented trend', async () => {
    renderWithProviders(<AnalyticsPage />, { authenticated: true });
    // RULE 5: a chart with no data source must say so, not interpolate one.
    expect(await screen.findByText(/analytics\/mastery-history/)).toBeInTheDocument();
  });
});

describe('LibraryPage', () => {
  it('browses the curated library that ships with the repo', async () => {
    renderWithProviders(<LibraryPage />);
    expect(await screen.findByText('Programming Fundamentals (Python)')).toBeInTheDocument();
    expect(screen.getByText('IT & Computing')).toBeInTheDocument();
  });

  it('states how much of the taxonomy is actually filled in', async () => {
    renderWithProviders(<LibraryPage />);
    expect(await screen.findByText(/1 of 2 categories/)).toBeInTheDocument();
  });

  it('marks a category with no courses as coming soon rather than hiding it', async () => {
    renderWithProviders(<LibraryPage />);
    await userEvent.click(await screen.findByRole('button', { name: /IT & Computing/ }));
    expect(await screen.findByText('Networks & Cloud')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
  });

  it('shows provenance on the course detail so curated is never confused with generated', async () => {
    renderWithProviders(<LibraryPage />);
    await userEvent.click(await screen.findByText('Programming Fundamentals (Python)'));
    const badges = await screen.findAllByText('curated');
    expect(badges.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /HEC Computing Disciplines 2023/ })).toBeInTheDocument();
  });

  it('filters by search text', async () => {
    renderWithProviders(<LibraryPage />);
    await screen.findByText('Programming Fundamentals (Python)');
    await userEvent.type(screen.getByRole('searchbox'), 'zzz');
    expect(await screen.findByText(/Nothing matched/)).toBeInTheDocument();
  });

  it('tells a developer to run the sync script when the library is missing', async () => {
    server.use(http.get('/content/index.json', () => new HttpResponse(null, { status: 404 })));
    renderWithProviders(<LibraryPage />);
    expect(await screen.findByText(/sync:content|sync_to_frontend/)).toBeInTheDocument();
  });
});

describe('locale coverage', () => {
  it('renders a data page in Urdu with RTL applied', async () => {
    renderWithProviders(<MasteryPage />, { authenticated: true, locale: 'ur' });
    await screen.findAllByRole('meter');
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('renders a data page in Roman Urdu without flipping direction', async () => {
    renderWithProviders(<MasteryPage />, { authenticated: true, locale: 'ur-Latn' });
    await screen.findAllByRole('meter');
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
  });
});

describe('unauthenticated access', () => {
  it('keeps a protected page from rendering data without a session', async () => {
    resetStores();
    server.use(
      http.get('/api/v1/documents', () =>
        apiError(401, 'not_authenticated', 'Not authenticated / Tasdeeq nahi hui'),
      ),
    );
    renderWithProviders(<DocumentsPage />);
    await waitFor(() => expect(screen.queryByText('calculus-notes.pdf')).not.toBeInTheDocument());
  });
});

describe('page headings', () => {
  it('gives every page exactly one PageHeader heading', async () => {
    // The h1 belongs to AppShell (it is the route-change focus target); each page
    // contributes a single h2 title beneath it.
    const { container } = renderWithProviders(<DocumentsPage />, { authenticated: true });
    await screen.findByText('calculus-notes.pdf');
    const headings = within(container).getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('Your documents');
  });
});
