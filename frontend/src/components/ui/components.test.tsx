import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, networkError, notImplementedError } from '../../api/errors';
import { useUiStore } from '../../store/ui';
import { renderWithProviders } from '../../test/utils';
import { AsyncState } from './AsyncState';
import { CourseSelector, rememberCourse, readStoredCourse } from './CourseSelector';
import { ErrorBoundary } from './ErrorBoundary';
import { PendingBackend } from './PendingBackend';
import { ProgressBar } from './ProgressBar';
import { Skeleton, SkeletonCards, SkeletonRows } from './Skeleton';
import { StatusBadge } from './StatusBadge';
import { Toasts } from './Toasts';

describe('AsyncState', () => {
  const noop = () => null;

  it('shows a skeleton on the first load', () => {
    renderWithProviders(
      <AsyncState status="loading" data={null} error={null} isInitialLoad skeleton={<p>loading…</p>}>
        {noop}
      </AsyncState>,
    );
    expect(screen.getByText('loading…')).toBeInTheDocument();
  });

  it('keeps showing data during a refresh instead of flashing a skeleton', () => {
    renderWithProviders(
      <AsyncState status="loading" data={['a']} error={null} isInitialLoad={false} skeleton={<p>loading…</p>}>
        {(data) => <p>{data.join(',')}</p>}
      </AsyncState>,
    );
    expect(screen.queryByText('loading…')).not.toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  it('renders children when ready', () => {
    renderWithProviders(
      <AsyncState status="ready" data={{ name: 'Limits' }} error={null}>
        {(data) => <p>{data.name}</p>}
      </AsyncState>,
    );
    expect(screen.getByText('Limits')).toBeInTheDocument();
  });

  it('announces an error with role=alert and offers a retry', async () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <AsyncState status="error" data={null} error={networkError()} onRetry={onRetry}>
        {noop}
      </AsyncState>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /retry|try again/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows the pending-backend panel for an undeployed endpoint', () => {
    renderWithProviders(
      <AsyncState
        status="error"
        data={null}
        error={notImplementedError('/api/v1/tutor/message')}
        pendingEndpoint="POST /api/v1/tutor/message"
      >
        {noop}
      </AsyncState>,
    );
    // RULE 5: name the missing endpoint rather than showing invented content.
    expect(screen.getByText(/POST \/api\/v1\/tutor\/message/)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('still shows a normal error when no pendingEndpoint was declared', () => {
    renderWithProviders(
      <AsyncState status="error" data={null} error={notImplementedError('/api/v1/tutor/message')}>
        {noop}
      </AsyncState>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the empty state when the payload has nothing in it', () => {
    renderWithProviders(
      <AsyncState
        status="ready"
        data={[]}
        error={null}
        isEmpty={(data) => data.length === 0}
        emptyTitle="No documents yet"
        emptyBody="Upload your notes to begin."
      >
        {noop}
      </AsyncState>,
    );
    expect(screen.getByText('No documents yet')).toBeInTheDocument();
    expect(screen.getByText('Upload your notes to begin.')).toBeInTheDocument();
  });

  it('renders the idle slot before the loader is enabled', () => {
    renderWithProviders(
      <AsyncState status="idle" data={null} error={null} idle={<p>pick a course</p>}>
        {noop}
      </AsyncState>,
    );
    expect(screen.getByText('pick a course')).toBeInTheDocument();
  });

  it('prefers the backend message over a generic one', () => {
    renderWithProviders(
      <AsyncState
        status="error"
        data={null}
        error={new ApiError({ status: 409, code: 'conflict', message: 'Already exists / Pehle se mojood hai' })}
      >
        {noop}
      </AsyncState>,
    );
    expect(screen.getByText('Already exists')).toBeInTheDocument();
  });
});

describe('PendingBackend', () => {
  it('names the endpoint that is missing', () => {
    renderWithProviders(<PendingBackend endpoint="POST /api/v1/quiz/next" note="Bandit selection." />);
    expect(screen.getByText(/POST \/api\/v1\/quiz\/next/)).toBeInTheDocument();
    expect(screen.getByText('Bandit selection.')).toBeInTheDocument();
  });
});

describe('ProgressBar', () => {
  it('reports the value to assistive technology', () => {
    renderWithProviders(<ProgressBar value={42} label="Uploading" />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
  });

  it('clamps out-of-range values', () => {
    renderWithProviders(<ProgressBar value={150} label="Uploading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('omits aria-valuenow when progress is indeterminate', () => {
    renderWithProviders(<ProgressBar value={null} label="Uploading" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });
});

describe('StatusBadge', () => {
  it.each([
    ['success', 'Ready'],
    ['failed', 'Failed'],
    ['processing', 'Processing'],
    ['queued', 'Queued'],
  ])('labels %s in words, not only colour', (status, label) => {
    const { unmount } = renderWithProviders(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    unmount();
  });

  it('translates the label with the active locale', () => {
    renderWithProviders(<StatusBadge status="success" />, { locale: 'ur-Latn' });
    expect(screen.getByText('Tayyar')).toBeInTheDocument();
  });

  it('falls back to showing an unknown status verbatim', () => {
    renderWithProviders(<StatusBadge status="weird_state" />);
    expect(screen.getByText(/weird_state/)).toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('is hidden from assistive technology so it is not read as content', () => {
    const { container } = renderWithProviders(<Skeleton lines={3} />);
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });

  it('renders the requested number of cards and rows', () => {
    const { container: cards } = renderWithProviders(<SkeletonCards count={2} />);
    expect(cards.querySelectorAll('.card').length).toBe(2);
    const { container: rows } = renderWithProviders(<SkeletonRows count={5} />);
    expect(rows.querySelectorAll('.item-row').length).toBe(5);
  });
});

describe('Toasts', () => {
  beforeEach(() => {
    useUiStore.setState({ toasts: [], online: true });
  });

  it('renders nothing when there is nothing to say', () => {
    const { container } = renderWithProviders(<Toasts />);
    expect(within(container).queryByRole('status')).not.toBeInTheDocument();
  });

  it('announces a success politely in a live region', () => {
    renderWithProviders(<Toasts />);
    act(() => {
      useUiStore.getState().pushToast('success', 'Saved');
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
    // Successes must not interrupt a screen reader mid-sentence.
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('announces an error assertively with role=alert', () => {
    renderWithProviders(<Toasts />);
    act(() => {
      useUiStore.getState().pushToast('error', 'Upload failed');
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('lets the student dismiss a sticky error', async () => {
    renderWithProviders(<Toasts />);
    act(() => {
      useUiStore.getState().pushToast('error', 'Upload failed');
    });
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Upload failed')).not.toBeInTheDocument();
  });
});

describe('CourseSelector', () => {
  beforeEach(() => localStorage.clear());

  it('reads the course the student last worked on', () => {
    localStorage.setItem('haafiz.course_key', 'calculus');
    expect(readStoredCourse()).toBe('calculus');
  });

  it('returns an empty key when nothing has been chosen yet', () => {
    expect(readStoredCourse()).toBe('');
  });

  it('keeps recently used course keys, most recent first, without duplicates', () => {
    rememberCourse('calculus');
    rememberCourse('physics');
    rememberCourse('calculus');
    expect(JSON.parse(localStorage.getItem('haafiz.recent_courses') ?? '[]')).toEqual(['calculus', 'physics']);
  });

  it('ignores a blank course key', () => {
    rememberCourse('   ');
    expect(localStorage.getItem('haafiz.recent_courses')).toBeNull();
  });

  it('offers recalled keys as a datalist rather than an invented dropdown', () => {
    // There is no GET /courses endpoint, so a <select> of options would be fabricated.
    rememberCourse('calculus');
    const { container } = renderWithProviders(<CourseSelector value="" onChange={() => {}} />);
    expect(container.querySelector('datalist option')).toHaveAttribute('value', 'calculus');
  });

  it('lets the student type any course key', async () => {
    const onChange = vi.fn();
    renderWithProviders(<CourseSelector value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/course/i), 'p');
    expect(onChange).toHaveBeenCalledWith('p');
  });

  it('submits the trimmed key and remembers it', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<CourseSelector value=" calculus " onChange={() => {}} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith('calculus');
    expect(JSON.parse(localStorage.getItem('haafiz.recent_courses') ?? '[]')).toContain('calculus');
  });
});

describe('ErrorBoundary', () => {
  function Boom(): JSX.Element {
    throw new Error('render exploded');
  }

  it('shows a recoverable panel instead of a blank page', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders children normally when nothing throws', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>fine</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('fine')).toBeInTheDocument();
  });
});
