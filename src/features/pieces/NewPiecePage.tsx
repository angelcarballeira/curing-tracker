import { es } from '../../i18n/es'

// Placeholder so the "Nueva pieza" button leads somewhere. Replaced in Step 5.
export default function NewPiecePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">{es.newPiece.title}</h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">{es.newPiece.comingSoon}</p>
    </div>
  )
}