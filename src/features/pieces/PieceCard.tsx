import { useLiveQuery } from 'dexie-react-hooks'
import { formatDistanceToNowStrict } from 'date-fns'
import { es as esLocale } from 'date-fns/locale'
import { db } from '../../db/db'
import { es } from '../../i18n/es'
import { calculateCuringEndDate } from '../../lib/curing'
import { calculateWeightLossPct } from '../../lib/drying'
import type { Piece } from './types'

import { Link } from 'react-router-dom'
import { STATUS_STYLES } from './statusStyles'

function CuringInfo({ piece }: { piece: Piece }) {
  const end = calculateCuringEndDate(
    piece.curing.startDate,
    piece.curing.estimatedHours,
  )
  const isDone = end.getTime() <= Date.now()

  if (isDone) return <p className="text-sm">{es.card.curingDone}</p>

  const distance = formatDistanceToNowStrict(end, {
    locale: esLocale,
    addSuffix: true, // "en 3 días"
  })
  return <p className="text-sm">{es.card.curingEnds(distance)}</p>
}

function DryingInfo({ piece }: { piece: Piece }) {
  // Re-runs automatically when a new weigh-in is added.
  const lastWeighIn = useLiveQuery(async () => {
    const all = await db.weighIns.where('pieceId').equals(piece.id).sortBy('date')
    return all.at(-1)
  }, [piece.id])

  if (!lastWeighIn) {
    return <p className="text-sm">{es.card.noWeighIns}</p>
  }

  const lossPct = calculateWeightLossPct(
    piece.initialWeightG,
    lastWeighIn.weightG,
  )
  const target = piece.drying?.targetLossPct

  if (!target) return <p className="text-sm">{es.card.weightLoss(lossPct)}</p>

  // The bar fills up to 100% when the target is reached, never beyond it.
  const progress = Math.min(100, Math.max(0, (lossPct / target) * 100))

  return (
    <div>
      <p className="mb-1 text-sm">{es.card.weightLossWithTarget(lossPct, target)}</p>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
        <div
          className="h-full rounded-full bg-sky-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default function PieceCard({ piece }: { piece: Piece }) {
  return (
    <Link
      to={`/pieces/${piece.id}`}
      className="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:border-emerald-500 dark:border-stone-700 dark:bg-stone-800"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{piece.type}</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {(piece.initialWeightG / 1000).toFixed(2)} kg
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[piece.status]}`}>
          {es.status[piece.status]}
        </span>
      </div>

      {piece.status === 'curing' && <CuringInfo piece={piece} />}
      {piece.status === 'drying' && <DryingInfo piece={piece} />}
    </Link>
  )
}



