import { addHours } from 'date-fns'
import type { CuringMethod } from '../features/pieces/types'

const HOURS_PER_DAY = 24

// Your original rule of thumb: 24 hours per kg of meat.
// Used as a fallback when we don't know the thickness.
const SIMPLE_HOURS_PER_KG = 24

// Curing time depends mostly on THICKNESS, because salt has to
// travel from the surface to the center of the meat.
// Dry curing is commonly quoted as 7 to 10 days per 2.5 cm of thickness,
// which is 2.8 to 4 days per cm. Brine is faster because the salt is
// already dissolved. These are starting values: adjust them with your
// own experience and with trusted charcuterie sources.
const DAYS_PER_CM: Record<CuringMethod, { min: number; max: number }> = {
  'dry-salt': { min: 2.8, max: 4 },
  'salt-sugar': { min: 2.8, max: 4 },
  'salt-nitrite': { min: 2.8, max: 4 },
  brine: { min: 1, max: 1.7 },
  // Unknown method: we use the dry-salt values, the more conservative choice.
  other: { min: 2.8, max: 4 },
}

export interface CuringEstimate {
  minHours: number
  maxHours: number
  suggestedHours: number // the value that pre-fills the form
  basis: 'thickness' | 'weight' // tells the UI which rule was used
}

export function calculateSimpleCuringHours(weightG: number): number {
  return Math.round((weightG / 1000) * SIMPLE_HOURS_PER_KG)
}

interface EstimateInput {
  weightG: number
  thicknessCm?: number
  method: CuringMethod
}

export function calculateCuringEstimate({
  weightG,
  thicknessCm,
  method,
}: EstimateInput): CuringEstimate {
  // No thickness (or an invalid one): fall back to the simple rule.
  // Min, max and suggested are the same, because we have no real range.
  if (!thicknessCm || thicknessCm <= 0) {
    const hours = calculateSimpleCuringHours(weightG)
    return {
      minHours: hours,
      maxHours: hours,
      suggestedHours: hours,
      basis: 'weight',
    }
  }

  const { min, max } = DAYS_PER_CM[method]
  const minHours = Math.round(thicknessCm * min * HOURS_PER_DAY)
  const maxHours = Math.round(thicknessCm * max * HOURS_PER_DAY)

  return {
    minHours,
    maxHours,
    // The midpoint is a neutral starting value. The user can edit it.
    suggestedHours: Math.round((minHours + maxHours) / 2),
    basis: 'thickness',
  }
}

// When should the curing end? Used by the dashboard to show a countdown.
export function calculateCuringEndDate(
  startDate: string,
  hours: number,
): Date {
  return addHours(new Date(startDate), hours)
}