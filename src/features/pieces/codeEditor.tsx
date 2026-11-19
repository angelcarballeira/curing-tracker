import { useState } from 'react'
import { inputClass } from '../../components/Field'
import { es } from '../../i18n/es'
import { isCodeTaken, updatePiece } from './repository'

interface Props {
  pieceId: string
  code: string
}

export default function CodeEditor({ pieceId, code }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(code)
  const [error, setError] = useState(false)

  async function handleSave() {
    const next = value.trim().toUpperCase()
    if (!next) return
    if (await isCodeTaken(next, pieceId)) {
      setError(true)
      return
    }
    await updatePiece(pieceId, { code: next })
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-stone-500 dark:text-stone-400">
          {code}
        </span>
        <button
          onClick={() => {
            setValue(code)
            setError(false)
            setIsEditing(true)
          }}
          className="text-xs text-emerald-600 underline dark:text-emerald-400"
        >
          {es.label.edit}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setError(false)
        }}
        aria-label={es.label.title}
        className={inputClass}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{es.label.taken}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
        >
          {es.label.save}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="rounded-lg px-3 py-1 text-sm hover:bg-stone-200 dark:hover:bg-stone-800"
        >
          {es.label.cancel}
        </button>
      </div>
    </div>
  )
}