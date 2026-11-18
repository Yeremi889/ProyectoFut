/**
 * Error estándar de la capa de servicios.
 * Las pantallas muestran `message` al usuario y pueden revisar `status` para casos especiales.
 */
export class ApiError extends Error {
  /**
   * @param {string} message Mensaje legible para el usuario.
   * @param {number} [status] Código HTTP (400, 401, 404...). 0 si no hubo respuesta del servidor.
   */
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Mensajes por defecto según el código HTTP. */
export const DEFAULT_ERROR_MESSAGES = {
  0: 'No se pudo conectar con el servidor. Revisa tu conexión.',
  400: 'Los datos enviados no son válidos.',
  401: 'Tu sesión expiró. Inicia sesión de nuevo.',
  403: 'No tienes permiso para hacer esto.',
  404: 'No encontramos lo que buscabas.',
  409: 'Ya existe un registro con esos datos.',
  500: 'Ocurrió un error en el servidor. Intenta más tarde.',
};
