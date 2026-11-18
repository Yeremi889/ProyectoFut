/** Utilidades internas del mock. No se usan fuera de src/services/mock. */
import { getFromPrice } from '@/utils/pricing';
import { ApiError } from '../ApiError';
import { getToken } from '../tokenStorage';

/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('@/types/domain').EstablishmentSummary} EstablishmentSummary */
/** @typedef {import('@/types/domain').UserRole} UserRole */
/** @typedef {import('./database').MockDatabase} MockDatabase */
/** @typedef {import('./database').MockUser} MockUser */

/** Retardo simulado de red, para que los estados de carga se vean como con un servidor real. */
const SIMULATED_LATENCY_MS = 250;

/**
 * Espera un tiempo para simular la latencia de red.
 * @param {number} [ms] Milisegundos.
 * @returns {Promise<void>}
 */
export function delay(ms = SIMULATED_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Genera un id aleatorio con prefijo, por ejemplo "est_k3j9x2a1".
 * @param {string} prefix Prefijo del tipo de entidad.
 * @returns {string} Id nuevo.
 */
export function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Fecha y hora actual en formato ISO.
 * @returns {string}
 */
export function nowIso() {
  return new Date().toISOString();
}

/**
 * Copia profunda, para que las pantallas nunca modifiquen la "base de datos" por referencia.
 * @template T
 * @param {T} value Valor a copiar.
 * @returns {T} Copia independiente.
 */
export function clone(value) {
  return structuredClone(value);
}

/**
 * Calcula el hash SHA-256 de una contraseña. Solo simula lo que hará el servidor real.
 * @param {string} password Contraseña en texto plano.
 * @returns {Promise<string>} Hash en hexadecimal.
 */
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Devuelve el usuario de la sesión actual y verifica su rol.
 * En el mock el token es simplemente el id del usuario.
 * @param {MockDatabase} db Base de datos simulada.
 * @param {UserRole} [role] Rol requerido (si se omite, cualquier usuario sirve).
 * @returns {MockUser} Usuario actual.
 * @throws {ApiError} 401 sin sesión, 403 si el rol no coincide.
 */
export function requireUser(db, role) {
  const user = db.users.find((u) => u.id === getToken());
  if (!user) throw new ApiError('Debes iniciar sesión para continuar.', 401);
  if (role && user.role !== role) throw new ApiError('No tienes permiso para hacer esto.', 403);
  return user;
}

/**
 * Busca un establecimiento que pertenezca al negocio actual.
 * @param {MockDatabase} db Base de datos simulada.
 * @param {string} id Id del establecimiento.
 * @returns {Establishment} Establecimiento (la referencia real, para modificarlo).
 * @throws {ApiError} 401/403 sin permiso, 404 si no existe o es de otro negocio.
 */
export function requireOwnEstablishment(db, id) {
  const user = requireUser(db, 'business');
  const est = db.establishments.find((e) => e.id === id && e.ownerId === user.id);
  if (!est) throw new ApiError('No encontramos ese establecimiento.', 404);
  return est;
}

/**
 * Convierte un establecimiento completo en el resumen que usan las tarjetas.
 * @param {Establishment} e Establecimiento.
 * @returns {EstablishmentSummary}
 */
export function toSummary(e) {
  const cover = e.photos.find((p) => p.isCover) ?? e.photos[0];
  return {
    id: e.id,
    slug: e.slug,
    name: e.name,
    province: e.province,
    canton: e.canton,
    coverUrl: cover?.url ?? null,
    fromPrice: getFromPrice(e.courts),
    ratingAverage: e.ratingAverage,
    ratingCount: e.ratingCount,
    courtTypes: [...new Set(e.courts.map((c) => c.type))],
    hasRoofedCourt: e.courts.some((c) => c.roofed),
    schedule: e.schedule,
    location: e.location,
  };
}

/**
 * Indica si un establecimiento es visible para el público.
 * @param {Establishment} e Establecimiento.
 * @returns {boolean}
 */
export function isPublic(e) {
  return e.status === 'approved' && e.published;
}

/**
 * Recalcula el promedio y la cantidad de reseñas visibles de un establecimiento.
 * @param {MockDatabase} db Base de datos simulada.
 * @param {string} establishmentId Id del establecimiento.
 * @returns {void}
 */
export function recalculateRating(db, establishmentId) {
  const est = db.establishments.find((e) => e.id === establishmentId);
  if (!est) return;
  const visible = db.reviews.filter((r) => r.establishmentId === establishmentId && !r.hidden);
  est.ratingCount = visible.length;
  est.ratingAverage = visible.length
    ? visible.reduce((sum, r) => sum + r.rating, 0) / visible.length
    : 0;
}
