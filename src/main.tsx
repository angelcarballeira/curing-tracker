import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Asks the browser to never delete our IndexedDB data automatically.
// It's a request, not a guarantee: the browser decides, and installed
// apps are much more likely to get a "yes".
navigator.storage?.persist?.()

// Dev-only helper to fill the app with demo data (see src/dev/seed.ts).
// import.meta.env.DEV is false in production builds, so this is removed there.
if (import.meta.env.DEV) {
  import('./dev/seed')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)