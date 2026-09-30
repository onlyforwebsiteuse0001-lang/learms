import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { en } from '../../i18n/locales/en';

interface State {
  error: Error | null;
}

/**
 * Catches render-time crashes so one broken page does not blank the whole app.
 *
 * Deliberately a class component: React still has no hook equivalent of
 * `componentDidCatch`. Strings come from the English dictionary directly rather than the
 * i18n hook, because the boundary must keep working even if the failure is *inside* a
 * provider — a translated error nobody can see is worse than an untranslated one.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Kept as console output on purpose: there is no error-reporting backend to send to,
    // and silently swallowing a crash would make this bug invisible in the field.
    console.error('[HAAFIZ] Unhandled UI error', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <div className="main">
        <div className="state-panel is-error" role="alert">
          <span className="state-icon" aria-hidden="true">
            !
          </span>
          <h2>{en['state.crashTitle']}</h2>
          <p>{en['state.crashBody']}</p>
          <p className="mono small muted force-ltr">{this.state.error.message}</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            {en['state.reload']}
          </button>
        </div>
      </div>
    );
  }
}
