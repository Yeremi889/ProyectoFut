/**
 * Lógica del horario de atención (SOP F-05, F-26 y regla 4).
 * Regla: un cierre después de medianoche cuenta para el día en que abrió.
 */

import { getZonedMoment, previousDay, timeToMinutes } from './time';

/** @typedef {import('@/types/domain').DayOfWeek} DayOfWeek */
/** @typedef {import('@/types/domain').DaySchedule} DaySchedule */
/** @typedef {import('./time').ZonedMoment} ZonedMoment */

const MINUTES_PER_DAY = 24 * 60;

/**
 * Busca el horario de un día.
 * @param {DaySchedule[]} schedule Horario semanal del establecimiento.
 * @param {DayOfWeek} day Día buscado.
 * @returns {DaySchedule | undefined} El horario de ese día, o undefined si no está definido (se trata como cerrado).
 */
export function getDaySchedule(schedule, day) {
  return schedule.find((d) => d.day === day);
}

/**
 * Indica si un horario de un día pasa de la medianoche (por ejemplo, de 16:00 a 01:00).
 * @param {DaySchedule} daySchedule Horario de un día.
 * @returns {boolean} true si el cierre es al día siguiente.
 */
export function closesAfterMidnight(daySchedule) {
  return timeToMinutes(daySchedule.close) <= timeToMinutes(daySchedule.open);
}

/**
 * Indica si el establecimiento está abierto en un momento dado.
 * Considera los horarios que pasan de medianoche del día anterior.
 * @param {DaySchedule[]} schedule Horario semanal.
 * @param {ZonedMoment} moment Día y minutos en la hora local de la plataforma.
 * @returns {boolean} true si está abierto.
 */
export function isOpenAt(schedule, moment) {
  const today = getDaySchedule(schedule, moment.day);
  if (today && !today.closed) {
    const open = timeToMinutes(today.open);
    const close = timeToMinutes(today.close);
    const end = closesAfterMidnight(today) ? MINUTES_PER_DAY : close;
    if (moment.minutes >= open && moment.minutes < end) return true;
  }

  const yesterday = getDaySchedule(schedule, previousDay(moment.day));
  if (yesterday && !yesterday.closed && closesAfterMidnight(yesterday)) {
    if (moment.minutes < timeToMinutes(yesterday.close)) return true;
  }

  return false;
}

/**
 * Indica si el establecimiento está abierto ahora mismo (hora de Costa Rica).
 * @param {DaySchedule[]} schedule Horario semanal.
 * @param now Fecha de referencia (se puede inyectar en pruebas).
 * @returns {string[]} true si está abierto.
 */
export function isOpenNow(schedule, now = new Date()) {
  return isOpenAt(schedule, getZonedMoment(now));
}

/**
 * Valida un horario semanal: cada día abierto debe tener horas distintas.
 * @param schedule Horario semanal.
 * @returns Lista de mensajes de error (vacía si es válido).
 */
export function validateSchedule(schedule) {
  const errors = [];
  if (schedule.every((d) => d.closed)) errors.push('Debe haber al menos un día abierto.');
  for (const d of schedule) {
    if (!d.closed && d.open === d.close) {
      errors.push('La hora de apertura y la de cierre no pueden ser iguales.');
      break;
    }
  }
  return errors;
}
