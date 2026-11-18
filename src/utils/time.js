/** Utilidades de hora y fecha. Funciones puras salvo getZonedMoment sin argumentos, que lee el reloj. */
import { APP_TIME_ZONE } from '@/constants/app';

/** @typedef {import('@/types/domain').DayOfWeek} DayOfWeek */

/**
 * Momento expresado en la hora local de la plataforma.
 * @typedef {object} ZonedMoment
 * @property {DayOfWeek} day Día de la semana.
 * @property {number} minutes Minutos desde la medianoche (0 a 1439).
 */

/**
 * Convierte una hora "HH:mm" a minutos desde la medianoche.
 * @param {string} time Hora en formato 24 h, por ejemplo "18:30".
 * @returns {number} Minutos desde la medianoche (por ejemplo 1110).
 * @throws Error si el formato no es válido.
 */
export function timeToMinutes(time) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) throw new Error(`Hora inválida: "${time}"`);
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * Indica si un texto es una hora válida "HH:mm".
 * @param {string} time Texto a validar.
 * @returns {boolean} true si es válida.
 */
export function isValidTime(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

/**
 * Formatea "HH:mm" en formato de 12 horas para mostrar, por ejemplo "6:00 p. m.".
 * @param {string} time Hora en formato 24 h.
 * @returns {string} Hora legible en 12 h.
 */
export function formatTime12h(time) {
  const total = timeToMinutes(time);
  const hours24 = Math.floor(total / 60);
  const minutes = String(total % 60).padStart(2, '0');
  const suffix = hours24 < 12 ? 'a. m.' : 'p. m.';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes} ${suffix}`;
}

/**
 * Obtiene el día y la hora actuales en la zona horaria de la plataforma,
 * sin importar la zona horaria del dispositivo del usuario.
 * @param date Fecha a convertir (por defecto, ahora).
 * @returns {DayOfWeek} Día de la semana y minutos desde la medianoche.
 */
export function getZonedMoment(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = weekdays.indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/**
 * Devuelve el día anterior de la semana.
 * @param {DayOfWeek} day Día de la semana.
 * @returns El día anterior (domingo antes de lunes, sábado antes de domingo).
 */
export function previousDay(day) {
  return (day + 6) % 7;
}
