/** Funciones de formato para mostrar datos al usuario. */
import { CURRENCY, LOCALE } from '@/constants/app';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

/**
 * Formatea un monto en colones, por ejemplo "₡18 000".
 * @param {number} amount Monto en colones.
 * @returns {string} Texto con símbolo de moneda.
 */
export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

/**
 * Formatea una fecha ISO como fecha corta, por ejemplo "12 nov 2026".
 * @param {string} iso Fecha en formato ISO 8601.
 * @returns {string} Fecha legible.
 */
export function formatDate(iso) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * Formatea un mes "YYYY-MM" como "nov 2026".
 * @param {string} month Mes en formato "YYYY-MM".
 * @returns {string} Mes legible.
 */
export function formatMonth(month) {
  const [year, m] = month.split('-').map(Number);
  return new Intl.DateTimeFormat(LOCALE, { month: 'short', year: 'numeric' }).format(
    new Date(year ?? 2000, (m ?? 1) - 1, 1),
  );
}

/**
 * Formatea un promedio de calificación con un decimal, por ejemplo "4,5".
 * @param {number} value Promedio de 0 a 5.
 * @returns {string} Texto con un decimal.
 */
export function formatRating(value) {
  return value.toLocaleString(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/**
 * Formatea una distancia en kilómetros, por ejemplo "2,4 km" o "800 m".
 * @param {number} km Distancia en kilómetros.
 * @returns {string} Texto legible.
 */
export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toLocaleString(LOCALE, { maximumFractionDigits: 1 })} km`;
}

/**
 * Devuelve la forma singular o plural según la cantidad.
 * @param {number} count Cantidad.
 * @param {string} singular Palabra en singular.
 * @param {string} plural Palabra en plural.
 * @returns {string} Texto "count palabra", por ejemplo "3 reseñas".
 */
export function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}
