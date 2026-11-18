/**
 * Endpoints públicos y de jugador contra el servidor real:
 * catálogo de servicios, búsqueda, detalle, estadísticas, reseñas, favoritos y reportes.
 */
import { request } from './httpClient';

/** @typedef {import('@/types/api').SearchFilters} SearchFilters */
/** @typedef {import('@/types/api').ReviewInput} ReviewInput */
/** @typedef {import('@/types/api').ReportInput} ReportInput */
/** @typedef {import('@/types/domain').Amenity} Amenity */
/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('@/types/domain').EstablishmentSummary} EstablishmentSummary */
/** @typedef {import('@/types/domain').Review} Review */
/** @typedef {import('@/types/domain').StatEventType} StatEventType */

/**
 * Lista los servicios activos del catálogo.
 * @returns {Promise<Amenity[]>}
 */
export function listAmenities() {
  return request('/services');
}

/**
 * Busca establecimientos aprobados y publicados.
 * @param {SearchFilters} filters Texto, chips, orden y ubicación.
 * @returns {Promise<EstablishmentSummary[]>}
 */
export function searchEstablishments(filters) {
  return request('/establishments', {
    query: {
      q: filters.query,
      courtTypes: filters.courtTypes?.join(','),
      roofed: filters.roofedOnly || undefined,
      sort: filters.sortBy,
      lat: filters.near?.lat,
      lng: filters.near?.lng,
    },
  });
}

/**
 * Obtiene el detalle de un establecimiento por su slug.
 * @param {string} slug Identificador legible.
 * @returns {Promise<Establishment>}
 */
export function getEstablishmentBySlug(slug) {
  return request(`/establishments/${encodeURIComponent(slug)}`);
}

/**
 * Registra un evento para las estadísticas del negocio. Nunca lanza error.
 * @param {string} establishmentId Id del establecimiento.
 * @param {StatEventType} type Tipo de evento.
 * @returns {Promise<void>}
 */
export async function trackEvent(establishmentId, type) {
  await request(`/establishments/${establishmentId}/events`, {
    method: 'POST',
    body: { type },
  }).catch(() => undefined);
}

/**
 * Lista las reseñas visibles de un establecimiento.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {Promise<Review[]>}
 */
export function listReviews(establishmentId) {
  return request(`/establishments/${establishmentId}/reviews`);
}

/**
 * Crea o reemplaza la reseña del jugador actual (una por establecimiento).
 * @param {string} establishmentId Id del establecimiento.
 * @param {ReviewInput} input Estrellas y comentario.
 * @returns {Promise<Review>}
 */
export function upsertReview(establishmentId, input) {
  return request(`/establishments/${establishmentId}/reviews`, { method: 'PUT', body: input });
}

/**
 * Lista los favoritos del jugador actual.
 * @returns {Promise<EstablishmentSummary[]>}
 */
export function listFavorites() {
  return request('/me/favorites');
}

/**
 * Agrega un establecimiento a favoritos.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {Promise<void>}
 */
export function addFavorite(establishmentId) {
  return request('/me/favorites', { method: 'POST', body: { establishmentId } });
}

/**
 * Quita un establecimiento de favoritos.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {Promise<void>}
 */
export function removeFavorite(establishmentId) {
  return request(`/me/favorites/${establishmentId}`, { method: 'DELETE' });
}

/**
 * Envía un reporte de información incorrecta o de reseña ofensiva.
 * @param {ReportInput} input Datos del reporte.
 * @returns {Promise<void>}
 */
export function createReport(input) {
  return request('/reports', { method: 'POST', body: input });
}
