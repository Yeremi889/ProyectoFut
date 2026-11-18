import { beforeEach, describe, expect, it } from 'vitest';
import { httpApi } from './http';
import { mockApi, resetMockData } from './mock';
import { clearToken } from './tokenStorage';

/**
 * Devuelve la lista ordenada de "grupo.función" de una implementación de la API.
 * @param {object} api Implementación.
 * @returns {string[]}
 */
function shape(api) {
  return Object.entries(api)
    .flatMap(([group, fns]) => Object.keys(fns).map((fn) => `${group}.${fn}`))
    .sort();
}

describe('contrato de la API', () => {
  it('el mock y el cliente HTTP exponen exactamente las mismas funciones', () => {
    expect(shape(mockApi)).toEqual(shape(httpApi));
  });
});

describe('mock', () => {
  beforeEach(() => {
    localStorage.clear();
    resetMockData();
    clearToken();
  });

  it('solo muestra establecimientos aprobados y publicados', async () => {
    const results = await mockApi.establishments.search({});
    expect(results.map((r) => r.slug)).not.toContain('futbol-zona-puntarenas');
    expect(results.length).toBeGreaterThan(0);
  });

  it('filtra por chip de tipo de cancha y ordena por precio', async () => {
    const results = await mockApi.establishments.search({
      courtTypes: ['futbol11'],
      sortBy: 'price',
    });
    expect(results.every((r) => r.courtTypes.includes('futbol11'))).toBe(true);
  });

  it('permite una sola reseña por jugador y recalcula el promedio', async () => {
    await mockApi.auth.login('jugador@demo.cr', 'Demo1234');
    await mockApi.reviews.upsert('est_guarco', { rating: 5, comment: 'Primera' });
    await mockApi.reviews.upsert('est_guarco', { rating: 1, comment: 'Editada' });
    const reviews = await mockApi.reviews.list('est_guarco');
    expect(reviews.filter((r) => r.userName === 'Diego Rojas')).toHaveLength(1);
  });

  it('rechaza el inicio de sesión con contraseña incorrecta', async () => {
    await expect(mockApi.auth.login('jugador@demo.cr', 'mala')).rejects.toThrow();
  });

  it('un negocio no puede ver establecimientos de otro', async () => {
    await mockApi.auth.login('negocio@demo.cr', 'Demo1234');
    await expect(mockApi.business.getMine('est_golcenter')).rejects.toThrow();
  });
});
