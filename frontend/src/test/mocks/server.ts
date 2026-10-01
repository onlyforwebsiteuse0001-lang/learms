import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * One server for the whole run. `setup.ts` starts it before the suite, resets handlers
 * after each test (so a `server.use(...)` override cannot leak into the next test) and
 * closes it at the end.
 */
export const server = setupServer(...handlers);
