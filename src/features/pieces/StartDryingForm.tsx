import { useState, type FormEvent } from 'react'
import { format } from 'date-fns'
import Field, { inputClass } from '../../components/Field'
import { es } from '../../i18n/es'
import { useOptions } from '../settings/useOptions'
import { addOption, startDrying } from './repository'

const NEW_TYPE = '__new__'
const DEFAULT_TARGET_LOSS_PCT = '35'
const nowForInput = () => format(new Date(), "yyyy-MM-dd'T'HH:mm")

export default function StartDryingForm({ pieceId }: { pieceId: string }) {
  // Same hook as the piece types, but for the "dryingType" list.
  const typeOptions = useOptions('dryingType')

  const [type, setType] = useState('')
  const [newType, setNewType] = useState('')
  const [seasoning, setSeasoning] = useState('')
  const [startDate, setStartDate] = useState(nowForInput)
  const [targetLossPct, setTargetLossPct] = useState(DEFAULT_TARGET_LOSS_PCT)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const finalType = type === NEW_TYPE ? newType.trim() : type

    const alreadyExists = typeOptions?.some(
      (o) => o.label.toLowerCase() === finalType.toLowerCase(),
    )
    if (type === NEW_TYPE && !alreadyExists) {
      await addOption('dryingType', finalType)
    }

    await startDrying(pieceId, {
      startDate: new Date(startDate).toISOString(),
      type: finalType,
      seasoning: seasoning.trim() || undefined,
      targetLossPct: Number(targetLossPct) || undefined,
    })
    // No navigation needed: the page reads the piece with useLiveQuery,
    // so it re-renders by itself and this form disappears.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-stone-200 p-4 dark:border-stone-700"
    >
      <h2 className="text-lg font-semibold">{es.drying.title}</h2>

      <Field label={es.drying.type} htmlFor="dryingType">
        <select
          id="dryingType"
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="">{es.drying.typePlaceholder}</option>
          {typeOptions?.map((o) => (
            <option key={o.id} value={o.label}>
              {o.label}
            </option>
          ))}
          <option value={NEW_TYPE}>{es.drying.addType}</option>
        </select>
      </Field>

      {type === NEW_TYPE && (
        <Field label={es.drying.newTypeLabel} htmlFor="newDryingType">
          <input
            id="newDryingType"
            required
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className={inputClass}
          />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={es.drying.startDate} htmlFor="dryingStart">
          <input
            id="dryingStart"
            type="datetime-local"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label={es.drying.targetLoss}
          htmlFor="targetLoss"
          hint={es.drying.targetLossHint}
        >
          <input
            id="targetLoss"
            type="number"
            min="1"
            max="80"
            step="any"
            inputMode="decimal"
            value={targetLossPct}
            onChange={(e) => setTargetLossPct(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label={es.drying.seasoning}
        htmlFor="seasoning"
        hint={es.drying.seasoningHint}
      >
        <textarea
          id="seasoning"
          rows={2}
          value={seasoning}
          onChange={(e) => setSeasoning(e.target.value)}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        className="w-full rounded-lg bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-700"
      >
        {es.drying.submit}
      </button>
    </form>
  )
}