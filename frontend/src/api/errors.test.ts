import { describe, expect, it } from 'vitest';
import {
  ApiError,
  errorMessageKey,
  isApiError,
  localizeBackendMessage,
  networkError,
  notImplementedError,
  timeoutError,
  toApiError,
} from './errors';

describe('ApiError', () => {
  it('classifies auth failures', () => {
    const error = new ApiError({ status: 401, code: 'not_authenticated', message: 'nope' });
    expect(error.isAuth).toBe(true);
    expect(error.isNotImplemented).toBe(false);
    expect(error.isValidation).toBe(false);
  });

  it('treats 403 as an auth failure too', () => {
    expect(new ApiError({ status: 403, code: 'forbidden', message: 'x' }).isAuth).toBe(true);
  });

  it('classifies a missing proposed endpoint', () => {
    const error = notImplementedError('/api/v1/tutor/message');
    expect(error.isNotImplemented).toBe(true);
    expect(error.isAuth).toBe(false);
    expect(error.details.endpoint).toBe('/api/v1/tutor/message');
  });

  it('classifies validation failures by status or by code', () => {
    expect(new ApiError({ status: 422, code: 'whatever', message: 'x' }).isValidation).toBe(true);
    expect(new ApiError({ status: 400, code: 'validation_error', message: 'x' }).isValidation).toBe(true);
  });

  it("extracts field names from Agent 1's `details.fields` shape", () => {
    const error = new ApiError({
      status: 422,
      code: 'validation_error',
      message: 'Request data is invalid. / Request data durust nahi hai.',
      details: { fields: ['body.email', 'body.password'] },
    });
    // The `body.` prefix is FastAPI plumbing; forms bind to plain field names.
    expect(error.fieldErrors).toEqual(['email', 'password']);
  });

  it('returns no field names when details are absent or the wrong shape', () => {
    expect(new ApiError({ status: 500, code: 'server_error', message: 'boom' }).fieldErrors).toEqual([]);
    expect(
      new ApiError({ status: 422, code: 'validation_error', message: 'x', details: { fields: 'nope' } }).fieldErrors,
    ).toEqual([]);
  });

  it('marks only transient transport failures retryable', () => {
    expect(networkError().isRetryable).toBe(true);
    expect(timeoutError().isRetryable).toBe(true);
    expect(new ApiError({ status: 503, code: 'http_503', message: 'x' }).isRetryable).toBe(true);
    expect(new ApiError({ status: 502, code: 'bad_gateway', message: 'x' }).isRetryable).toBe(true);
    // Retrying a rejected upload would just burn the student's data allowance.
    expect(new ApiError({ status: 400, code: 'http_400', message: 'x' }).isRetryable).toBe(false);
    expect(new ApiError({ status: 500, code: 'http_500', message: 'x' }).isRetryable).toBe(false);
  });

  it('is a real Error subclass so it survives try/catch and instanceof', () => {
    const error = new ApiError({ status: 500, code: 'server_error', message: 'boom' });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApiError');
    expect(String(error)).toContain('boom');
  });
});

describe('errorMessageKey', () => {
  it('prefers an explicit local message key', () => {
    expect(errorMessageKey(networkError())).toBe('error.network');
    expect(errorMessageKey(timeoutError())).toBe('error.timeout');
  });

  it('maps a gateway failure', () => {
    expect(errorMessageKey(new ApiError({ status: 502, code: 'bad_gateway', message: 'x' }))).toBe('error.badGateway');
  });

  it('falls back to a generic server message for unlabelled 5xx', () => {
    expect(errorMessageKey(new ApiError({ status: 500, code: 'http_500', message: 'x' }))).toBe('error.server');
  });

  it('returns null when the backend message is the best thing to show', () => {
    expect(errorMessageKey(new ApiError({ status: 409, code: 'conflict', message: 'Already exists' }))).toBeNull();
  });
});

describe('localizeBackendMessage', () => {
  it('splits Agent 1\u2019s bilingual "English / Roman Urdu" detail strings', () => {
    const message = 'Email already registered / Email pehle se mojood hai';
    expect(localizeBackendMessage(message, 'en')).toBe('Email already registered');
    expect(localizeBackendMessage(message, 'ur-Latn')).toBe('Email pehle se mojood hai');
  });

  it('leaves a single-language message untouched', () => {
    expect(localizeBackendMessage('Document not found', 'ur-Latn')).toBe('Document not found');
  });

  it('does not split on a slash that is not a separator', () => {
    expect(localizeBackendMessage('Rate limit 10/minute exceeded', 'en')).toBe('Rate limit 10/minute exceeded');
  });

  it('shows the Roman Urdu half for Urdu script, which the backend never sends', () => {
    expect(localizeBackendMessage('Not found / Nahi mila', 'ur')).toBe('Nahi mila');
  });
});

describe('toApiError', () => {
  it('passes an ApiError through unchanged', () => {
    const original = networkError();
    expect(toApiError(original)).toBe(original);
  });

  it('wraps a plain Error', () => {
    const wrapped = toApiError(new TypeError('undefined is not a function'));
    expect(isApiError(wrapped)).toBe(true);
    expect(wrapped.code).toBe('client_error');
    expect(wrapped.message).toContain('undefined is not a function');
  });

  it('wraps a non-Error throw', () => {
    const wrapped = toApiError('something odd');
    expect(wrapped.code).toBe('unknown');
    expect(wrapped.messageKey).toBe('error.unknown');
  });
});
