import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../../db/db'
import { es } from '../../i18n/es'
import PieceCard from './PieceCard'

export default function DashboardPage() {
  // Newest first. The component re-renders by itself when the table changes.
  const pieces = useLiveQuery(() => db.pieces.orderBy('updatedAt').reverse().toArray())

  // useLiveQuery returns undefined while the first query is running.
  if (!pieces) return null

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{es.dashboard.title}</h1>
        <Link
          to="/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {es.nav.newPiece}
        </Link>
      </div>

      {pieces.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center dark:border-stone-600">
          <p className="font-medium">{es.dashboard.emptyTitle}</p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {es.dashboard.emptyText}
          </p>
        </div>
      ) : (
        // 1 column on phones, 2 columns from the "sm" breakpoint (640 px) up.
        <div className="grid gap-4 sm:grid-cols-2">
          {pieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  )
}