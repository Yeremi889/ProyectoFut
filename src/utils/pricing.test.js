import { describe, expect, it } from 'vitest';

import { getFromPrice, getPriceAt, isNightRate } from './pricing';

const court = {
  id: 'c1',
  name: 'Cancha 1',
  type: 'futbol5',
  roofed: false,
  dayPrice: 15000,
  nightPrice: 20000,
};

describe('getFromPrice', () => {
  it('devuelve el menor precio diurno', () => {
    expect(getFromPrice([court, { ...court, id: 'c2', dayPrice: 12000 }])).toBe(12000);
  });

  it('devuelve null sin canchas', () => {
    expect(getFromPrice([])).toBeNull();
  });
});

describe('isNightRate y getPriceAt', () => {
  it('aplica tarifa diurna antes de la hora nocturna', () => {
    expect(isNightRate('17:59', '18:00')).toBe(false);
    expect(getPriceAt(court, '10:00', '18:00')).toBe(15000);
  });

  it('aplica tarifa nocturna desde la hora indicada y en la madrugada', () => {
    expect(isNightRate('18:00', '18:00')).toBe(true);
    expect(isNightRate('01:00', '18:00')).toBe(true);
    expect(getPriceAt(court, '20:00', '18:00')).toBe(20000);
  });
});
