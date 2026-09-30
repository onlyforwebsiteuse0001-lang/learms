import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUiStore, watchConnectivity } from './ui';

describe('useUiStore toasts', () => {
  beforeEach(() => {
    useUiStore.setState({ toasts: [], online: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast and returns its id', () => {
    const id = useUiStore.getState().pushToast('success', 'Saved');
    const toasts = useUiStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({ id, tone: 'success', message: 'Saved' });
  });

  it('keeps errors on screen until dismissed', () => {
    useUiStore.getState().pushToast('error', 'Upload failed');
    expect(useUiStore.getState().toasts[0].duration).toBe(0);
  });

  it('auto-hides non-error toasts after five seconds', () => {
    vi.useFakeTimers();
    useUiStore.getState().pushToast('info', 'Syncing');
    expect(useUiStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(5000);
    expect(useUiStore.getState().toasts).toHaveLength(0);
  });

  it('honours an explicit duration, including 0 for sticky', () => {
    vi.useFakeTimers();
    useUiStore.getState().pushToast('success', 'Sticky', 0);
    vi.advanceTimersByTime(60_000);
    expect(useUiStore.getState().toasts).toHaveLength(1);
  });

  it('dismisses only the toast asked for', () => {
    const first = useUiStore.getState().pushToast('error', 'One');
    useUiStore.getState().pushToast('error', 'Two');
    useUiStore.getState().dismissToast(first);
    expect(useUiStore.getState().toasts.map((t) => t.message)).toEqual(['Two']);
  });

  it('ignores a dismiss for an id that is already gone', () => {
    useUiStore.getState().pushToast('error', 'One');
    expect(() => useUiStore.getState().dismissToast('toast-does-not-exist')).not.toThrow();
    expect(useUiStore.getState().toasts).toHaveLength(1);
  });

  it('gives every toast a distinct id', () => {
    const ids = [
      useUiStore.getState().pushToast('info', 'a'),
      useUiStore.getState().pushToast('info', 'b'),
      useUiStore.getState().pushToast('info', 'c'),
    ];
    expect(new Set(ids).size).toBe(3);
  });
});

describe('watchConnectivity', () => {
  afterEach(() => {
    useUiStore.setState({ online: true });
  });

  it('tracks offline and online events', () => {
    const stop = watchConnectivity();
    try {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
      expect(useUiStore.getState().online).toBe(false);

      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
      expect(useUiStore.getState().online).toBe(true);
    } finally {
      stop();
      vi.restoreAllMocks();
    }
  });

  it('stops listening after cleanup, so StrictMode double-mount does not leak', () => {
    const stop = watchConnectivity();
    stop();
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    window.dispatchEvent(new Event('offline'));
    expect(useUiStore.getState().online).toBe(true);
    vi.restoreAllMocks();
  });
});
