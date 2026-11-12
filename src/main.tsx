import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { db } from './db/db'

// TEMPORARY: force the database to open so we can inspect it in DevTools.
// We'll remove this once the screens query the database themselves.
db.open().then(() => console.log('Database opened:', db.tables.map((t) => t.name)))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
