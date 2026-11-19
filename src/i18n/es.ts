
import type { CuringMethod } from '../features/pieces/types'

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
    type: 'Tipo de pieza',
    typePlaceholder: 'Elegí un tipo',
    addType: '+ Agregar otro tipo',
    newTypeLabel: 'Nombre del nuevo tipo',
    weight: 'Peso (kg)',
    thickness: 'Grosor (cm)',
    thicknessHint: 'Opcional, pero mejora mucho la estimación del curado.',
    method: 'Método de curado',
    startDate: 'Inicio del curado',
    estimatedHours: 'Horas de curado',
    estimateRange: (min: number, max: number, days: string) =>
      `Rango estimado: ${min} a ${max} h (${days} días)`,
    estimateFromWeight:
      'Estimación aproximada solo con el peso (24 h por kg). Agrega el grosor para un cálculo mejor.',
    restoreSuggestion: 'Usar valor sugerido',
    detail: 'Detalles del curado',
    detailHint: 'Por ejemplo: cantidad de sal, azúcar, salitre, especias.',
    save: 'Guardar pieza',
    saving: 'Guardando...',
  },
  curingMethods: {
    'dry-salt': 'Solo sal',
    'salt-sugar': 'Sal y azúcar',
    'salt-nitrite': 'Sal y salitre',
    brine: 'Salmuera',
    other: 'Otro',
  } satisfies Record<CuringMethod, string>,
}

