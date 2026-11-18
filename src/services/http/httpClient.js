/**
 * Cliente HTTP base. Agrega el token de sesión, convierte JSON y normaliza errores.
 * Todos los módulos de src/services/http usan esta función.
 */
import { API_BASE_URL } from '@/config/env';
import { ApiError, DEFAULT_ERROR_MESSAGES } from '../ApiError';
import { clearToken, getToken } from '../tokenStorage';

/**
 * Opciones de una petición.
 * @typedef {object} RequestOptions
 * @property {'GET' | 'POST' | 'PUT' | 'DELETE'} [method] Método HTTP (por defecto GET).
 * @property {object | FormData} [body] Cuerpo: un objeto se envía como JSON; FormData como multipart.
 * @property {Record<string, string | number | boolean | undefined>} [query] Parámetros de la URL.
 */

/**
 * Construye la URL completa con parámetros de búsqueda, omitiendo los vacíos.
 * @param {string} path Ruta relativa, por ejemplo "/establishments".
 * @param {RequestOptions['query']} [query] Parámetros.
 * @returns {string} URL absoluta.
 */
function buildUrl(path, query) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });
  return url.toString();
}

/**
 * Envía una petición al servidor.
 * @template T
 * @param {string} path Ruta relativa a API_BASE_URL.
 * @param {RequestOptions} [options] Método, cuerpo y parámetros.
 * @returns {Promise<T>} Cuerpo de la respuesta ya convertido de JSON (undefined si es 204).
 * @throws {ApiError} Si el servidor responde con error o no hay conexión.
 */
export async function request(path, { method = 'GET', body, query } = {}) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError(DEFAULT_ERROR_MESSAGES[0], 0);
  }

  if (response.status === 401) clearToken();

  if (!response.ok) {
    const fallback = DEFAULT_ERROR_MESSAGES[response.status] ?? DEFAULT_ERROR_MESSAGES[500];
    const data = await response.json().catch(() => null);
    throw new ApiError(data?.message ?? fallback, response.status);
  }

  return response.status === 204 ? undefined : response.json();
}
