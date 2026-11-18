/** Catálogos fijos de la aplicación con sus etiquetas visibles. */

/** Etiquetas de cada tipo de cancha, en el orden en que se muestran. */
export const COURT_TYPE_LABELS = {
  futbol5: 'Fútbol 5',
  futbol7: 'Fútbol 7',
  futbol8: 'Fútbol 8',
  futbol11: 'Fútbol 11',
};

export const COURT_TYPES = Object.keys(COURT_TYPE_LABELS);

/** Tipos de cancha que aparecen como chips rápidos en la búsqueda (SOP F-03). */
export const QUICK_FILTER_COURT_TYPES = ['futbol5', 'futbol7', 'futbol11'];

/** Nombres de los días, indexados por DayOfWeek. */
export const DAY_NAMES = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

/** Orden de los días para mostrar horarios: lunes primero. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** Horario inicial de un establecimiento nuevo: todos los días de 8:00 a 22:00. */
export const DEFAULT_SCHEDULE = WEEK_ORDER.map((day) => ({
  day,
  closed: false,
  open: '08:00',
  close: '22:00',
}));

/** Hora por defecto en que empieza la tarifa nocturna. */
export const DEFAULT_NIGHT_RATE_START = '18:00';

/** Opciones del selector "Ordenar por". */
export const SORT_OPTION_LABELS = {
  price: 'Menor precio',
  rating: 'Mejor calificación',
  distance: 'Más cerca',
};

/** Motivos de reporte de información incorrecta (SOP F-12). */
export const INFO_REPORT_REASON_LABELS = {
  phone: 'El teléfono o WhatsApp no funciona',
  price: 'Los precios no son correctos',
  schedule: 'El horario no es correcto',
  closed: 'El lugar cerró definitivamente',
  other: 'Otro motivo',
};

/** Etiquetas de los eventos de estadísticas (SOP F-29). */
export const STAT_EVENT_LABELS = {
  view: 'Visitas al perfil',
  whatsapp: 'Toques en WhatsApp',
  directions: 'Toques en Cómo llegar',
  favorite: 'Guardado en favoritos',
};
