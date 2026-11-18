/**
 * Conversión entre los filtros de búsqueda y los parámetros de la URL.
 * Guardar los filtros en la URL permite compartir una búsqueda y usar el botón "atrás".
 */
import { COURT_TYPES, SORT_OPTION_LABELS } from '@/constants/catalogs';

/** @typedef {import('@/types/api').SearchFilters} SearchFilters */

/**
 * Lee los filtros desde la URL, descartando valores desconocidos.
 * @param {URLSearchParams} params Parámetros de la URL, por ejemplo "?q=heredia&tipo=futbol5".
 * @returns {SearchFilters}
 */
export function filtersFromParams(params) {
  const courtTypes = (params.get('tipo') ?? '').split(',').filter((t) => COURT_TYPES.includes(t));
  const sort = params.get('orden');
  return {
    query: params.get('q') ?? '',
    courtTypes,
    roofedOnly: params.get('techada') === '1',
    sortBy: sort && sort in SORT_OPTION_LABELS ? sort : 'price',
  };
}

/**
 * Convierte filtros en parámetros de URL, omitiendo los que tienen su valor por defecto.
 * @param {SearchFilters} filters Filtros.
 * @returns {URLSearchParams}
 */
export function filtersToParams(filters) {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.courtTypes?.length) params.set('tipo', filters.courtTypes.join(','));
  if (filters.roofedOnly) params.set('techada', '1');
  if (filters.sortBy && filters.sortBy !== 'price') params.set('orden', filters.sortBy);
  return params;
}
