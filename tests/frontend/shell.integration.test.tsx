import {
  MemoryRouter,
  Route,
  Routes,
  render,
  renderWithProviders,
  resetStores,
  screen,
  signIn,
  userEvent,
  waitFor,
} from '../../frontend/src/test/harness';
import { I18nProvider } from '../../frontend/src/i18n';
import { AppShell } from '../../frontend/src/components/layout/AppShell';
import { RequireAuth } from '../../frontend/src/components/layout/RequireAuth';
import { LanguageSwitcher } from '../../frontend/src/components/layout/LanguageSwitcher';
import { NotFoundPage } from '../../frontend/src/pages/NotFound';
import { useUiStore } from '../../frontend/src/store/ui';
import { useAuthStore } from '../../frontend/src/store/auth';

/**
 * Shell, routing and accessibility scaffolding — the parts that are easy to leave broken
 * because no single page owns them.
 */

beforeEach(() => {
  resetStores();
});

function renderShell(route = '/') {
  return render(
    <I18nProvider initialLocale="en">
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>home page</p>} />
            <Route path="upload" element={<p>upload page</p>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </I18nProvider>,
  );
}

describe('AppShell', () => {
  it('provides the single page-level h1 that pages hang their h2s from', () => {
    signIn();
    renderShell();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('offers a skip link as the first focusable element (WCAG 2.4.1)', async () => {
    signIn();
    renderShell();
    // The shell parks focus on the page heading at mount, so start from a clean slate
    // before tabbing — otherwise Tab continues from the heading, not from the top.
    (document.activeElement as HTMLElement | null)?.blur();
    await userEvent.tab();
    expect(document.activeElement).toHaveClass('skip-link');
    expect(document.activeElement).toHaveAttribute('href', '#main-content');
  });

  it('points the skip link at a target that exists', () => {
    signIn();
    const { container } = renderShell();
    expect(container.querySelector('#main-content')).not.toBeNull();
  });

  it('renders navigation to every primary destination', () => {
    signIn();
    renderShell();
    const nav = screen.getAllByRole('navigation')[0];
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /upload/i }).length).toBeGreaterThan(0);
  });

  it('moves focus to the page heading after a route change', async () => {
    signIn();
    renderShell();
    await userEvent.click(screen.getAllByRole('link', { name: /upload/i })[0]);
    await waitFor(() => expect(screen.getByText('upload page')).toBeInTheDocument());
    await waitFor(() => expect(document.activeElement?.tagName).toBe('H1'));
  });

  it('warns when the browser goes offline', async () => {
    signIn();
    renderShell();
    useUiStore.setState({ online: false });
    expect(await screen.findByText(/offline/i)).toBeInTheDocument();
  });

  it('does not show the demo banner unless demo mode is on', () => {
    signIn();
    renderShell();
    expect(screen.queryByText(/DEMO MODE/i)).not.toBeInTheDocument();
  });

  it('lets the student sign out', async () => {
    signIn();
    renderShell();
    await userEvent.click(screen.getByRole('button', { name: /sign out|log out/i }));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe('RequireAuth', () => {
  function renderGuarded(route: string) {
    return render(
      <I18nProvider initialLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/login" element={<p>login page</p>} />
            <Route
              path="/mastery"
              element={
                <RequireAuth>
                  <p>private mastery data</p>
                </RequireAuth>
              }
            />
          </Routes>
        </MemoryRouter>
      </I18nProvider>,
    );
  }

  it('redirects an anonymous visitor to sign-in', () => {
    renderGuarded('/mastery');
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('private mastery data')).not.toBeInTheDocument();
  });

  it('lets a signed-in student through', () => {
    signIn();
    renderGuarded('/mastery');
    expect(screen.getByText('private mastery data')).toBeInTheDocument();
  });
});

describe('NotFoundPage', () => {
  it('explains the miss and offers a way back rather than a dead end', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

describe('LanguageSwitcher', () => {
  it('offers all three locales', () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /اردو/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /roman/i })).toBeInTheDocument();
  });

  it('marks the active locale as pressed so it is not colour-only', () => {
    renderWithProviders(<LanguageSwitcher />, { locale: 'en' });
    expect(screen.getByRole('button', { name: /english/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches the document direction when Urdu is chosen', async () => {
    renderWithProviders(<LanguageSwitcher />, { locale: 'en' });
    await userEvent.click(screen.getByRole('button', { name: /اردو/ }));
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).toHaveAttribute('lang', 'ur');
  });

  it('keeps Roman Urdu left-to-right', async () => {
    renderWithProviders(<LanguageSwitcher />, { locale: 'en' });
    await userEvent.click(screen.getByRole('button', { name: /roman/i }));
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    expect(document.documentElement).toHaveAttribute('lang', 'ur-Latn');
  });
});
