import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import type { OptionKind } from '../pieces/types'

// Returns the user-editable list for a kind ("pieceType" or "dryingType").
// Returns undefined while loading, like any useLiveQuery.
export function useOptions(kind: OptionKind) {
  return useLiveQuery(
    () => db.options.where('kind').equals(kind).sortBy('label'),
    [kind],
  )
}