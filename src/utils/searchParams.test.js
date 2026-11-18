import { describe, expect, it } from 'vitest';
import { filtersFromParams, filtersToParams } from './searchParams';

describe('filtros en la URL', () => {
  it('lee y descarta valores desconocidos', () => {
    const filters = filtersFromParams(new URLSearchParams('q=heredia&tipo=futbol5,raro&orden=xyz'));
    expect(filters).toEqual({
      query: 'heredia',
      courtTypes: ['futbol5'],
      roofedOnly: false,
      sortBy: 'price',
    });
  });

  it('ida y vuelta conserva los filtros', () => {
    const original = {
      query: 'liberia',
      courtTypes: ['futbol7'],
      roofedOnly: true,
      sortBy: 'rating',
    };
    expect(filtersFromParams(filtersToParams(original))).toEqual(original);
  });

  it('no escribe los valores por defecto', () => {
    expect(filtersToParams({ query: '', courtTypes: [], sortBy: 'price' }).toString()).toBe('');
  });
});
