import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../api/errors';
import { request } from '../api/client';
import { server } from '../test/mocks/server';
import { makeToken, TEST_STUDENT_ID } from '../test/mocks/handlers';
import { isTokenExpired, useAuthStore, wireAuthToClient } from './auth';

function reset() {
  localStorage.clear();
  useAuthStore.setState({
    token: null,
    studentId: null,
    name: null,
    expired: false,
    isAuthenticated: false,
  });
}

describe('isTokenExpired', () => {
  it('accepts a token with a future exp', () => {
    expect(isTokenExpired(makeToken(3600))).toBe(false);
  });

  it('rejects a token that has already expired', () => {
    expect(isTokenExpired(makeToken(-10))).toBe(true);
  });

  it('rejects a token inside the 30 second clock-skew window', () => {
    // Expires in 10s: within skew, so treat it as already gone rather than send it.
    expect(isTokenExpired(makeToken(10))).toBe(true);
  });

  it('accepts a token with no exp claim and lets the server decide', () => {
    const encode = (v: unknown) => btoa(JSON.stringify(v)).replace(/=+$/, '');
    expect(isTokenExpired(`${encode({ alg: 'none' })}.${encode({ sub: 'x' })}.sig`)).toBe(false);
  });

  it('treats an unparseable token as expired', () => {
    expect(isTokenExpired('not-a-jwt')).toBe(true);
    expect(isTokenExpired('')).toBe(true);
    expect(isTokenExpired('a.b.c')).toBe(true);
  });

  it('respects an injected clock', () => {
    const token = makeToken(3600);
    expect(isTokenExpired(token, Date.now() + 4000 * 1000)).toBe(true);
  });
});

describe('useAuthStore', () => {
  beforeEach(reset);

  it('starts signed out', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('stores the token and student id after login', async () => {
    await useAuthStore.getState().login({ email: 'a@example.com', password: 'password123' });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.studentId).toBe(TEST_STUDENT_ID);
    expect(localStorage.getItem('haafiz.token')).toBe(state.token);
  });

  it('keeps the name the student typed at registration', async () => {
    await useAuthStore.getState().register({ name: 'Ayesha', email: 'a@example.com', password: 'password123' });
    expect(useAuthStore.getState().name).toBe('Ayesha');
    expect(localStorage.getItem('haafiz.name')).toBe('Ayesha');
  });

  it('leaves the session untouched when login fails', async () => {
    await expect(
      useAuthStore.getState().login({ email: 'a@example.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem('haafiz.token')).toBeNull();
  });

  it('clears storage on logout', async () => {
    await useAuthStore.getState().login({ email: 'a@example.com', password: 'password123' });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem('haafiz.token')).toBeNull();
    expect(useAuthStore.getState().expired).toBe(false);
  });

  it('distinguishes an expiry logout so the UI can explain it', async () => {
    await useAuthStore.getState().login({ email: 'a@example.com', password: 'password123' });
    useAuthStore.getState().logout('expired');
    expect(useAuthStore.getState().expired).toBe(true);
    useAuthStore.getState().clearExpired();
    expect(useAuthStore.getState().expired).toBe(false);
  });

  it('does not raise a duplicate expiry notice when already signed out', () => {
    useAuthStore.getState().logout('expired');
    expect(useAuthStore.getState().expired).toBe(false);
  });
});

describe('wireAuthToClient', () => {
  beforeEach(reset);

  it('attaches the stored token to outgoing requests', async () => {
    wireAuthToClient();
    await useAuthStore.getState().login({ email: 'a@example.com', password: 'password123' });

    let seen: string | null = null;
    server.use(
      http.get('/api/v1/echo', ({ request: req }) => {
        seen = req.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );
    await request('/api/v1/echo');
    expect(seen).toBe(`Bearer ${useAuthStore.getState().token}`);
  });

  it('logs out locally rather than sending a token it knows is stale', async () => {
    wireAuthToClient();
    useAuthStore.setState({
      token: makeToken(-60),
      studentId: TEST_STUDENT_ID,
      name: null,
      expired: false,
      isAuthenticated: true,
    });

    let seen: string | null = 'unset';
    server.use(
      http.get('/api/v1/echo', ({ request: req }) => {
        seen = req.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );
    await request('/api/v1/echo');
    expect(seen).toBeNull();
    expect(useAuthStore.getState().expired).toBe(true);
  });

  it('ends the session when the server answers 401', async () => {
    wireAuthToClient();
    await useAuthStore.getState().login({ email: 'a@example.com', password: 'password123' });
    server.use(
      http.get('/api/v1/private', () =>
        HttpResponse.json({ error: 'not_authenticated', message: 'Not authenticated' }, { status: 401 }),
      ),
    );
    await expect(request('/api/v1/private')).rejects.toBeInstanceOf(ApiError);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().expired).toBe(true);
  });

  it('survives a localStorage that throws (private browsing)', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    await expect(
      useAuthStore.getState().login({ email: 'a@example.com', password: 'password123' }),
    ).resolves.toBeUndefined();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    spy.mockRestore();
  });
});
