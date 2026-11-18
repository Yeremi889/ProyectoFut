/** Panel del negocio contra el servidor real. Todas las rutas requieren sesión de negocio. */
import { request } from './httpClient';

/** @typedef {import('@/types/api').EstablishmentInput} EstablishmentInput */
/** @typedef {import('@/types/api').CourtInput} CourtInput */
/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('@/types/domain').Court} Court */
/** @typedef {import('@/types/domain').MonthlyStats} MonthlyStats */
/** @typedef {import('@/types/domain').Review} Review */

const BASE = '/me/establishments';

/**
 * Lista los establecimientos (sucursales) del negocio.
 * @returns {Promise<Establishment[]>}
 */
export function listMine() {
  return request(BASE);
}

/**
 * Obtiene un establecimiento propio, en cualquier estado.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<Establishment>}
 */
export function getMine(id) {
  return request(`${BASE}/${id}`);
}

/**
 * Crea un establecimiento en estado borrador (primer paso del asistente).
 * @param {string} name Nombre del establecimiento.
 * @returns {Promise<Establishment>}
 */
export function createDraft(name) {
  return request(BASE, { method: 'POST', body: { name } });
}

/**
 * Actualiza campos de un establecimiento propio.
 * @param {string} id Id del establecimiento.
 * @param {EstablishmentInput} input Campos a cambiar.
 * @returns {Promise<Establishment>}
 */
export function update(id, input) {
  return request(`${BASE}/${id}`, { method: 'PUT', body: input });
}

/**
 * Envía el establecimiento a revisión del administrador.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<Establishment>}
 */
export function submitForReview(id) {
  return request(`${BASE}/${id}/submit`, { method: 'POST' });
}

/**
 * Publica u oculta un establecimiento aprobado.
 * @param {string} id Id del establecimiento.
 * @param {boolean} published true para publicar.
 * @returns {Promise<Establishment>}
 */
export function setPublished(id, published) {
  return request(`${BASE}/${id}`, { method: 'PUT', body: { published } });
}

/**
 * Agrega una cancha.
 * @param {string} id Id del establecimiento.
 * @param {CourtInput} input Datos de la cancha.
 * @returns {Promise<Court>}
 */
export function addCourt(id, input) {
  return request(`${BASE}/${id}/courts`, { method: 'POST', body: input });
}

/**
 * Edita una cancha.
 * @param {string} id Id del establecimiento.
 * @param {string} courtId Id de la cancha.
 * @param {CourtInput} input Datos nuevos.
 * @returns {Promise<Court>}
 */
export function updateCourt(id, courtId, input) {
  return request(`${BASE}/${id}/courts/${courtId}`, { method: 'PUT', body: input });
}

/**
 * Elimina una cancha.
 * @param {string} id Id del establecimiento.
 * @param {string} courtId Id de la cancha.
 * @returns {Promise<void>}
 */
export function deleteCourt(id, courtId) {
  return request(`${BASE}/${id}/courts/${courtId}`, { method: 'DELETE' });
}

/**
 * Sube una foto. El servidor la guarda y devuelve el establecimiento actualizado.
 * @param {string} id Id del establecimiento.
 * @param {File} file Archivo de imagen (ya validado).
 * @returns {Promise<Establishment>}
 */
export function uploadPhoto(id, file) {
  const form = new FormData();
  form.append('photo', file);
  return request(`${BASE}/${id}/photos`, { method: 'POST', body: form });
}

/**
 * Elimina una foto.
 * @param {string} id Id del establecimiento.
 * @param {string} photoId Id de la foto.
 * @returns {Promise<Establishment>}
 */
export function deletePhoto(id, photoId) {
  return request(`${BASE}/${id}/photos/${photoId}`, { method: 'DELETE' });
}

/**
 * Marca una foto como portada.
 * @param {string} id Id del establecimiento.
 * @param {string} photoId Id de la foto.
 * @returns {Promise<Establishment>}
 */
export function setCoverPhoto(id, photoId) {
  return request(`${BASE}/${id}/photos/${photoId}/cover`, { method: 'PUT' });
}

/**
 * Mueve una foto una posición en la galería.
 * @param {string} id Id del establecimiento.
 * @param {string} photoId Id de la foto.
 * @param {-1 | 1} direction -1 hacia adelante, 1 hacia atrás.
 * @returns {Promise<Establishment>}
 */
export function movePhoto(id, photoId, direction) {
  return request(`${BASE}/${id}/photos/${photoId}/move`, { method: 'PUT', body: { direction } });
}

/**
 * Estadísticas de los últimos 6 meses.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<MonthlyStats[]>}
 */
export function getStats(id) {
  return request(`${BASE}/${id}/stats`);
}

/**
 * Lista todas las reseñas de un establecimiento propio.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<Review[]>}
 */
export function listReviews(id) {
  return request(`/establishments/${id}/reviews`);
}

/**
 * Responde públicamente una reseña.
 * @param {string} reviewId Id de la reseña.
 * @param {string} text Respuesta.
 * @returns {Promise<Review>}
 */
export function replyToReview(reviewId, text) {
  return request(`/reviews/${reviewId}/reply`, { method: 'PUT', body: { text } });
}
