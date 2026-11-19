import { describe, expect, it } from 'vitest'
import { generatePieceCode, getCodePrefix } from './pieceCode'

describe('getCodePrefix', () => {
  it('uses the first 3 letters, uppercase, without accents', () => {
    expect(getCodePrefix('Bondiola')).toBe('BON')
    expect(getCodePrefix('Cámara')).toBe('CAM')
  })

  it('falls back when there are no letters', () => {
    expect(getCodePrefix('123')).toBe('PZA')
  })
})

describe('generatePieceCode', () => {
  it('starts at 001', () => {
    expect(generatePieceCode('Bondiola', [])).toBe('BON-001')
  })

  it('uses highest + 1, not the count', () => {
    expect(generatePieceCode('Bondiola', ['BON-001', 'BON-003'])).toBe('BON-004')
  })

  it('counts each prefix separately', () => {
    expect(generatePieceCode('Lomito', ['BON-001', 'BON-002'])).toBe('LOM-001')
  })
})