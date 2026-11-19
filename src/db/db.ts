import Dexie, { type EntityTable } from 'dexie'
import type { Option, Piece, WeighIn } from '../features/pieces/types'
import { generatePieceCode } from '../lib/pieceCode'


// We create the database and tell TypeScript which tables it has,
// so db.pieces.get(...) is fully typed.
export const db = new Dexie('curing-tracker') as Dexie & {
  pieces: EntityTable<Piece, 'id'>
  weighIns: EntityTable<WeighIn, 'id'>
  options: EntityTable<Option, 'id'>
}

// The string after each table name lists the primary key first ("id"),
// then the fields we want to search or sort by quickly.
// Fields not listed here are still stored, just not indexed.
db.version(1).stores({
  pieces: 'id, status, updatedAt',
  weighIns: 'id, pieceId, date',
  options: 'id, kind',
})

// The "populate" event runs only once, when the database is first created.
// We use it to insert the default lists, so the app is usable immediately.
db.on('populate', (tx) => {
  const defaults: Option[] = [
    { id: crypto.randomUUID(), kind: 'pieceType', label: 'Bondiola' },
    { id: crypto.randomUUID(), kind: 'pieceType', label: 'Lomito' },
    { id: crypto.randomUUID(), kind: 'dryingType', label: 'Tradicional' },
    { id: crypto.randomUUID(), kind: 'dryingType', label: 'Heladera' },
  ]
  tx.table('options').bulkAdd(defaults)
})

db.version(2)
  .stores({
    // "&code" means: index it AND it must be unique.
    // Two pieces can never share the same label.
    pieces: 'id, &code, status, updatedAt',
  })
  .upgrade(async (tx) => {
    // Runs once for users who already have pieces: give each one a code,
    // oldest first, so the numbering follows the real order.
    const pieces = await tx.table('pieces').toArray()
    pieces.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    const taken: string[] = []
    for (const piece of pieces) {
      const code = generatePieceCode(piece.type, taken)
      taken.push(code)
      await tx.table('pieces').update(piece.id, { code })
    }
  })