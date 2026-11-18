/**
 * "Base de datos" simulada guardada en localStorage del navegador.
 * Solo para desarrollo y demostraciones: se reemplaza por el servidor real con VITE_USE_MOCK=false.
 */
import { buildSeed } from './seed';

/** @typedef {import('@/types/domain').User} User */

/**
 * Usuario guardado en el mock (incluye el hash de la contraseña, que nunca sale del mock).
 * @typedef {User & { passwordHash: string }} MockUser
 */

/**
 * Estructura completa de la base simulada.
 * @typedef {object} MockDatabase
 * @property {MockUser[]} users
 * @property {import('@/types/domain').Establishment[]} establishments
 * @property {import('@/types/domain').Amenity[]} amenities
 * @property {import('@/types/domain').Review[]} reviews
 * @property {{ userId: string, establishmentId: string, createdAt: string }[]} favorites
 * @property {import('@/types/domain').Report[]} reports
 * @property {{ establishmentId: string, type: import('@/types/domain').StatEventType, at: string }[]} events
 * @property {{ term: string, results: number, at: string }[]} searches
 */

/** Clave en localStorage. Cambiar la versión fuerza a regenerar los datos de ejemplo. */
const STORAGE_KEY = 'proyectofut.mockdb.v1';

/** @type {MockDatabase | null} */
let cache = null;

/**
 * Carga la base simulada. La primera vez la crea con los datos de ejemplo.
 * @returns {Promise<MockDatabase>} La base (referencia en memoria; usar saveDatabase tras modificarla).
 */
export async function loadDatabase() {
  if (cache) return cache;
  const raw = localStorage.getItem(STORAGE_KEY);
  cache = raw ? JSON.parse(raw) : await buildSeed();
  if (!raw) saveDatabase();
  return cache;
}

/**
 * Guarda en localStorage los cambios hechos a la base en memoria.
 * @returns {void}
 * @throws {Error} Si el almacenamiento del navegador está lleno (por ejemplo, muchas fotos).
 */
export function saveDatabase() {
  if (!cache) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    throw new Error('El almacenamiento de prueba del navegador está lleno. Elimina algunas fotos.');
  }
}

/**
 * Borra todos los datos simulados y vuelve a los datos de ejemplo en la próxima carga.
 * @returns {void}
 */
export function resetDatabase() {
  cache = null;
  localStorage.removeItem(STORAGE_KEY);
}
