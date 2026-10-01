import { HttpResponse, http } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { apiError } from '../test/mocks/handlers';
import { server } from '../test/mocks/server';
import { renderWithProviders } from '../test/utils';
import { useAuthStore } from '../store/auth';
import { AuthPage } from './Auth';

function reset() {
  localStorage.clear();
  useAuthStore.setState({ token: null, studentId: null, name: null, expired: false, isAuthenticated: false });
}

describe('AuthPage — sign in', () => {
  beforeEach(reset);

  it('renders the sign-in form with labelled, autocompletable fields', () => {
    renderWithProviders(<AuthPage mode="login" />);
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    // WCAG 1.3.5 Identify Input Purpose.
    expect(screen.getByLabelText(/^Email address/)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/^Password/)).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.queryByLabelText(/^Full name/)).not.toBeInTheDocument();
  });

  it('signs the student in and stores the session', async () => {
    renderWithProviders(<AuthPage mode="login" />);
    await userEvent.type(screen.getByLabelText(/^Email address/), 'ayesha@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(useAuthStore.getState().isAuthenticated).toBe(true));
    expect(localStorage.getItem('haafiz.token')).toBeTruthy();
  });

  it('rejects a malformed email before any request is made', async () => {
    renderWithProviders(<AuthPage mode="login" />);
    await userEvent.type(screen.getByLabelText(/^Email address/), 'not-an-email');
    await userEvent.type(screen.getByLabelText(/^Password/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('moves focus to the first invalid field (WCAG 3.3.1)', async () => {
    renderWithProviders(<AuthPage mode="login" />);
    await userEvent.type(screen.getByLabelText(/^Email address/), 'bad');
    await userEvent.type(screen.getByLabelText(/^Password/), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(screen.getByLabelText(/^Email address/)).toHaveFocus());
  });

  it('marks an invalid field with aria-invalid and a described-by message', async () => {
    renderWithProviders(<AuthPage mode="login" />);
    await userEvent.type(screen.getByLabelText(/^Email address/), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    const password = screen.getByLabelText(/^Password/);
    await waitFor(() => expect(password).toHaveAttribute('aria-invalid', 'true'));
    expect(password).toHaveAttribute('aria-describedby', 'err-password');
  });

  it("shows the backend's own message when credentials are wrong", async () => {
    renderWithProviders(<AuthPage mode="login" />);
    await userEvent.type(screen.getByLabelText(/^Email address/), 'ayesha@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    // The English half of Agent 1's bilingual detail, not a generic "request failed".
    expect(await screen.findByText('Incorrect email or password')).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('explains a network failure rather than failing silently', async () => {
    server.use(http.post('/api/v1/auth/login', () => HttpResponse.error()));
    renderWithProviders(<AuthPage mode="login" />);
    await userEvent.type(screen.getByLabelText(/^Email address/), 'ayesha@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText(/connection|network|reach/i)).toBeInTheDocument();
  });

  it('tells the student when the session expired rather than just bouncing them', () => {
    useAuthStore.setState({ expired: true });
    renderWithProviders(<AuthPage mode="login" />);
    expect(screen.getByText('Your session expired. Please sign in again.')).toBeInTheDocument();
  });
});

describe('AuthPage — register', () => {
  beforeEach(reset);

  it('asks for a name and uses a new-password autocomplete hint', () => {
    renderWithProviders(<AuthPage mode="register" />);
    expect(screen.getByLabelText(/^Full name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toHaveAttribute('autocomplete', 'new-password');
  });

  it('creates the account and keeps the name the student typed', async () => {
    renderWithProviders(<AuthPage mode="register" />);
    await userEvent.type(screen.getByLabelText(/^Full name/), 'Ayesha Khan');
    await userEvent.type(screen.getByLabelText(/^Email address/), 'ayesha@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Create my workspace' }));

    await waitFor(() => expect(useAuthStore.getState().isAuthenticated).toBe(true));
    expect(useAuthStore.getState().name).toBe('Ayesha Khan');
  });

  it('surfaces a duplicate-email conflict from the server', async () => {
    renderWithProviders(<AuthPage mode="register" />);
    await userEvent.type(screen.getByLabelText(/^Full name/), 'Ayesha Khan');
    await userEvent.type(screen.getByLabelText(/^Email address/), 'taken@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Create my workspace' }));

    expect(await screen.findByText('Email already registered')).toBeInTheDocument();
  });

  it("maps the server's 422 field list back onto the right input", async () => {
    server.use(
      http.post('/api/v1/auth/register', () =>
        apiError(422, 'validation_error', 'Request data is invalid. / Request data durust nahi hai.', {
          details: { fields: ['body.email'] },
        }),
      ),
    );
    renderWithProviders(<AuthPage mode="register" />);
    await userEvent.type(screen.getByLabelText(/^Full name/), 'Ayesha Khan');
    await userEvent.type(screen.getByLabelText(/^Email address/), 'ayesha@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Create my workspace' }));

    await waitFor(() => expect(screen.getByLabelText(/^Email address/)).toHaveAttribute('aria-invalid', 'true'));
  });

  it('rejects a short password client-side, matching the server rule', async () => {
    renderWithProviders(<AuthPage mode="register" />);
    await userEvent.type(screen.getByLabelText(/^Full name/), 'Ayesha Khan');
    await userEvent.type(screen.getByLabelText(/^Email address/), 'ayesha@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'Create my workspace' }));

    expect(await screen.findByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });
});

describe('AuthPage — localisation', () => {
  beforeEach(reset);

  it('renders in Urdu and flips the document direction', () => {
    renderWithProviders(<AuthPage mode="login" />, { locale: 'ur' });
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    // Email stays LTR even in an RTL page, or the address reads backwards.
    expect(screen.getByLabelText(/ای میل|Email/)).toHaveClass('force-ltr');
  });
});
