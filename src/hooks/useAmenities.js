import { useEffect, useState } from 'react';
import { api } from '@/services';

/** Catálogo en memoria: se pide una sola vez por sesión del navegador. */
let cachedAmenities = null;

/**
 * Obtiene el catálogo de servicios activos (parqueo, duchas...).
 * @returns {{ amenities: import('@/types/domain').Amenity[], loading: boolean }}
 */
export function useAmenities() {
  const [amenities, setAmenities] = useState(cachedAmenities ?? []);
  const [loading, setLoading] = useState(!cachedAmenities);

  useEffect(() => {
    if (cachedAmenities) return;
    api.catalog
      .listAmenities()
      .then((list) => {
        cachedAmenities = list;
        setAmenities(list);
      })
      .finally(() => setLoading(false));
  }, []);

  return { amenities, loading };
}

/**
 * Borra el catálogo en memoria (después de que el administrador lo edita).
 * @returns {void}
 */
export function invalidateAmenitiesCache() {
  cachedAmenities = null;
}
