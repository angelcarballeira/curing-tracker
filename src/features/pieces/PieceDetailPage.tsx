import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'date-fns'
import { db } from '../../db/db'
import { es } from '../../i18n/es'
import { calculateCuringEndDate } from '../../lib/curing'
import { calculateTargetWeightG } from '../../lib/drying'
// import CodeEditor from './CodeEditor'
import StartDryingForm from './StartDryingForm'
import WeighInSection from './WeightInSection'
import { deletePiece, markReady } from './repository'
import { STATUS_STYLES } from './statusStyles'
import CodeEditor from './codeEditor'

const formatDate = (iso: string) => format(new Date(iso), 'dd/MM/yyyy HH:mm')

// One row of the info block. Skips itself when there is no value.
function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
      <dd className="whitespace-pre-line">{value}</dd>
    </div>
  )
}

export default function PieceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // "?? null" is important: db.pieces.get() returns undefined for a missing
  // piece, and useLiveQuery also returns undefined while loading. Converting
  // "not found" to null lets us tell the two cases apart.
  const piece = useLiveQuery(async () => (await db.pieces.get(id!)) ?? null, [id])

  if (piece === undefined) return null // still loading
  if (piece === null) {
    return (
      <div>
        <p>{es.detail.notFound}</p>
        <Link to="/" className="text-emerald-600 underline">
          {es.detail.back}
        </Link>
      </div>
    )
  }

  const curingEnd = calculateCuringEndDate(
    piece.curing.startDate,
    piece.curing.estimatedHours,
  )
  const curingIsDone = curingEnd.getTime() <= Date.now()
  const target = piece.drying?.targetLossPct

  async function handleDelete() {
    if (!window.confirm(es.detail.confirmDelete)) return
    await deletePiece(piece!.id)
    navigate('/')
  }

  async function handleMarkReady() {
    if (!window.confirm(es.drying.confirmReady)) return
    await markReady(piece!.id)
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-emerald-600 dark:text-emerald-400">
        {es.detail.back}
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{piece.type}</h1>
          <CodeEditor pieceId={piece.id} code={piece.code} />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[piece.status]}`}
        >
          {es.status[piece.status]}
        </span>
      </div>

      <dl className="grid gap-3 rounded-xl border border-stone-200 p-4 text-sm sm:grid-cols-2 dark:border-stone-700">
        <InfoRow
          label={es.detail.initialWeight}
          value={`${(piece.initialWeightG / 1000).toFixed(2)} kg`}
        />
        <InfoRow
          label={es.detail.thickness}
          value={piece.thicknessCm ? `${piece.thicknessCm} cm` : undefined}
        />
        <InfoRow
          label={es.detail.method}
          value={es.curingMethods[piece.curing.method]}
        />
        <InfoRow
          label={es.detail.curingStart}
          value={formatDate(piece.curing.startDate)}
        />
        <InfoRow
          label={es.detail.curingEnd}
          value={formatDate(curingEnd.toISOString())}
        />
        <InfoRow label={es.detail.curingDetail} value={piece.curing.detail} />
        {piece.drying && (
          <>
            <InfoRow label={es.detail.dryingType} value={piece.drying.type} />
            <InfoRow
              label={es.detail.dryingStart}
              value={formatDate(piece.drying.startDate)}
            />
            <InfoRow label={es.detail.seasoning} value={piece.drying.seasoning} />
            <InfoRow
              label={es.detail.targetLoss}
              value={target ? `${target} %` : undefined}
            />
            <InfoRow
              label={es.detail.targetWeight}
              value={
                target
                  ? `${calculateTargetWeightG(piece.initialWeightG, target)} g`
                  : undefined
              }
            />
          </>
        )}
      </dl>

      {piece.status === 'curing' && (
        <>
          {curingIsDone && (
            <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              {es.detail.curingDoneBanner}
            </p>
          )}
          {/* Shown even before the estimate ends: you may know better than the formula. */}
          <StartDryingForm pieceId={piece.id} />
        </>
      )}

      {piece.status !== 'curing' && (
        <WeighInSection piece={piece} canAdd={piece.status === 'drying'} />
      )}

      {piece.status === 'drying' && (
        <button
          onClick={handleMarkReady}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700"
        >
          {es.drying.markReady}
        </button>
      )}

      <button
        onClick={handleDelete}
        className="w-full rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
      >
        {es.detail.delete}
      </button>
    </div>
  )
}