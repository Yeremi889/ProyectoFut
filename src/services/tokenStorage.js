/**
 * Guarda y lee el token de sesión en el navegador.
 * Lo usan tanto el cliente HTTP como el mock, para que la sesión funcione igual en ambos.
 */

const TOKEN_KEY = 'proyectofut.token';

/**
 * Lee el token de sesión guardado.
 * @returns {string | null} El token, o null si no hay sesión.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Guarda el token de sesión.
 * @param {string} token Token entregado por el servidor al iniciar sesión.
 * @returns {void}
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Elimina el token de sesión (cerrar sesión).
 * @returns {void}
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
