/** Panel del administrador contra el servidor real. Todas las rutas requieren rol admin. */
import { request } from './httpClient';

/** @typedef {import('@/types/api').PendingEstablishment} PendingEstablishment */
/** @typedef {import('@/types/api').ReportWithContext} ReportWithContext */
/** @typedef {import('@/types/api').ReportAction} ReportAction */
/** @typedef {import('@/types/domain').Amenity} Amenity */
/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('@/types/domain').PlatformMetrics} PlatformMetrics */

/**
 * Establecimientos esperando aprobación.
 * @returns {Promise<PendingEstablishment[]>}
 */
export function listPending() {
  return request('/admin/establishments', { query: { status: 'pending' } });
}

/**
 * Aprueba un establecimiento.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<void>}
 */
export function approve(id) {
  return request(`/admin/establishments/${id}/approve`, { method: 'POST' });
}

/**
 * Rechaza un establecimiento con un motivo que verá el negocio.
 * @param {string} id Id del establecimiento.
 * @param {string} reason Motivo del rechazo.
 * @returns {Promise<void>}
 */
export function reject(id, reason) {
  return request(`/admin/establishments/${id}/reject`, { method: 'POST', body: { reason } });
}

/**
 * Suspende o reactiva un establecimiento.
 * @param {string} id Id del establecimiento.
 * @param {'approved' | 'suspended'} status Nuevo estado.
 * @returns {Promise<void>}
 */
export function setStatus(id, status) {
  return request(`/admin/establishments/${id}/status`, { method: 'PUT', body: { status } });
}

/**
 * Todos los establecimientos, en cualquier estado.
 * @returns {Promise<Establishment[]>}
 */
export function listAllEstablishments() {
  return request('/admin/establishments');
}

/**
 * Reportes abiertos con su contexto.
 * @returns {Promise<ReportWithContext[]>}
 */
export function listOpenReports() {
  return request('/admin/reports', { query: { status: 'open' } });
}

/**
 * Resuelve un reporte con una acción.
 * @param {string} reportId Id del reporte.
 * @param {ReportAction} action Acción tomada.
 * @returns {Promise<void>}
 */
export function resolveReport(reportId, action) {
  return request(`/admin/reports/${reportId}/resolve`, { method: 'POST', body: { action } });
}

/**
 * Catálogo completo de servicios, incluidos los inactivos.
 * @returns {Promise<Amenity[]>}
 */
export function listAmenities() {
  return request('/admin/services');
}

/**
 * Crea (sin id) o edita (con id) un servicio del catálogo.
 * @param {Partial<Amenity> & Omit<Amenity, 'id'>} amenity Datos del servicio.
 * @returns {Promise<Amenity>}
 */
export function saveAmenity(amenity) {
  return amenity.id
    ? request(`/admin/services/${amenity.id}`, { method: 'PUT', body: amenity })
    : request('/admin/services', { method: 'POST', body: amenity });
}

/**
 * Métricas generales de la plataforma.
 * @returns {Promise<PlatformMetrics>}
 */
export function getMetrics() {
  return request('/admin/metrics');
}
