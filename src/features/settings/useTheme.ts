import { useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  // No saved choice yet: follow the operating system.
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    // Our Tailwind "dark:" variant looks for this class on <html>.
    document.documentElement.classList.toggle('dark', next === 'dark')
    // We save only when the user chooses, so until then we keep following the OS.
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { theme, toggleTheme }
}