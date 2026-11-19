import type { ReactNode } from 'react'

// One shared style for inputs, selects and textareas.
export const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 ' +
  'dark:border-stone-600 dark:bg-stone-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-emerald-500'

interface FieldProps {
  label: string
  htmlFor: string // must match the input's id, so clicking the label focuses it
  hint?: string
  children: ReactNode
}

export default function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{hint}</p>
      )}
    </div>
  )
}