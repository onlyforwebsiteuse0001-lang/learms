import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { I18nProvider } from './i18n';
import { wireAuthToClient } from './store/auth';
import { watchConnectivity } from './store/ui';
import './styles/global.css';

// Connect the HTTP client to the auth store before the first render so no request can
// go out unauthenticated, and start listening for online/offline transitions.
wireAuthToClient();
watchConnectivity();

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>,
);
