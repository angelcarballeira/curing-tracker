// Used when the type has no letters at all (should be rare).
const FALLBACK_PREFIX = 'PZA'

// "Bondiola" -> "BON", "Lomito" -> "LOM", "Ñandú" -> "AND"
export function getCodePrefix(type: string): string {
  const letters = type
    .normalize('NFD') // splits "é" into "e" + an accent mark...
    .replace(/[\u0300-\u036f]/g, '') // ...and this removes the accent marks
    .replace(/[^a-zA-Z]/g, '') // keep letters only
    .toUpperCase()
  return letters.slice(0, 3) || FALLBACK_PREFIX
}

// Finds the highest number already used with this prefix and adds 1.
// We use "highest + 1" and not "count + 1": if you delete BON-002 and
// keep BON-003, counting would suggest BON-003 again and collide.
export function generatePieceCode(
  type: string,
  existingCodes: string[],
): string {
  const prefix = getCodePrefix(type)
  // The prefix contains only letters, so it is safe inside a RegExp.
  const pattern = new RegExp(`^${prefix}-(\\d+)$`)

  let highest = 0
  for (const code of existingCodes) {
    const match = pattern.exec(code.toUpperCase())
    if (match) highest = Math.max(highest, Number(match[1]))
  }
  return `${prefix}-${String(highest + 1).padStart(3, '0')}`
}