import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/server';

/**
 * Global test setup.
 *
 * `onUnhandledRequest: 'error'` is deliberate: if a component reaches for a URL nobody
 * declared a handler for, the test fails loudly instead of hanging on a pending promise
 * and then timing out with an unhelpful message. It also means every network call the app
 * makes has to be written down in `handlers.ts`, which keeps that file honest as a
 * description of the real contract.
 *
 * `fetch` is never stubbed — MSW intercepts at the network layer so the code under test
 * exercises the real client, including its retry, timeout and error-mapping logic.
 */

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllTimers();
});

afterAll(() => {
  server.close();
});

// jsdom implements none of these, and several components call them on mount.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver ??= MockObserver as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver ??= MockObserver as unknown as typeof ResizeObserver;

// jsdom has no layout engine, so anything that measures returns 0 and charts divide by it.
if (!Element.prototype.getBoundingClientRect.call(document.body).width) {
  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return { width: 800, height: 400, top: 0, left: 0, right: 800, bottom: 400, x: 0, y: 0, toJSON: () => ({}) };
  };
}

window.scrollTo = window.scrollTo || (() => {});
