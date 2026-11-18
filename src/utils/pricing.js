/** Lógica de precios (SOP regla 2 y 3). */

import { timeToMinutes } from './time';

/** @typedef {import('@/types/domain').Court} Court */

/**
 * Calcula el precio "desde" de un establecimiento: el menor precio diurno de sus canchas.
 * @param {Court[]} courts Canchas del establecimiento.
 * @returns {number | null} El menor precio diurno, o null si no tiene canchas.
 */
export function getFromPrice(courts) {
  if (courts.length === 0) return null;
  return Math.min(...courts.map((c) => c.dayPrice));
}

/**
 * Indica si una hora corresponde a la tarifa nocturna.
 * La tarifa nocturna va desde nightRateStartsAt hasta las 5:59 a. m.
 * @param {string} time Hora a evaluar ("HH:mm").
 * @param {string} nightRateStartsAt Hora en que empieza la tarifa nocturna.
 * @returns {boolean} true si aplica tarifa nocturna.
 */
export function isNightRate(time, nightRateStartsAt) {
  const minutes = timeToMinutes(time);
  const nightStart = timeToMinutes(nightRateStartsAt);
  const morningEnd = 6 * 60;
  return minutes >= nightStart || minutes < morningEnd;
}

/**
 * Devuelve el precio por hora de una cancha en una hora específica.
 * @param {Court} court Cancha.
 * @param {string} time Hora de juego ("HH:mm").
 * @param {string} nightRateStartsAt Hora en que empieza la tarifa nocturna del establecimiento.
 * @returns {number} Precio en colones.
 */
export function getPriceAt(court, time, nightRateStartsAt) {
  return isNightRate(time, nightRateStartsAt) ? court.nightPrice : court.dayPrice;
}
