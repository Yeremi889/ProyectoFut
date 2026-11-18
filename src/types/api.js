/**
 * Tipos de entrada y salida de la capa de servicios (contrato con el servidor).
 * Ver docs/API.md para la descripción de cada endpoint.
 * Este archivo solo documenta con JSDoc; no ejecuta código.
 */

/** @typedef {import('./domain').User} User */
/** @typedef {import('./domain').UserRole} UserRole */
/** @typedef {import('./domain').CourtType} CourtType */
/** @typedef {import('./domain').GeoPoint} GeoPoint */
/** @typedef {import('./domain').Report} Report */

/**
 * Respuesta de inicio de sesión o registro.
 * @typedef {object} AuthResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * Datos para crear una cuenta. El rol admin no se puede crear desde la web.
 * @typedef {object} RegisterInput
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'player' | 'business'} role
 */

/**
 * Criterios de ordenamiento del listado.
 * @typedef {'price' | 'rating' | 'distance'} SortOption
 */

/**
 * Filtros del listado público. Todos son opcionales.
 * @typedef {object} SearchFilters
 * @property {string} [query] Texto libre: nombre, provincia o cantón.
 * @property {CourtType[]} [courtTypes] Chips seleccionados (coincide si tiene al menos uno).
 * @property {boolean} [roofedOnly] Solo con al menos una cancha techada.
 * @property {SortOption} [sortBy]
 * @property {GeoPoint} [near] Ubicación del usuario, necesaria para ordenar por cercanía.
 */

/**
 * Campos editables de un establecimiento (canchas y fotos tienen su propio endpoint).
 * @typedef {object} EstablishmentInput
 * @property {string} [name]
 * @property {string} [description]
 * @property {string} [province]
 * @property {string} [canton]
 * @property {string} [address]
 * @property {GeoPoint | null} [location]
 * @property {string} [phone]
 * @property {string} [whatsapp]
 * @property {string} [nightRateStartsAt]
 * @property {import('./domain').DaySchedule[]} [schedule]
 * @property {string[]} [amenityIds]
 */

/**
 * Datos para crear o editar una cancha (una cancha sin id).
 * @typedef {object} CourtInput
 * @property {string} name
 * @property {CourtType} type
 * @property {boolean} roofed
 * @property {number} dayPrice
 * @property {number} nightPrice
 */

/**
 * Datos para crear o editar una reseña.
 * @typedef {object} ReviewInput
 * @property {number} rating
 * @property {string} comment
 */

/**
 * Datos para reportar información incorrecta o una reseña.
 * @typedef {object} ReportInput
 * @property {string} establishmentId
 * @property {string} [reviewId]
 * @property {import('./domain').InfoReportReason | 'offensive'} reason
 * @property {string} [comment]
 */

/**
 * Elemento de la bandeja de moderación: establecimiento pendiente.
 * @typedef {object} PendingEstablishment
 * @property {string} id
 * @property {string} name
 * @property {string} ownerName
 * @property {string} province
 * @property {string} canton
 * @property {string} submittedAt
 */

/**
 * Reporte con el contexto necesario para moderarlo.
 * @typedef {Report & { establishmentName: string, reviewComment: string | null }} ReportWithContext
 */

/**
 * Acción que el administrador toma sobre un reporte.
 * @typedef {'dismiss' | 'hide-review' | 'notify-business'} ReportAction
 */

export {};
