/** Panel del negocio simulado. Todas las funciones exigen sesión con rol "business". */
import { MAX_PHOTOS_PER_ESTABLISHMENT, PHOTO_MAX_WIDTH_PX } from '@/constants/app';
import { DEFAULT_NIGHT_RATE_START, DEFAULT_SCHEDULE } from '@/constants/catalogs';
import { resizeImageToDataUrl } from '@/utils/image';
import { uniqueSlug } from '@/utils/slug';
import { ApiError } from '../ApiError';
import { loadDatabase, saveDatabase } from './database';
import { clone, createId, delay, nowIso, requireOwnEstablishment, requireUser } from './helpers';

/** @typedef {import('@/types/api').EstablishmentInput} EstablishmentInput */
/** @typedef {import('@/types/api').CourtInput} CourtInput */
/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('@/types/domain').Court} Court */
/** @typedef {import('@/types/domain').MonthlyStats} MonthlyStats */
/** @typedef {import('@/types/domain').Review} Review */

/** Campos que el negocio puede cambiar con update(). */
const EDITABLE_FIELDS = [
  'name',
  'description',
  'province',
  'canton',
  'address',
  'location',
  'phone',
  'whatsapp',
  'nightRateStartsAt',
  'schedule',
  'amenityIds',
];

/**
 * Marca un establecimiento como modificado y guarda la base.
 * @param {Establishment} est Establecimiento modificado.
 * @returns {Establishment} Copia para devolver a la pantalla.
 */
function touchAndSave(est) {
  est.updatedAt = nowIso();
  saveDatabase();
  return clone(est);
}

/**
 * Lista las sucursales del negocio actual, más recientes primero.
 * @returns {Promise<Establishment[]>}
 */
