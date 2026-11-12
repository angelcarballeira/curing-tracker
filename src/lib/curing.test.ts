import { describe, expect, it } from 'vitest'
import { calculateCuringEstimate, calculateSimpleCuringHours } from './curing'
import { calculateTargetWeightG, calculateWeightLossPct } from './drying'

describe('calculateSimpleCuringHours', () => {
  it('uses 24 hours per kg', () => {
    expect(calculateSimpleCuringHours(1500)).toBe(36)
  })
})

describe('calculateCuringEstimate', () => {
  it('uses thickness when available (dry salt, 5 cm)', () => {
    const result = calculateCuringEstimate({
      weightG: 1500,
      thicknessCm: 5,
      method: 'dry-salt',
    })
    // 5 cm * 2.8 days * 24 h = 336 h, and 5 cm * 4 days * 24 h = 480 h
    expect(result.minHours).toBe(336)
    expect(result.maxHours).toBe(480)
    expect(result.suggestedHours).toBe(408)
    expect(result.basis).toBe('thickness')
  })

  it('falls back to weight when there is no thickness', () => {
    const result = calculateCuringEstimate({ weightG: 2000, method: 'brine' })
    expect(result.suggestedHours).toBe(48)
    expect(result.basis).toBe('weight')
  })
})

describe('drying helpers', () => {
  it('calculates weight loss percentage', () => {
    expect(calculateWeightLossPct(1000, 650)).toBe(35)
  })

  it('calculates the target weight', () => {
    expect(calculateTargetWeightG(1000, 35)).toBe(650)
  })
})