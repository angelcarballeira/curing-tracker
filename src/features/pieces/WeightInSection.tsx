import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'date-fns'
import Field, { inputClass } from '../../components/Field'
import { db } from '../../db/db'
import { es } from '../../i18n/es'
import { calculateWeightLossPct } from '../../lib/drying'
import { addWeighIn, deleteWeighIn } from './repository'
import type { Piece } from './types'

const nowForInput = () => format(new Date(), "yyyy-MM-dd'T'HH:mm")

interface Props {
  piece: Piece
  canAdd: boolean // the form is only shown while the piece is drying
}

export default function WeighInSection({ piece, canAdd }: Props) {
  const weighIns = useLiveQuery(
    () => db.weighIns.where('pieceId').equals(piece.id).sortBy('date'),
    [piece.id],
  )

  const [date, setDate] = useState(nowForInput)
  const [weightG, setWeightG] = useState('')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await addWeighIn({
      pieceId: piece.id,
      date: new Date(date).toISOString(),
      weightG: Math.round(Number(weightG)),
      // An empty string becomes undefined, so the optional fields stay empty.
      temperatureC: temperature === '' ? undefined : Number(temperature),
      humidityPct: humidity === '' ? undefined : Number(humidity),
    })
    // Reset only the values that change between weigh-ins.
    setWeightG('')
    setTemperature('')
    setHumidity('')
    setDate(nowForInput())
  }

  const target = piece.drying?.targetLossPct
  const last = weighIns?.at(-1)
  const targetReached =
    target !== undefined &&
    last !== undefined &&
    calculateWeightLossPct(piece.initialWeightG, last.weightG) >= target

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{es.weighIns.title}</h2>

      {targetReached && (
        <p className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          {es.weighIns.targetReached}
        </p>
      )}

      {canAdd && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-stone-200 p-4 dark:border-stone-700"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={es.weighIns.date} htmlFor="wDate">
              <input
                id="wDate"
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label={es.weighIns.weight} htmlFor="wWeight">
              <input
                id="wWeight"
                type="number"
                required
                min="1"
                inputMode="numeric"
                value={weightG}
                onChange={(e) => setWeightG(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label={es.weighIns.temperature}
              htmlFor="wTemp"
              hint={es.weighIns.optional}
            >
              <input
                id="wTemp"
                type="number"
                step="any"
                inputMode="decimal"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label={es.weighIns.humidity}
              htmlFor="wHum"
              hint={es.weighIns.optional}
            >
              <input
                id="wHum"
                type="number"
                min="0"
                max="100"
                step="any"
                inputMode="decimal"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-700"
          >
            {es.weighIns.add}
          </button>
        </form>
      )}

      {weighIns?.length === 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{es.weighIns.empty}</p>
      )}

      <ul className="space-y-2">
        {/* Newest first for reading; we copy with [...] because reverse() mutates. */}
        {weighIns && [...weighIns].reverse().map((w) => (
          <li
            key={w.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700"
          >
            <div>
              <p className="font-medium">
                {w.weightG} g{' '}
                <span className="text-sky-600 dark:text-sky-400">
                  {es.weighIns.loss(calculateWeightLossPct(piece.initialWeightG, w.weightG))}
                </span>
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {format(new Date(w.date), 'dd/MM/yyyy HH:mm')}
                {w.temperatureC !== undefined && ` · ${w.temperatureC} °C`}
                {w.humidityPct !== undefined && ` · ${w.humidityPct} %`}
              </p>
            </div>
            <button
              onClick={() => deleteWeighIn(w.id)}
              aria-label={es.weighIns.remove}
              className="rounded px-2 py-1 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}