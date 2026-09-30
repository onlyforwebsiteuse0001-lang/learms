import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  /** ms; 0 keeps it until dismissed. Errors default to persistent. */
  duration: number;
}

interface UiState {
  toasts: Toast[];
  online: boolean;
  pushToast: (tone: ToastTone, message: string, duration?: number) => string;
  dismissToast: (id: string) => void;
  setOnline: (online: boolean) => void;
}

let counter = 0;
const nextId = () => `toast-${(counter += 1)}`;

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  online: typeof navigator === 'undefined' ? true : navigator.onLine,

  pushToast: (tone, message, duration) => {
    const id = nextId();
    // Errors stay until dismissed: auto-hiding the only explanation of a failure is how
    // users end up with a broken screen and no idea why.
    const ms = duration ?? (tone === 'error' ? 0 : 5000);
    set((state) => ({ toasts: [...state.toasts, { id, tone, message, duration: ms }] }));
    if (ms > 0) {
      setTimeout(() => get().dismissToast(id), ms);
    }
    return id;
  },

  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),

  setOnline: (online) => set({ online }),
}));

/** Registers browser connectivity listeners. Returns a cleanup for tests/StrictMode. */
export function watchConnectivity(): () => void {
  const update = () => useUiStore.getState().setOnline(navigator.onLine);
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
  return () => {
    window.removeEventListener('online', update);
    window.removeEventListener('offline', update);
  };
}
