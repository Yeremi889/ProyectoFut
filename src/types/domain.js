/**
 * Tipos del dominio: las entidades principales de la plataforma.
 * Corresponden a la sección 5 del SOP ("Entidades principales").
 *
 * Este archivo no ejecuta código: solo documenta la forma de los datos con JSDoc,
 * para que el editor muestre ayuda y autocompletado. Se importa así:
 *   /** @typedef {import('@/types/domain').Establishment} Establishment *\/
 */

/**
 * Rol de una cuenta. El visitante sin cuenta no tiene rol.
 * @typedef {'player' | 'business' | 'admin'} UserRole
 */

/**
 * Usuario autenticado (nunca incluye la contraseña).
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} createdAt Fecha ISO 8601.
 */

/**
 * Día de la semana: 0 = domingo ... 6 = sábado (igual que Date.getDay()).
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6} DayOfWeek
 */

/**
 * Horario de atención de un día.
 * Si close es menor o igual que open, el cierre es después de medianoche.
 * @typedef {object} DaySchedule
 * @property {DayOfWeek} day
 * @property {boolean} closed
 * @property {string} open Hora "HH:mm". Se ignora si closed = true.
 * @property {string} close Hora "HH:mm".
 */

/**
 * Tipos de cancha admitidos.
 * @typedef {'futbol5' | 'futbol7' | 'futbol8' | 'futbol11'} CourtType
 */

/**
 * Cancha dentro de un establecimiento. Precios en colones por hora.
 * @typedef {object} Court
 * @property {string} id
 * @property {string} name
 * @property {CourtType} type
 * @property {boolean} roofed
 * @property {number} dayPrice
 * @property {number} nightPrice
 */

/**
 * Foto de un establecimiento. El orden del arreglo es el orden de la galería.
 * @typedef {object} Photo
 * @property {string} id
 * @property {string} url
 * @property {boolean} isCover
 */

/**
 * Claves de íconos disponibles para los servicios (ver components/establishment/amenityIcons.js).
 * @typedef {'parking' | 'lockers' | 'showers' | 'roofed' | 'lighting' | 'cafeteria' | 'stands' | 'balls' | 'wifi' | 'restrooms' | 'accessible'} AmenityIconKey
 */

/**
 * Servicio del catálogo (parqueo, duchas...). Lo administra el administrador.
 * @typedef {object} Amenity
 * @property {string} id
 * @property {string} name
 * @property {AmenityIconKey} icon
 * @property {boolean} active
 */

/**
 * Coordenadas geográficas.
 * @typedef {object} GeoPoint
 * @property {number} lat
 * @property {number} lng
 */

/**
 * Estado de aprobación de un establecimiento.
 * - draft: el negocio no ha terminado el asistente.
 * - pending: enviado, esperando revisión del administrador.
 * - approved: aprobado (visible si además published = true).
 * - rejected: rechazado con motivo; el negocio puede corregir y reenviar.
 * - suspended: suspendido por el administrador.
 * @typedef {'draft' | 'pending' | 'approved' | 'rejected' | 'suspended'} EstablishmentStatus
 */

/**
 * Establecimiento completo (vista de detalle y de edición).
 * @typedef {object} Establishment
 * @property {string} id
 * @property {string} ownerId
 * @property {string} slug Identificador legible para el link propio: /c/{slug}.
 * @property {string} name
 * @property {string} description
 * @property {string} province
 * @property {string} canton
 * @property {string} address
 * @property {GeoPoint | null} location
 * @property {string} phone
 * @property {string} whatsapp
 * @property {string} nightRateStartsAt Hora "HH:mm" en que empieza la tarifa nocturna.
 * @property {DaySchedule[]} schedule
 * @property {Court[]} courts
 * @property {Photo[]} photos
 * @property {string[]} amenityIds
 * @property {EstablishmentStatus} status
 * @property {string | null} rejectionReason
 * @property {boolean} published
 * @property {number} ratingAverage
 * @property {number} ratingCount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Datos reducidos de un establecimiento para las tarjetas del listado.
 * @typedef {object} EstablishmentSummary
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} province
 * @property {string} canton
 * @property {string | null} coverUrl
 * @property {number | null} fromPrice Menor precio diurno, o null si no tiene canchas.
 * @property {number} ratingAverage
 * @property {number} ratingCount
 * @property {CourtType[]} courtTypes
 * @property {boolean} hasRoofedCourt
 * @property {DaySchedule[]} schedule
 * @property {GeoPoint | null} location
 * @property {number | null} [distanceKm] Solo presente al ordenar por cercanía.
 */

/**
 * Reseña de un jugador sobre un establecimiento.
 * @typedef {object} Review
 * @property {string} id
 * @property {string} establishmentId
 * @property {string} userId
 * @property {string} userName
 * @property {number} rating Calificación de 1 a 5.
 * @property {string} comment
 * @property {{ text: string, createdAt: string } | null} reply Respuesta pública del negocio.
 * @property {boolean} hidden
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Motivos de reporte de información incorrecta.
 * @typedef {'phone' | 'price' | 'schedule' | 'closed' | 'other'} InfoReportReason
 */

/**
 * Reporte enviado por un visitante o jugador.
 * @typedef {object} Report
 * @property {string} id
 * @property {'info' | 'review'} kind
 * @property {string} establishmentId
 * @property {string | null} reviewId
 * @property {InfoReportReason | 'offensive'} reason
 * @property {string} comment
 * @property {'open' | 'resolved'} status
 * @property {string | null} resolution
 * @property {string} createdAt
 */

/**
 * Tipos de evento que alimentan las estadísticas del negocio.
 * @typedef {'view' | 'whatsapp' | 'directions' | 'favorite'} StatEventType
 */

/**
 * Conteo de eventos de un mes.
 * @typedef {object} MonthlyStats
 * @property {string} month "YYYY-MM".
 * @property {number} view
 * @property {number} whatsapp
 * @property {number} directions
 * @property {number} favorite
 */

/**
 * Métricas generales para el administrador.
 * @typedef {object} PlatformMetrics
 * @property {number} activeEstablishments
 * @property {number} pendingEstablishments
 * @property {number} totalViewsLast30Days
 * @property {{ term: string, count: number }[]} topSearches
 * @property {{ term: string, count: number }[]} searchesWithoutResults
 */

export {};
