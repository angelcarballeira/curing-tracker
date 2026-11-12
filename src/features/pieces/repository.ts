import { db } from '../../db/db'
import type {
  NewPiece,
  NewWeighIn,
  OptionKind,
  Piece,
} from './types'

const now = () => new Date().toISOString()

export async function createPiece(data: NewPiece): Promise<string> {
  const id = crypto.randomUUID()
  await db.pieces.add({ ...data, id, createdAt: now(), updatedAt: now() })
  return id
}

// Partial<> means we can send only the fields that changed.
export async function updatePiece(
  id: string,
  changes: Partial<Omit<Piece, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.pieces.update(id, { ...changes, updatedAt: now() })
}

// A transaction makes both deletions succeed or fail together,
// so we never leave orphan weigh-ins pointing to a deleted piece.
export async function deletePiece(id: string): Promise<void> {
  await db.transaction('rw', db.pieces, db.weighIns, async () => {
    await db.weighIns.where('pieceId').equals(id).delete()
    await db.pieces.delete(id)
  })
}

export async function addWeighIn(data: NewWeighIn): Promise<void> {
  await db.weighIns.add({ ...data, id: crypto.randomUUID() })
}

export async function addOption(
  kind: OptionKind,
  label: string,
): Promise<void> {
  await db.options.add({ id: crypto.randomUUID(), kind, label: label.trim() })
}