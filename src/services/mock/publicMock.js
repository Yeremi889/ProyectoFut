/**
 * Funciones públicas y de jugador simuladas: catálogo, búsqueda, detalle,
 * eventos de estadística, reseñas, favoritos y reportes.
 */
import { distanceKm } from '@/utils/geo';
import { slugify } from '@/utils/slug';
import { ApiError } from '../ApiError';
import { loadDatabase, saveDatabase } from './database';
import {
  clone,
  createId,
  delay,
  isPublic,
  nowIso,
  recalculateRating,
  requireUser,
  toSummary,
} from './helpers';

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
export async function listAmenities() {
  const db = await loadDatabase();
  return clone(db.amenities.filter((a) => a.active));
}

/**
 * Indica si un establecimiento coincide con el texto buscado (nombre, provincia o cantón).
 * La comparación ignora mayúsculas y tildes.
 * @param {Establishment} e Establecimiento.
 * @param {string} query Texto buscado.
 * @returns {boolean}
 */
function matchesQuery(e, query) {
  const needle = slugify(query);
  if (!needle) return true;
  return [e.name, e.province, e.canton].some((field) => slugify(field).includes(needle));
}

/**
 * Ordena resúmenes según el criterio elegido. No modifica el arreglo original.
 * @param {EstablishmentSummary[]} items Resúmenes.
 * @param {SearchFilters} filters Criterio y ubicación.
 * @returns {EstablishmentSummary[]}
 */
function sortSummaries(items, filters) {
  const list = [...items];
  if (filters.sortBy === 'rating') {
    return list.sort((a, b) => b.ratingAverage - a.ratingAverage || b.ratingCount - a.ratingCount);
  }
  if (filters.sortBy === 'distance' && filters.near) {
    list.forEach((s) => {
      s.distanceKm = s.location ? distanceKm(filters.near, s.location) : null;
    });
    return list.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }
  return list.sort((a, b) => (a.fromPrice ?? Infinity) - (b.fromPrice ?? Infinity));
}

/**
 * Busca establecimientos públicos y registra el término para las métricas del administrador.
 * @param {SearchFilters} filters Filtros y orden.
 * @returns {Promise<EstablishmentSummary[]>}
 */
export async function searchEstablishments(filters) {
  await delay();
  const db = await loadDatabase();
  const query = filters.query?.trim() ?? '';
  const types = filters.courtTypes ?? [];

  const results = db.establishments
    .filter(isPublic)
    .filter((e) => matchesQuery(e, query))
    .filter((e) => types.length === 0 || e.courts.some((c) => types.includes(c.type)))
    .filter((e) => !filters.roofedOnly || e.courts.some((c) => c.roofed))
    .map(toSummary);

  if (query) {
    db.searches.push({
      term: slugify(query).replace(/-/g, ' '),
      results: results.length,
      at: nowIso(),
    });
    saveDatabase();
  }

  return clone(sortSummaries(results, filters));
}

/**
 * Obtiene el detalle público de un establecimiento.
 * @param {string} slug Identificador legible.
 * @returns {Promise<Establishment>}
 * @throws {ApiError} 404 si no existe o no es público.
 */
export async function getEstablishmentBySlug(slug) {
  await delay();
  const db = await loadDatabase();
  const est = db.establishments.find((e) => e.slug === slug && isPublic(e));
  if (!est) throw new ApiError('Este establecimiento no existe o ya no está disponible.', 404);
  return clone(est);
}

/**
 * Registra un evento de estadística. Nunca lanza error.
 * @param {string} establishmentId Id del establecimiento.
 * @param {StatEventType} type Tipo de evento.
 * @returns {Promise<void>}
 */
export async function trackEvent(establishmentId, type) {
  const db = await loadDatabase();
  db.events.push({ establishmentId, type, at: nowIso() });
  saveDatabase();
}

/**
 * Lista las reseñas visibles de un establecimiento, más recientes primero.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {Promise<Review[]>}
 */
export async function listReviews(establishmentId) {
  await delay();
  const db = await loadDatabase();
  return clone(
    db.reviews
      .filter((r) => r.establishmentId === establishmentId && !r.hidden)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
}

/**
 * Crea o reemplaza la reseña del jugador actual (SOP regla 5: una por establecimiento).
 * @param {string} establishmentId Id del establecimiento.
 * @param {ReviewInput} input Estrellas y comentario.
 * @returns {Promise<Review>}
 * @throws {ApiError} 401 sin sesión, 403 si no es jugador, 400 si la calificación no es válida.
 */
export async function upsertReview(establishmentId, input) {
  await delay();
  const db = await loadDatabase();
  const user = requireUser(db, 'player');
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new ApiError('La calificación debe ser de 1 a 5 estrellas.', 400);
  }

  let review = db.reviews.find(
    (r) => r.establishmentId === establishmentId && r.userId === user.id,
  );
  if (review) {
    Object.assign(review, {
      rating: input.rating,
      comment: input.comment.trim(),
      updatedAt: nowIso(),
    });
  } else {
    review = {
      id: createId('rev'),
      establishmentId,
      userId: user.id,
      userName: user.name,
      rating: input.rating,
      comment: input.comment.trim(),
      reply: null,
      hidden: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.reviews.push(review);
  }

  recalculateRating(db, establishmentId);
  saveDatabase();
  return clone(review);
}

/**
 * Lista los favoritos públicos del jugador actual.
 * @returns {Promise<EstablishmentSummary[]>}
 */
export async function listFavorites() {
  await delay();
  const db = await loadDatabase();
  const user = requireUser(db, 'player');
  const ids = db.favorites.filter((f) => f.userId === user.id).map((f) => f.establishmentId);
  return clone(db.establishments.filter((e) => ids.includes(e.id) && isPublic(e)).map(toSummary));
}

/**
 * Agrega un favorito. No hace nada si ya existe.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {Promise<void>}
 */
export async function addFavorite(establishmentId) {
  const db = await loadDatabase();
  const user = requireUser(db, 'player');
  if (db.favorites.some((f) => f.userId === user.id && f.establishmentId === establishmentId))
    return;
  db.favorites.push({ userId: user.id, establishmentId, createdAt: nowIso() });
  db.events.push({ establishmentId, type: 'favorite', at: nowIso() });
  saveDatabase();
}

/**
 * Quita un favorito.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {Promise<void>}
 */
export async function removeFavorite(establishmentId) {
  const db = await loadDatabase();
  const user = requireUser(db, 'player');
  db.favorites = db.favorites.filter(
    (f) => !(f.userId === user.id && f.establishmentId === establishmentId),
  );
  saveDatabase();
}

/**
 * Crea un reporte (no requiere sesión). Llega a la bandeja del administrador.
 * @param {ReportInput} input Datos del reporte.
 * @returns {Promise<void>}
 */
export async function createReport(input) {
  await delay();
  const db = await loadDatabase();
  db.reports.push({
    id: createId('rep'),
    kind: input.reviewId ? 'review' : 'info',
    establishmentId: input.establishmentId,
    reviewId: input.reviewId ?? null,
    reason: input.reason,
    comment: input.comment?.trim() ?? '',
    status: 'open',
    resolution: null,
    createdAt: nowIso(),
  });
  saveDatabase();
}
