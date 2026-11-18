/** Construcción de links externos: WhatsApp, Waze, Google Maps y link propio (SOP F-07, F-08, F-28). */
import { COUNTRY_PHONE_CODE } from '@/constants/app';

/** @typedef {import('@/types/domain').GeoPoint} GeoPoint */

/**
 * Deja solo los dígitos de un teléfono y agrega el código de país si falta.
 * @param {string} phone Teléfono como lo escribió el negocio, por ejemplo "8888-1111".
 * @returns {string} Teléfono internacional sin símbolos, por ejemplo "50688881111".
 */
export function toInternationalPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 8 ? `${COUNTRY_PHONE_CODE}${digits}` : digits;
}

/**
 * Crea el link de WhatsApp con un mensaje inicial prellenado.
 * @param {string} phone Número de WhatsApp del negocio.
 * @param {string} message Mensaje inicial.
 * @returns {string} URL de wa.me.
 */
export function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${toInternationalPhone(phone)}?text=${encodeURIComponent(message)}`;
}

/**
 * Crea el mensaje inicial de WhatsApp para un establecimiento.
 * @param {string} establishmentName Nombre del establecimiento.
 * @param {string} appName Nombre de la plataforma.
 * @returns {string} Mensaje listo para enviar.
 */
export function buildWhatsAppMessage(establishmentName, appName) {
  return `Hola, vi ${establishmentName} en ${appName} y quisiera consultar por la disponibilidad de una cancha.`;
}

/**
 * Crea el link de navegación de Waze.
 * @param {GeoPoint | null} location Coordenadas del destino, o null para buscar por dirección.
 * @param {string} fallbackAddress Dirección usada si no hay coordenadas.
 * @returns {string} URL de Waze.
 */
export function buildWazeUrl(location, fallbackAddress) {
  if (location) return `https://waze.com/ul?ll=${location.lat},${location.lng}&navigate=yes`;
  return `https://waze.com/ul?q=${encodeURIComponent(fallbackAddress)}&navigate=yes`;
}

/**
 * Crea el link de direcciones de Google Maps.
 * @param {GeoPoint | null} location Coordenadas del destino, o null para buscar por dirección.
 * @param {string} fallbackAddress Dirección usada si no hay coordenadas.
 * @returns {string} URL de Google Maps.
 */
export function buildGoogleMapsUrl(location, fallbackAddress) {
  const destination = location ? `${location.lat},${location.lng}` : fallbackAddress;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * Crea el link propio (público) de un establecimiento.
 * @param {string} siteUrl URL base del sitio, sin "/" final.
 * @param {string} slug Identificador legible del establecimiento.
 * @returns {string} URL completa, por ejemplo "https://canchasya.cr/c/la-bombonera".
 */
export function buildPublicUrl(siteUrl, slug) {
  return `${siteUrl}/c/${slug}`;
}