export async function listMine() {
  await delay();
  const db = await loadDatabase();
  const user = requireUser(db, 'business');
  return clone(
    db.establishments
      .filter((e) => e.ownerId === user.id)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
}

/**
 * Obtiene un establecimiento propio.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<Establishment>}
 */
export async function getMine(id) {
  await delay();
  return clone(requireOwnEstablishment(await loadDatabase(), id));
}

/**
 * Crea un establecimiento en borrador con valores iniciales.
 * @param {string} name Nombre del establecimiento.
 * @returns {Promise<Establishment>}
 */
export async function createDraft(name) {
  await delay();
  const db = await loadDatabase();
  const user = requireUser(db, 'business');
  const taken = new Set(db.establishments.map((e) => e.slug));

  /** @type {Establishment} */
  const est = {
    id: createId('est'),
    ownerId: user.id,
    slug: uniqueSlug(name, taken),
    name: name.trim(),
    description: '',
    province: '',
    canton: '',
    address: '',
    location: null,
    phone: '',
    whatsapp: '',
    nightRateStartsAt: DEFAULT_NIGHT_RATE_START,
    schedule: clone(DEFAULT_SCHEDULE),
    courts: [],
    photos: [],
    amenityIds: [],
    status: 'draft',
    rejectionReason: null,
    published: false,
    ratingAverage: 0,
    ratingCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  db.establishments.push(est);
  saveDatabase();
  return clone(est);
}

/**
 * Actualiza campos editables. Ignora cualquier otro campo (estado, dueño, calificación...).
 * @param {string} id Id del establecimiento.
 * @param {EstablishmentInput} input Campos a cambiar.
 * @returns {Promise<Establishment>}
 */
export async function update(id, input) {
  await delay();
  const est = requireOwnEstablishment(await loadDatabase(), id);
  EDITABLE_FIELDS.forEach((field) => {
    if (field in input) est[field] = clone(input[field]);
  });
  return touchAndSave(est);
}

/**
 * Envía a revisión. Exige los datos mínimos para que el perfil sea útil.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<Establishment>}
 * @throws {ApiError} 400 si faltan datos obligatorios.
 */
export async function submitForReview(id) {
  await delay();
  const est = requireOwnEstablishment(await loadDatabase(), id);
  const missing = [];
  if (!est.province || !est.canton || !est.address) missing.push('la ubicación');
  if (est.courts.length === 0) missing.push('al menos una cancha');
  if (!est.whatsapp && !est.phone) missing.push('un teléfono o WhatsApp');
  if (missing.length)
    throw new ApiError(`Para enviar a revisión falta ${missing.join(', ')}.`, 400);

  est.status = 'pending';
  est.rejectionReason = null;
  return touchAndSave(est);
}

/**
 * Publica u oculta un establecimiento (SOP F-27). Solo aplica a aprobados.
 * @param {string} id Id del establecimiento.
 * @param {boolean} published true para publicar.
 * @returns {Promise<Establishment>}
 * @throws {ApiError} 400 si no está aprobado.
 */
export async function setPublished(id, published) {
  await delay();
  const est = requireOwnEstablishment(await loadDatabase(), id);
  if (est.status !== 'approved') {
    throw new ApiError('Solo puedes publicar un establecimiento aprobado.', 400);
  }
  est.published = published;
  return touchAndSave(est);
}

/**
 * Agrega una cancha.
 * @param {string} id Id del establecimiento.
 * @param {CourtInput} input Datos de la cancha.
 * @returns {Promise<Court>}
 */
export async function addCourt(id, input) {
  await delay();
  const est = requireOwnEstablishment(await loadDatabase(), id);
  /** @type {Court} */
  const court = { id: createId('crt'), ...input };
  est.courts.push(court);
  touchAndSave(est);
  return clone(court);
}

/**
 * Edita una cancha.
 * @param {string} id Id del establecimiento.
 * @param {string} courtId Id de la cancha.
 * @param {CourtInput} input Datos nuevos.
 * @returns {Promise<Court>}
 * @throws {ApiError} 404 si la cancha no existe.
 */
export async function updateCourt(id, courtId, input) {
  await delay();
  const est = requireOwnEstablishment(await loadDatabase(), id);
  const court = est.courts.find((c) => c.id === courtId);
  if (!court) throw new ApiError('No encontramos esa cancha.', 404);
  Object.assign(court, input, { id: courtId });
  touchAndSave(est);
  return clone(court);
}

/**
 * Elimina una cancha.
 * @param {string} id Id del establecimiento.
 * @param {string} courtId Id de la cancha.
 * @returns {Promise<void>}
 */
export async function deleteCourt(id, courtId) {
  await delay();
  const est = requireOwnEstablishment(await loadDatabase(), id);
  est.courts = est.courts.filter((c) => c.id !== courtId);
  touchAndSave(est);
}

/**
 * Sube una foto: la reduce y la guarda como data URL (el servidor real guardará el archivo).
 * La primera foto queda como portada.
 * @param {string} id Id del establecimiento.
 * @param {File} file Imagen ya validada.
 * @returns {Promise<Establishment>}
 * @throws {ApiError} 400 si se alcanzó el máximo de fotos.
 */
export async function uploadPhoto(id, file) {
  const est = requireOwnEstablishment(await loadDatabase(), id);
  if (est.photos.length >= MAX_PHOTOS_PER_ESTABLISHMENT) {
    throw new ApiError(`Puedes subir hasta ${MAX_PHOTOS_PER_ESTABLISHMENT} fotos.`, 400);
  }
  const url = await resizeImageToDataUrl(file, PHOTO_MAX_WIDTH_PX);
  est.photos.push({ id: createId('ph'), url, isCover: est.photos.length === 0 });
  try {
    return touchAndSave(est);
  } catch (error) {
    est.photos.pop();
    throw new ApiError(error.message, 400);
  }
}

/**
 * Elimina una foto. Si era la portada, la siguiente pasa a serlo.
 * @param {string} id Id del establecimiento.
 * @param {string} photoId Id de la foto.
 * @returns {Promise<Establishment>}
 */
export async function deletePhoto(id, photoId) {
  await delay(100);
  const est = requireOwnEstablishment(await loadDatabase(), id);
  est.photos = est.photos.filter((p) => p.id !== photoId);
  if (est.photos.length && !est.photos.some((p) => p.isCover)) est.photos[0].isCover = true;
  return touchAndSave(est);
}

/**
 * Marca una foto como portada.
 * @param {string} id Id del establecimiento.
 * @param {string} photoId Id de la foto.
 * @returns {Promise<Establishment>}
 */
export async function setCoverPhoto(id, photoId) {
  await delay(100);
  const est = requireOwnEstablishment(await loadDatabase(), id);
  est.photos.forEach((p) => {
    p.isCover = p.id === photoId;
  });
  return touchAndSave(est);
}

/**
 * Mueve una foto una posición en la galería.
 * @param {string} id Id del establecimiento.
 * @param {string} photoId Id de la foto.
 * @param {-1 | 1} direction -1 hacia adelante, 1 hacia atrás.
 * @returns {Promise<Establishment>}
 */
export async function movePhoto(id, photoId, direction) {
  await delay(100);
  const est = requireOwnEstablishment(await loadDatabase(), id);
  const from = est.photos.findIndex((p) => p.id === photoId);
  const to = from + direction;
  if (from >= 0 && to >= 0 && to < est.photos.length) {
    [est.photos[from], est.photos[to]] = [est.photos[to], est.photos[from]];
  }
  return touchAndSave(est);
}

/**
 * Cuenta los eventos de los últimos 6 meses, agrupados por mes.
 * @param {string} id Id del establecimiento.
 * @returns {Promise<MonthlyStats[]>} Un elemento por mes, del más antiguo al actual.
 */
export async function getStats(id) {
  await delay();
  const db = await loadDatabase();
  requireOwnEstablishment(db, id);

  const now = new Date();
  /** @type {MonthlyStats[]} */
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { month, view: 0, whatsapp: 0, directions: 0, favorite: 0 };
  });

  db.events
    .filter((ev) => ev.establishmentId === id)
    .forEach((ev) => {
      const target = months.find((m) => ev.at.startsWith(m.month));
      if (target) target[ev.type] += 1;
    });

  return months;
}

/**
 * Lista todas las reseñas de un establecimiento propio (incluidas las ocultas).
 * @param {string} id Id del establecimiento.
 * @returns {Promise<Review[]>}
 */
export async function listReviews(id) {
  await delay();
  const db = await loadDatabase();
  requireOwnEstablishment(db, id);
  return clone(
    db.reviews
      .filter((r) => r.establishmentId === id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

/**
 * Guarda la respuesta pública del negocio a una reseña (una por reseña, editable).
 * @param {string} reviewId Id de la reseña.
 * @param {string} text Respuesta.
 * @returns {Promise<Review>}
 * @throws {ApiError} 404 si la reseña no existe o no es de un establecimiento propio.
 */
export async function replyToReview(reviewId, text) {
  await delay();
  const db = await loadDatabase();
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review) throw new ApiError('No encontramos esa reseña.', 404);
  requireOwnEstablishment(db, review.establishmentId);
  review.reply = { text: text.trim(), createdAt: nowIso() };
  saveDatabase();
  return clone(review);
}
