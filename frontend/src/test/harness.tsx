/**
 * Barrel for tests that live OUTSIDE the Vite root.
 *
 * The brief puts frontend tests in the repository-level `tests/frontend/` directory, but
 * `node_modules` lives in `frontend/`. Node resolution walks up from the *importing file*,
 * so a bare `import { http } from 'msw'` inside `tests/frontend/` finds nothing.
 *
 * Rather than symlinking node_modules to the repo root (invisible, breaks on a fresh
 * clone) or aliasing a dozen packages in the Vite config (brittle), external tests import
 * everything through this one module, which lives inside the root and therefore resolves
 * normally. Everything re-exported here is what a page-level test legitimately needs.
 */

export { HttpResponse, http, delay } from 'msw';
export { MemoryRouter, Route, Routes, Link } from 'react-router-dom';
export { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export { server } from './mocks/server';
export * from './mocks/handlers';
export { expectApiError, renderWithProviders, resetStores, signIn, tick } from './utils';
