/** Cálculos geográficos para ordenar por cercanía (SOP F-04). */

/** @typedef {import('@/types/domain').GeoPoint} GeoPoint */

const EARTH_RADIUS_KM = 6371;

/**
 * Calcula la distancia en línea recta entre dos puntos (fórmula de Haversine).
 * @param {GeoPoint} a Primer punto.
 * @param {GeoPoint} b Segundo punto.
 * @returns {number} Distancia en kilómetros.
 */
export function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}
