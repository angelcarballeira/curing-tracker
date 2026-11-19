import type { PieceStatus } from './types'

// Shared by PieceCard and PieceDetailPage so the badge looks the same everywhere.
export const STATUS_STYLES: Record<PieceStatus, string> = {
  curing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  drying: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  ready: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
}