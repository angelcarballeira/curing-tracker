import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Field, { inputClass } from '../../components/Field'
import { es } from '../../i18n/es'
import { calculateCuringEstimate } from '../../lib/curing'
import { useOptions } from '../settings/useOptions'
import { addOption, createPiece } from './repository'
import type { CuringMethod } from './types'

// Special value of the <select> that means "I want to type a new type".
const NEW_TYPE = '__new__'

const METHODS: CuringMethod[] = [
  'dry-salt',
  'salt-sugar',
  'salt-nitrite',
  'brine',
  'other',
]

// <input type="datetime-local"> needs local time in this exact format.
// toISOString() would give UTC time and show the wrong hour.
const nowForInput = () => format(new Date(), "yyyy-MM-dd'T'HH:mm")

export default function NewPiecePage() {
  const navigate = useNavigate()
  const typeOptions = useOptions('pieceType')

  const [type, setType] = useState('')
  const [newType, setNewType] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [thicknessCm, setThicknessCm] = useState('')
  const [method, setMethod] = useState<CuringMethod>('dry-salt')
  const [startDate, setStartDate] = useState(nowForInput)
  const [hoursOverride, setHoursOverride] = useState<string | null>(null)
  const [detail, setDetail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Convert the text the user typed into numbers (0 if empty or invalid).
  const weightG = Math.round((Number(weightKg) || 0) * 1000)
  const thickness = Number(thicknessCm) || undefined

  // Recalculated on every change to weight, thickness or method.
  const estimate = useMemo(
    () => calculateCuringEstimate({ weightG, thicknessCm: thickness, method }),
    [weightG, thickness, method],
  )

  // The suggestion is NOT copied into state. We show the user's own value if
  // they edited it, otherwise the live suggestion. This avoids a useEffect
  // that syncs two states, which is a common source of bugs.
  const hours = hoursOverride ?? String(estimate.suggestedHours)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault() // stop the browser from reloading the page
    setIsSaving(true)

    const finalType = type === NEW_TYPE ? newType.trim() : type

    // Save a brand-new type to the list, so it appears next time.
    const alreadyExists = typeOptions?.some(
      (option) => option.label.toLowerCase() === finalType.toLowerCase(),
    )
    if (type === NEW_TYPE && !alreadyExists) {
      await addOption('pieceType', finalType)
    }

    await createPiece({
      type: finalType,
      initialWeightG: weightG,
      thicknessCm: thickness,
      status: 'curing',
      curing: {
        // The input has local time; toISOString() stores it as UTC.
        startDate: new Date(startDate).toISOString(),
        method,
        detail: detail.trim() || undefined,
        estimatedHours: Number(hours),
      },
    })

    navigate('/')
  }

  const days = (h: number) => String(Math.round((h / 24) * 10) / 10)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">{es.newPiece.title}</h1>

      <Field label={es.newPiece.type} htmlFor="type">
        <select
          id="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="">{es.newPiece.typePlaceholder}</option>
          {typeOptions?.map((option) => (
            <option key={option.id} value={option.label}>
              {option.label}
            </option>
          ))}
          <option value={NEW_TYPE}>{es.newPiece.addType}</option>
        </select>
      </Field>

      {type === NEW_TYPE && (
        <Field label={es.newPiece.newTypeLabel} htmlFor="newType">
          <input
            id="newType"
            required
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className={inputClass}
          />
        </Field>
      )}

      {/* Two columns from 640 px up, one column on phones. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={es.newPiece.weight} htmlFor="weight">
          <input
            id="weight"
            type="number"
            required
            min="0.01"
            step="any"
            inputMode="decimal"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label={es.newPiece.thickness}
          htmlFor="thickness"
          hint={es.newPiece.thicknessHint}
        >
          <input
            id="thickness"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={thicknessCm}
            onChange={(e) => setThicknessCm(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={es.newPiece.method} htmlFor="method">
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value as CuringMethod)}
            className={inputClass}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {es.curingMethods[m]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={es.newPiece.startDate} htmlFor="startDate">
          <input
            id="startDate"
            type="datetime-local"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label={es.newPiece.estimatedHours}
        htmlFor="hours"
        hint={
          estimate.basis === 'thickness'
            ? es.newPiece.estimateRange(
              estimate.minHours,
              estimate.maxHours,
              `${days(estimate.minHours)} a ${days(estimate.maxHours)}`,
            )
            : es.newPiece.estimateFromWeight
        }
      >
        <input
          id="hours"
          type="number"
          required
          min="1"
          value={hours}
          onChange={(e) => setHoursOverride(e.target.value)}
          className={inputClass}
        />
        {hoursOverride !== null && (
          <button
            type="button" // without this, a button inside a form submits it
            onClick={() => setHoursOverride(null)}
            className="mt-1 text-xs text-emerald-600 underline dark:text-emerald-400"
          >
            {es.newPiece.restoreSuggestion}
          </button>
        )}
      </Field>

      <Field
        label={es.newPiece.detail}
        htmlFor="detail"
        hint={es.newPiece.detailHint}
      >
        <textarea
          id="detail"
          rows={3}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {isSaving ? es.newPiece.saving : es.newPiece.save}
      </button>
    </form>
  )
}