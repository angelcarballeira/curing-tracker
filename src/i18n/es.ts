// All user-facing text lives here. Code stays in English, UI stays in Spanish.
// Texts that need values (like "3 days") are functions, not strings.
export const es = {
  appName: 'Control de Curado',
  nav: {
    dashboard: 'Mis piezas',
    newPiece: 'Nueva pieza',
  },
  theme: {
    toDark: 'Activar modo oscuro',
    toLight: 'Activar modo claro',
  },
  dashboard: {
    title: 'Mis piezas',
    emptyTitle: 'Todavía no hay piezas',
    emptyText: 'Agrega tu primera pieza para empezar a controlar el proceso.',
  },
  status: {
    curing: 'Curando',
    drying: 'Secando',
    ready: 'Lista',
  },
  card: {
    curingEnds: (distance: string) => `Termina el curado ${distance}`,
    curingDone: 'Curado completo: lista para pasar al secado',
    weightLoss: (pct: number) => `Pérdida de peso: ${pct} %`,
    weightLossWithTarget: (pct: number, target: number) =>
      `Pérdida de peso: ${pct} % de ${target} %`,
    noWeighIns: 'Todavía sin pesajes',
  },
  newPiece: {
    title: 'Nueva pieza',
    comingSoon: 'El formulario llega en el próximo paso.',
  },
}