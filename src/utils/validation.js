/**
 * Validaciones de formularios. Cada función devuelve un mensaje de error o null si el valor es válido,
 * para poder mostrar el mensaje directamente debajo del campo.
 */
import { PASSWORD_MIN_LENGTH } from '@/constants/app';

/**
 * Resultado de una validación: mensaje de error o null si es válido.
 * @typedef {string | null} ValidationResult
 */

/**
 * Valida que un campo no esté vacío.
 * @param {string} value Valor del campo.
 * @param {string} label Nombre del campo para el mensaje.
 * @returns {string|null} Mensaje de error o null.
 */
export function validateRequired(value, label) {
  return value.trim() ? null : `${label} es obligatorio.`;
}

/**
 * Valida un correo electrónico.
 * @param {string} email Correo a validar.
 * @returns {string|null} Mensaje de error o null.
 */
export function validateEmail(email) {
  if (!email.trim()) return 'El correo es obligatorio.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? null : 'El correo no es válido.';
}

/**
 * Valida una contraseña: mínimo de caracteres, al menos una letra y un número.
 * @param {string} password Contraseña a validar.
 * @returns {string|null} Mensaje de error o null.
 */
export function validatePassword(password) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'La contraseña debe tener al menos una letra y un número.';
  }
  return null;
}

/**
 * Valida un teléfono de Costa Rica (8 dígitos, se permiten guiones y espacios).
 * @param {string} phone Teléfono a validar.
 * @returns {string|null} Mensaje de error o null.
 */
export function validatePhone(phone) {
  if (!phone.trim()) return 'El teléfono es obligatorio.';
  const digits = phone.replace(/\D/g, '');
  return digits.length === 8 || (digits.length === 11 && digits.startsWith('506'))
    ? null
    : 'Ingresa un número de 8 dígitos, por ejemplo 8888-1111.';
}

/**
 * Valida un precio en colones.
 * @param {number} value Precio.
 * @returns {string|null} Mensaje de error o null.
 */
export function validatePrice(value) {
  if (!Number.isFinite(value) || value <= 0) return 'El precio debe ser mayor que cero.';
  if (!Number.isInteger(value)) return 'El precio no lleva decimales.';
  return null;
}

/**
 * Indica si un objeto de errores no tiene ningún error.
 * @param {Record<string, string|null>} errors Objeto con un resultado de validación por campo.
 * @returns {boolean} true si todos los campos son válidos.
 */
export function hasNoErrors(errors) {
  return Object.values(errors).every((e) => e === null);
}
