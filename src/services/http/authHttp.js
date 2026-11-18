/** Autenticación contra el servidor real. Endpoints: docs/API.md, sección "Autenticación". */
import { request } from './httpClient';
import { getToken, setToken } from '../tokenStorage';

/** @typedef {import('@/types/api').AuthResponse} AuthResponse */
/** @typedef {import('@/types/api').RegisterInput} RegisterInput */
/** @typedef {import('@/types/domain').User} User */

/**
 * Crea una cuenta de jugador o de negocio e inicia sesión.
 * @param {RegisterInput} input Datos de la cuenta.
 * @returns {Promise<User>} Usuario creado.
 */
export async function register(input) {
  /** @type {AuthResponse} */
  const res = await request('/auth/register', { method: 'POST', body: input });
  setToken(res.token);
  return res.user;
}

/**
 * Inicia sesión con correo y contraseña.
 * @param {string} email Correo.
 * @param {string} password Contraseña.
 * @returns {Promise<User>} Usuario autenticado.
 */
export async function login(email, password) {
  /** @type {AuthResponse} */
  const res = await request('/auth/login', { method: 'POST', body: { email, password } });
  setToken(res.token);
  return res.user;
}

/**
 * Obtiene el usuario de la sesión actual.
 * @returns {Promise<User | null>} Usuario, o null si no hay sesión válida.
 */
export async function getCurrentUser() {
  if (!getToken()) return null;
  try {
    return await request('/auth/me');
  } catch {
    return null;
  }
}

/**
 * Solicita el correo de recuperación de contraseña.
 * @param {string} email Correo de la cuenta.
 * @returns {Promise<void>}
 */
export function requestPasswordReset(email) {
  return request('/auth/forgot-password', { method: 'POST', body: { email } });
}
