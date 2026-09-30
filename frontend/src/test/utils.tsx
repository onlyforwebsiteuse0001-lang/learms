import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n';
import type { Locale } from '../i18n';
import { useAuthStore, wireAuthToClient } from '../store/auth';
import { useUiStore } from '../store/ui';
import { makeToken, TEST_STUDENT_ID } from './mocks/handlers';

/**
 * Test helpers.
 *
 * `renderWithProviders` wraps in exactly the providers `main.tsx` mounts, in the same
 * order, so a component behaves in a test the way it behaves in the app. Anything that
 * needs a different set (an isolated store test, say) should not be using this.
 */

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  locale?: Locale;
  authenticated?: boolean;
}

/**
 * Put a valid session in place.
 *
 * The store reads localStorage once at module load, so a test that writes storage after
 * import would be ignored. Writing both keeps the two in sync: storage for anything that
 * re-reads it, store state for the components rendering right now.
 */
export function signIn(name = 'Ayesha'): void {
  const token = makeToken();
  localStorage.setItem('haafiz.token', token);
  localStorage.setItem('haafiz.student_id', TEST_STUDENT_ID);
  localStorage.setItem('haafiz.name', name);
  useAuthStore.setState({
    token,
    studentId: TEST_STUDENT_ID,
    name,
    expired: false,
    isAuthenticated: true,
  });
}

export function resetStores(): void {
  useAuthStore.getState().logout();
  useUiStore.setState({ toasts: [], online: true });
  localStorage.clear();
}

export function renderWithProviders(ui: ReactElement, options: Options = {}): RenderResult {
  const { route = '/', locale = 'en', authenticated = false, ...rest } = options;

  if (authenticated) signIn();
  wireAuthToClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <I18nProvider initialLocale={locale}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </I18nProvider>
  );

  return render(ui, { wrapper: Wrapper, ...rest });
}

/** Let pending microtasks and any `setTimeout(0)` work flush. */
export const tick = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
