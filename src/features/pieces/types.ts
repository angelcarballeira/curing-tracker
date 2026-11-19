// The lifecycle of a piece: it cures first, then dries, then it is ready to eat.
export type PieceStatus = 'curing' | 'drying' | 'ready'

// Curing methods are a fixed list because the time calculation depends on them.
// "other" lets the user describe anything else in free text (curingDetail).
export type CuringMethod =
  | 'dry-salt'
  | 'salt-sugar'
  | 'salt-nitrite'
  | 'brine'
  | 'other'

export interface Piece {
  id: string
  code: string // unique, human-readable, generated from type and a number
  userId?: string // empty for now; will be filled when login exists
  type: string // "Bondiola", "Lomito", or any custom type
  initialWeightG: number
  thicknessCm?: number // optional, but the best input for estimating curing time

  status: PieceStatus

  curing: {
    startDate: string
    method: CuringMethod
    detail?: string // how it went: ratios, extra ingredients, etc.
    estimatedHours: number // editable by the user
  }

  // Only exists once the piece moves to the drying stage.
  drying?: {
    startDate: string
    type: string // "Tradicional", "Heladera", or a custom type
    seasoning?: string // spices added when drying started
    targetLossPct?: number // e.g. 35 means "ready at 35% weight loss"
  }

  notes?: string
  rating?: number // 1 to 5, filled in when the piece is ready
  createdAt: string
  updatedAt: string
}

// One measurement of the piece during drying.
export interface WeighIn {
  id: string
  pieceId: string // links this weigh-in to its piece
  date: string
  weightG: number
  temperatureC?: number // optional, as you requested
  humidityPct?: number // optional, as you requested
}

// Entries for the user-editable lists (piece types, drying types).
export type OptionKind = 'pieceType' | 'dryingType'

export type NewPiece = Omit<Piece, 'id' | 'code' | 'createdAt' | 'updatedAt'> & {
  code?: string
}

export interface Option {
  id: string
  kind: OptionKind
  label: string
}

// When creating a record, the app generates id and timestamps itself,
// so the forms should not have to provide them.
export type NewWeighIn = Omit<WeighIn, 'id'>