import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../api/errors';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('moves from loading to ready with the resolved data', async () => {
    const { result } = renderHook(() => useAsync(async () => 'value', []));
    expect(result.current.status).toBe('loading');
    expect(result.current.isInitialLoad).toBe(true);
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.data).toBe('value');
    expect(result.current.isInitialLoad).toBe(false);
  });

  it('captures a failure as an ApiError', async () => {
    const { result } = renderHook(() =>
      useAsync(async () => {
        throw new ApiError({ status: 500, code: 'server_error', message: 'boom' });
      }, []),
    );
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.data).toBeNull();
  });

  it('normalises a non-ApiError throw', async () => {
    const { result } = renderHook(() =>
      useAsync(async () => {
        throw new TypeError('bad');
      }, []),
    );
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.code).toBe('client_error');
  });

  it('stays idle and never calls the loader when disabled', async () => {
    const loader = vi.fn(async () => 'value');
    const { result } = renderHook(() => useAsync(loader, [], { enabled: false }));
    expect(result.current.status).toBe('idle');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(loader).not.toHaveBeenCalled();
  });

  it('runs once the gate opens', async () => {
    const loader = vi.fn(async () => 'value');
    const { result, rerender } = renderHook(({ enabled }) => useAsync(loader, [], { enabled }), {
      initialProps: { enabled: false },
    });
    rerender({ enabled: true });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('refetches when a dependency changes', async () => {
    const loader = vi.fn(async (_signal: AbortSignal) => 'value');
    const { rerender } = renderHook(({ id }) => useAsync(loader, [id]), { initialProps: { id: 1 } });
    await waitFor(() => expect(loader).toHaveBeenCalledTimes(1));
    rerender({ id: 2 });
    await waitFor(() => expect(loader).toHaveBeenCalledTimes(2));
  });

  it('does not refetch when an inline loader is recreated but deps are stable', async () => {
    let calls = 0;
    const { rerender, result } = renderHook(() =>
      useAsync(async () => {
        calls += 1;
        return calls;
      }, []),
    );
    await waitFor(() => expect(result.current.status).toBe('ready'));
    rerender();
    rerender();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(calls).toBe(1);
  });

  it('reload() fetches again without flashing a skeleton over existing data', async () => {
    let calls = 0;
    const { result } = renderHook(() =>
      useAsync(async () => {
        calls += 1;
        return calls;
      }, []),
    );
    await waitFor(() => expect(result.current.data).toBe(1));
    act(() => result.current.reload());
    await waitFor(() => expect(result.current.data).toBe(2));
    expect(result.current.isInitialLoad).toBe(false);
  });

  it('never reports an abort as an error', async () => {
    const { result, unmount } = renderHook(() =>
      useAsync(
        (signal) =>
          new Promise<string>((resolve, reject) => {
            const timer = setTimeout(() => resolve('late'), 50);
            signal.addEventListener('abort', () => {
              clearTimeout(timer);
              reject(new DOMException('aborted', 'AbortError'));
            });
          }),
        [],
      ),
    );
    unmount();
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(result.current.error).toBeNull();
  });

  it('passes an AbortSignal the loader can honour', async () => {
    let received: AbortSignal | null = null;
    const { unmount } = renderHook(() =>
      useAsync(async (signal) => {
        received = signal;
        return 'ok';
      }, []),
    );
    await waitFor(() => expect(received).not.toBeNull());
    expect(received!.aborted).toBe(false);
    unmount();
    expect(received!.aborted).toBe(true);
  });

  it('setData patches the cache optimistically', async () => {
    const { result } = renderHook(() => useAsync(async () => ['a'], []));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    act(() => result.current.setData((previous) => [...(previous ?? []), 'b']));
    expect(result.current.data).toEqual(['a', 'b']);
  });

  it('setData also accepts a plain value', async () => {
    const { result } = renderHook(() => useAsync(async () => 'a', []));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    act(() => result.current.setData('b'));
    expect(result.current.data).toBe('b');
  });
});
