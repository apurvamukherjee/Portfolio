import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary.tsx'

/** Last-resort net: if something outside <main>'s per-section boundaries crashes, show a recoverable message instead of a blank page. */
function RootCrashFallback() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-surface px-6 text-center text-ink">
      <p className="text-lg font-semibold">Something broke while loading the page.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md border border-border bg-surface-raised px-4 py-2 text-sm text-ink transition-colors hover:border-accent"
      >
        Reload
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<RootCrashFallback />}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
