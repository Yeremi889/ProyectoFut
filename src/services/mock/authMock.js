/** Autenticación simulada. En el mock el token de sesión es el id del usuario. */
import { ApiError } from '../ApiError';
import { getToken, setToken } from '../tokenStorage';
import { loadDatabase, saveDatabase } from './database';
import { clone, createId, delay, hashPassword, nowIso } from './helpers';

/** @typedef {import('@/types/api').RegisterInput} RegisterInput */
/** @typedef {import('@/types/domain').User} User */
/** @typedef {import('./database').MockUser} MockUser */

/**
 * Quita el hash de la contraseña antes de devolver un usuario.
 * @param {MockUser} user Usuario guardado.
 * @returns {User} Usuario público.
 */
function toPublicUser({ passwordHash: _omit, ...user }) {
  return clone(user);
}

/**
 * Crea una cuenta e inicia sesión.
 * @param {RegisterInput} input Datos de la cuenta.
 * @returns {Promise<User>} Usuario creado.
 * @throws {ApiError} 409 si el correo ya está registrado.
 */
export async function register(input) {
  await delay();
  const db = await loadDatabase();
  const email = input.email.trim().toLowerCase();
  if (db.users.some((u) => u.email === email)) {
    throw new ApiError('Ya existe una cuenta con ese correo.', 409);
  }

  /** @type {MockUser} */
  const user = {
    id: createId('usr'),
    name: input.name.trim(),
    email,
    role: input.role,
    passwordHash: await hashPassword(input.password),
    createdAt: nowIso(),
  };
  db.users.push(user);
  saveDatabase();
  setToken(user.id);
  return toPublicUser(user);
}

/**
 * Inicia sesión.
 * @param {string} email Correo.
 * @param {string} password Contraseña.
 * @returns {Promise<User>} Usuario autenticado.
 * @throws {ApiError} 401 si las credenciales no coinciden.
 */
export async function login(email, password) {
  await delay();
  const db = await loadDatabase();
  const hash = await hashPassword(password);
  const user = db.users.find(
    (u) => u.email === email.trim().toLowerCase() && u.passwordHash === hash,
  );
  if (!user) throw new ApiError('Correo o contraseña incorrectos.', 401);
  setToken(user.id);
  return toPublicUser(user);
}

/**
 * Obtiene el usuario de la sesión actual.
 * @returns {Promise<User | null>}
 */
export async function getCurrentUser() {
  const db = await loadDatabase();
  const user = db.users.find((u) => u.id === getToken());
  return user ? toPublicUser(user) : null;
}

/**
 * Simula el envío del correo de recuperación. Siempre responde bien,
 * para no revelar qué correos están registrados.
 * @param {string} _email Correo de la cuenta.
 * @returns {Promise<void>}
 */
export async function requestPasswordReset(_email) {
  await delay();
}
