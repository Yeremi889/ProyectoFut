/** Cálculo de la barra de "perfil completo" del negocio (SOP F-30). */

/** @typedef {import('@/types/domain').Establishment} Establishment */

/**
 * Un criterio que suma al porcentaje del perfil.
 * @typedef {object} CompletenessCheck
 * @property {string} label Sugerencia que se muestra si falta.
 * @property {(e: Establishment) => boolean} done Indica si el criterio se cumple.
 */

/**
 * Criterios evaluados, con la sugerencia que se muestra si faltan.
 * @type {CompletenessCheck[]}
 */
const CHECKS = [
  { label: 'Escribe una descripción', done: (e) => e.description.trim().length >= 40 },
  {
    label: 'Indica provincia, cantón y dirección',
    done: (e) => !!e.province && !!e.canton && !!e.address,
  },
  { label: 'Marca la ubicación en el mapa', done: (e) => e.location !== null },
  { label: 'Agrega al menos una cancha', done: (e) => e.courts.length > 0 },
  { label: 'Sube al menos tres fotos', done: (e) => e.photos.length >= 3 },
  { label: 'Marca los servicios que ofreces', done: (e) => e.amenityIds.length > 0 },
  { label: 'Agrega un número de WhatsApp', done: (e) => !!e.whatsapp },
];

/**
 * Resultado del cálculo.
 * @typedef {object} CompletenessResult
 * @property {number} percent Porcentaje entero de 0 a 100.
 * @property {string[]} missing Sugerencias de lo que falta.
 */

/**
 * Calcula qué tan completo está el perfil de un establecimiento.
 * @param {Establishment} establishment Establecimiento a evaluar.
 * @returns {CompletenessResult} Porcentaje y lista de lo que falta.
 */
export function computeCompleteness(establishment) {
  const missing = CHECKS.filter((c) => !c.done(establishment)).map((c) => c.label);
  const percent = Math.round(((CHECKS.length - missing.length) / CHECKS.length) * 100);
  return { percent, missing };
}
