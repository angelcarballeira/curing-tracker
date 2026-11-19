import { db } from '../../db/db'
import { generatePieceCode } from '../../lib/pieceCode'

import type {
  NewPiece,
  NewWeighIn,
  OptionKind,
  Piece,
} from './types'

const now = () => new Date().toISOString()
export async function getAllCodes(): Promise<string[]> {
  return (await db.pieces.toArray()).map((piece) => piece.code)
}

// Is this label used by another piece? "exceptId" lets a piece keep its own.
export async function isCodeTaken(
  code: string,
  exceptId?: string,
): Promise<boolean> {
  const found = await db.pieces.where('code').equals(code).first()
  return found !== undefined && found.id !== exceptId
}

export async function createPiece(data: NewPiece): Promise<string> {
  const id = crypto.randomUUID()
  // The transaction makes "read the codes" and "save the piece" one step,
  // so a code can't be taken by someone else in between.
  await db.transaction('rw', db.pieces, async () => {
    const code =
      data.code?.trim().toUpperCase() ||
      generatePieceCode(data.type, await getAllCodes())
    await db.pieces.add({ ...data, code, id, createdAt: now(), updatedAt: now() })
  })
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

export async function startDrying(
  id: string,
  drying: NonNullable<Piece['drying']>,
): Promise<void> {
  await updatePiece(id, { status: 'drying', drying })
}

export async function markReady(id: string): Promise<void> {
  await updatePiece(id, { status: 'ready' })
}

export async function deleteWeighIn(id: string): Promise<void> {
  await db.weighIns.delete(id)
}