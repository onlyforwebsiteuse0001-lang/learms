import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

/** Root shell used while the ordered learning workflows are implemented. */
function App(): React.JSX.Element {
  return (
    <main className="setup" id="main-content">
      <section aria-labelledby="setup-title">
        <span className="mark" aria-hidden="true">H</span>
        <p className="eyebrow">HAAFIZ EDU · BUILD STEP 1</p>
        <h1 id="setup-title">Foundation ready.</h1>
        <p>
          The React workspace is configured. The real upload workflow arrives
          in Build Step 2; this screen deliberately contains no fake learning data.
        </p>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
