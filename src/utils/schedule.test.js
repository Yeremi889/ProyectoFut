import { describe, expect, it } from 'vitest';

import { isOpenAt, isOpenNow, validateSchedule } from './schedule';
import { getZonedMoment } from './time';

/** Lunes a sábado de 15:00 a 23:00, domingo cerrado. */
const weekdays = [
  { day: 0, closed: true, open: '00:00', close: '00:00' },
  ...[1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    closed: false,
    open: '15:00',
    close: '23:00',
  })),
];

/** Viernes de 16:00 a 02:00 (cierra después de medianoche). */
const lateFriday = [{ day: 5, closed: false, open: '16:00', close: '02:00' }];

describe('isOpenAt', () => {
  it('está abierto dentro del horario', () => {
    expect(isOpenAt(weekdays, { day: 1, minutes: 18 * 60 })).toBe(true);
  });

  it('está cerrado antes de abrir y justo a la hora de cierre', () => {
    expect(isOpenAt(weekdays, { day: 1, minutes: 14 * 60 + 59 })).toBe(false);
    expect(isOpenAt(weekdays, { day: 1, minutes: 23 * 60 })).toBe(false);
  });

  it('está cerrado un día marcado como cerrado', () => {
    expect(isOpenAt(weekdays, { day: 0, minutes: 18 * 60 })).toBe(false);
  });

  it('cuenta la madrugada del sábado como parte del viernes', () => {
    expect(isOpenAt(lateFriday, { day: 5, minutes: 23 * 60 })).toBe(true);
    expect(isOpenAt(lateFriday, { day: 6, minutes: 60 })).toBe(true);
    expect(isOpenAt(lateFriday, { day: 6, minutes: 2 * 60 })).toBe(false);
  });
});

describe('getZonedMoment e isOpenNow', () => {
  it('convierte a la hora de Costa Rica (UTC-6)', () => {
    // Lunes 16 nov 2026, 00:30 UTC = domingo 15 nov, 18:30 en Costa Rica.
    const moment = getZonedMoment(new Date('2026-11-16T00:30:00Z'));
    expect(moment).toEqual({ day: 0, minutes: 18 * 60 + 30 });
  });

  it('usa la hora de Costa Rica para decidir si está abierto', () => {
    // Martes 17 nov 2026, 22:00 UTC = martes 16:00 en Costa Rica.
    expect(isOpenNow(weekdays, new Date('2026-11-17T22:00:00Z'))).toBe(true);
  });
});

describe('validateSchedule', () => {
  it('exige al menos un día abierto', () => {
    const allClosed = weekdays.map((d) => ({ ...d, closed: true }));
    expect(validateSchedule(allClosed)).toHaveLength(1);
  });

  it('acepta un horario normal', () => {
    expect(validateSchedule(weekdays)).toEqual([]);
  });
});
