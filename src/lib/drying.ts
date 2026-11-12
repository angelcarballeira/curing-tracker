// How much weight has the piece lost, as a percentage of its starting weight?
// Rounded to 1 decimal. This is the main "is it ready?" indicator.
export function calculateWeightLossPct(
  initialWeightG: number,
  currentWeightG: number,
): number {
  if (initialWeightG <= 0) return 0
  const loss = ((initialWeightG - currentWeightG) / initialWeightG) * 100
  return Math.round(loss * 10) / 10
}

// At what weight will the piece be ready? Useful to show "target: 650 g".
export function calculateTargetWeightG(
  initialWeightG: number,
  targetLossPct: number,
): number {
  return Math.round(initialWeightG * (1 - targetLossPct / 100))
}