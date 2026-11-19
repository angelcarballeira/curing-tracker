import { Link, Outlet } from 'react-router-dom'
import { es } from '../i18n/es'
import { useTheme } from '../features/settings/useTheme'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <header className="border-b border-stone-200 dark:border-stone-700">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold">
            {es.appName}
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? es.theme.toLight : es.theme.toDark}
            className="rounded-lg px-3 py-2 text-xl hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* <Outlet /> is where the current page is rendered. */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}