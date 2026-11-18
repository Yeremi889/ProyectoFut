/** Panel del administrador simulado. Todas las funciones exigen sesión con rol "admin". */
import { ApiError } from '../ApiError';
import { loadDatabase, saveDatabase } from './database';
import { clone, createId, delay, nowIso, recalculateRating, requireUser } from './helpers';

/** @typedef {import('@/types/api').PendingEstablishment} PendingEstablishment */
/** @typedef {import('@/types/api').ReportWithContext} ReportWithContext */
/** @typedef {import('@/types/api').ReportAction} ReportAction */
/** @typedef {import('@/types/domain').Amenity} Amenity */
/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('@/types/domain').PlatformMetrics} PlatformMetrics */
/** @typedef {import('./database').MockDatabase} MockDatabase */

/** Texto que se guarda como resolución de cada acción. */
const RESOLUTION_TEXT = {
  dismiss: 'Descartado',
  'hide-review': 'Reseña ocultada',
  'notify-business': 'Se pidió al negocio corregir la información',
};

/**
 * Carga la base y verifica que el usuario sea administrador.
 * @returns {Promise<MockDatabase>}
 */
async function adminDatabase() {
  const db = await loadDatabase();
  requireUser(db, 'admin');
  return db;
}

/**
 * Busca un establecimiento por id.
 * @param {MockDatabase} db Base de datos simulada.
 * @param {string} id Id del establecimiento.
 * @returns {Establishment}
 * @throws {ApiError} 404 si no existe.
 */
function findEstablishment(db, id) {
  const est = db.establishments.find((e) => e.id === id);
  if (!est) throw new ApiError('No encontramos ese establecimiento.', 404);
  return est;
}

/**
 * Establecimientos pendientes de aprobación, los más antiguos primero.
 * @returns {Promise<PendingEstablishment[]>}
 */
export async function listPending() {
  await delay();
  const db = await adminDatabase();
  return db.establishments
    .filter((e) => e.status === 'pending')
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
    .map((e) => ({
      id: e.id,
      name: e.name,
      ownerName: db.users.find((u) => u.id === e.ownerId)?.name ?? 'Desconocido',
      province: e.province,
      canton: e.canton,
      submittedAt: e.updatedAt,
    }));
}

/**
 * Aprueba y publica un establecimiento (SOP F-40).
 * @param {string} id Id del establecimiento.
 * @returns {Promise<void>}
 */
export async function approve(id) {
  await delay();
  const est = findEstablishment(await adminDatabase(), id);
  Object.assign(est, {
    status: 'approved',
    published: true,
    rejectionReason: null,
    updatedAt: nowIso(),
  });
  saveDatabase();
}

/**
 * Rechaza un establecimiento con un motivo.
 * @param {string} id Id del establecimiento.
 * @param {string} reason Motivo visible para el negocio.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el motivo está vacío.
 */
export async function reject(id, reason) {
  await delay();
  if (!reason.trim()) throw new ApiError('Escribe el motivo del rechazo.', 400);
  const est = findEstablishment(await adminDatabase(), id);
  Object.assign(est, { status: 'rejected', published: false, rejectionReason: reason.trim() });
  saveDatabase();
}

/**
 * Suspende o reactiva un establecimiento (SOP F-42).
 * @param {string} id Id del establecimiento.
 * @param {'approved' | 'suspended'} status Nuevo estado.
 * @returns {Promise<void>}
 */
export async function setStatus(id, status) {
  await delay();
  const est = findEstablishment(await adminDatabase(), id);
  est.status = status;
  if (status === 'suspended') est.published = false;
  saveDatabase();
}

/**
 * Todos los establecimientos, ordenados por nombre.
 * @returns {Promise<Establishment[]>}
 */
export async function listAllEstablishments() {
  await delay();
  const db = await adminDatabase();
  return clone([...db.establishments].sort((a, b) => a.name.localeCompare(b.name)));
}

/**
 * Reportes abiertos, más recientes primero, con el nombre del establecimiento y la reseña.
 * @returns {Promise<ReportWithContext[]>}
 */
export async function listOpenReports() {
  await delay();
  const db = await adminDatabase();
  return db.reports
    .filter((r) => r.status === 'open')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({
      ...clone(r),
      establishmentName: db.establishments.find((e) => e.id === r.establishmentId)?.name ?? '—',
      reviewComment: r.reviewId
        ? (db.reviews.find((v) => v.id === r.reviewId)?.comment ?? null)
        : null,
    }));
}

/**
 * Resuelve un reporte. Si la acción es ocultar, oculta la reseña y recalcula la calificación.
 * @param {string} reportId Id del reporte.
 * @param {ReportAction} action Acción tomada.
 * @returns {Promise<void>}
 * @throws {ApiError} 404 si el reporte no existe.
 */
export async function resolveReport(reportId, action) {
  await delay();
  const db = await adminDatabase();
  const report = db.reports.find((r) => r.id === reportId);
  if (!report) throw new ApiError('No encontramos ese reporte.', 404);

  if (action === 'hide-review' && report.reviewId) {
    const review = db.reviews.find((v) => v.id === report.reviewId);
    if (review) {
      review.hidden = true;
      recalculateRating(db, review.establishmentId);
    }
  }

  report.status = 'resolved';
  report.resolution = RESOLUTION_TEXT[action];
  saveDatabase();
}

/**
 * Catálogo completo de servicios, incluidos los inactivos.
 * @returns {Promise<Amenity[]>}
 */
export async function listAmenities() {
  await delay();
  return clone((await adminDatabase()).amenities);
}

/**
 * Crea o edita un servicio del catálogo (SOP F-43).
 * @param {Partial<Amenity> & Omit<Amenity, 'id'>} amenity Servicio; con id se edita.
 * @returns {Promise<Amenity>}
 * @throws {ApiError} 400 si el nombre está vacío.
 */
export async function saveAmenity(amenity) {
  await delay();
  if (!amenity.name.trim()) throw new ApiError('El nombre del servicio es obligatorio.', 400);
  const db = await adminDatabase();
  let saved = amenity.id ? db.amenities.find((a) => a.id === amenity.id) : undefined;
  if (saved) {
    Object.assign(saved, amenity, { name: amenity.name.trim() });
  } else {
    saved = { ...amenity, id: createId('am'), name: amenity.name.trim() };
    db.amenities.push(saved);
  }
  saveDatabase();
  return clone(saved);
}

/**
 * Agrupa búsquedas por término y las ordena de más a menos frecuentes.
 * @param {MockDatabase['searches']} searches Búsquedas registradas.
 * @param {number} limit Máximo de resultados.
 * @returns {{ term: string, count: number }[]}
 */
function topTerms(searches, limit) {
  const counts = new Map();
  searches.forEach((s) => counts.set(s.term, (counts.get(s.term) ?? 0) + 1));
  return [...counts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Métricas generales de la plataforma (SOP F-44).
 * @returns {Promise<PlatformMetrics>}
 */
export async function getMetrics() {
  await delay();
  const db = await adminDatabase();
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return {
    activeEstablishments: db.establishments.filter((e) => e.status === 'approved' && e.published)
      .length,
    pendingEstablishments: db.establishments.filter((e) => e.status === 'pending').length,
    totalViewsLast30Days: db.events.filter((e) => e.type === 'view' && Date.parse(e.at) >= since)
      .length,
    topSearches: topTerms(db.searches, 8),
    searchesWithoutResults: topTerms(
      db.searches.filter((s) => s.results === 0),
      8,
    ),
  };
}
