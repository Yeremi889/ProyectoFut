/**
 * Lectura centralizada de variables de entorno (archivo .env, ver .env.example).
 * Ningún otro archivo debe leer import.meta.env directamente.
 */

/** true = datos simulados en el navegador; false = servidor real. */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK !== 'false';

/** URL base de la API del servidor, sin "/" final. */
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api').replace(
  /\/$/,
  '',
);

/** URL pública del sitio, usada en links propios y códigos QR. */
export const PUBLIC_SITE_URL = (
  import.meta.env.VITE_PUBLIC_SITE_URL ?? window.location.origin
).replace(/\/$/, '');
