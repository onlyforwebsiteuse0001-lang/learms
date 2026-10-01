import { create } from 'zustand';
import { configureClient } from '../api/client';
import { authApi } from '../api/endpoints';
import type { LoginPayload, RegisterPayload } from '../api/types';

const TOKEN_KEY = 'haafiz.token';
const STUDENT_KEY = 'haafiz.student_id';
const NAME_KEY = 'haafiz.name';

export interface AuthState {
  token: string | null;
  studentId: string | null;
  name: string | null;
  /** Set when the session was terminated by a 401 rather than by the user. */
  expired: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: (reason?: 'user' | 'expired') => void;
  clearExpired: () => void;
}

/**
 * Reads the `exp` claim without verifying the signature.
 *
 * A browser cannot verify a JWT signature in any meaningful way — it has no secret and
 * the token is attacker-readable anyway. This is used ONLY to avoid sending a token we
 * already know is stale. Every authorisation decision stays on the server.
 */
export function isTokenExpired(token: string, nowMs: number = Date.now()): boolean {
  try {
    const [, payload] = token.split('.');
    if (!payload) return true;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const claims = JSON.parse(atob(padded)) as { exp?: number };
    if (typeof claims.exp !== 'number') return false; // No exp claim: let the server decide.
    // 30s skew so a request in flight does not land just after expiry.
    return claims.exp * 1000 <= nowMs + 30_000;
  } catch {
    return true; // Unparseable token is worse than no token.
  }
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* Private mode: the session still works, it just will not survive a reload. */
  }
}

function loadInitial(): Pick<AuthState, 'token' | 'studentId' | 'name'> {
  const token = readStorage(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    if (token) {
      writeStorage(TOKEN_KEY, null);
      writeStorage(STUDENT_KEY, null);
      writeStorage(NAME_KEY, null);
    }
    return { token: null, studentId: null, name: null };
  }
  return { token, studentId: readStorage(STUDENT_KEY), name: readStorage(NAME_KEY) };
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initial = loadInitial();

  const persist = (token: string | null, studentId: string | null, name: string | null) => {
    writeStorage(TOKEN_KEY, token);
    writeStorage(STUDENT_KEY, studentId);
    writeStorage(NAME_KEY, name);
  };

  return {
    ...initial,
    expired: false,
    isAuthenticated: Boolean(initial.token),

    login: async (payload) => {
      const result = await authApi.login(payload);
      persist(result.access_token, result.student_id, null);
      set({
        token: result.access_token,
        studentId: result.student_id,
        name: null,
        expired: false,
        isAuthenticated: true,
      });
    },

    register: async (payload) => {
      const result = await authApi.register(payload);
      persist(result.access_token, result.student_id, payload.name);
      set({
        token: result.access_token,
        studentId: result.student_id,
        name: payload.name,
        expired: false,
        isAuthenticated: true,
      });
    },

    logout: (reason = 'user') => {
      if (!get().token && reason === 'expired') return; // Avoid duplicate expiry notices.
      persist(null, null, null);
      set({
        token: null,
        studentId: null,
        name: null,
        expired: reason === 'expired',
        isAuthenticated: false,
      });
    },

    clearExpired: () => set({ expired: false }),
  };
});

/**
 * Bridges the store to the HTTP client. Called once from `main.tsx` so the client never
 * has to import the store (which would create a cycle) and tests can wire it themselves.
 */
export function wireAuthToClient(): void {
  configureClient({
    getToken: () => {
      const { token } = useAuthStore.getState();
      if (!token) return null;
      if (isTokenExpired(token)) {
        useAuthStore.getState().logout('expired');
        return null;
      }
      return token;
    },
    onUnauthorized: () => useAuthStore.getState().logout('expired'),
  });
}
