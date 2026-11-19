import { subDays } from 'date-fns'
import { db } from '../db/db'
import { addWeighIn, createPiece } from '../features/pieces/repository'

async function seedDemo() {
  await createPiece({
    type: 'Bondiola',
    initialWeightG: 1500,
    thicknessCm: 5,
    status: 'curing',
    curing: {
      startDate: subDays(new Date(), 3).toISOString(),
      method: 'dry-salt',
      estimatedHours: 408,
    },
  })

  const dryingId = await createPiece({
    type: 'Lomito',
    initialWeightG: 1000,
    status: 'drying',
    curing: {
      startDate: subDays(new Date(), 20).toISOString(),
      method: 'salt-nitrite',
      estimatedHours: 240,
    },
    drying: {
      startDate: subDays(new Date(), 10).toISOString(),
      type: 'Tradicional',
      targetLossPct: 35,
    },
  })
  await addWeighIn({ pieceId: dryingId, date: subDays(new Date(), 5).toISOString(), weightG: 880 })
  await addWeighIn({ pieceId: dryingId, date: new Date().toISOString(), weightG: 780 })
}

async function clearDemo() {
  await db.pieces.clear()
  await db.weighIns.clear()
}

// Expose both functions so you can call them from the browser console.
Object.assign(window, { seedDemo, clearDemo })