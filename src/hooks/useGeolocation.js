import { useCallback, useState } from 'react';

/**
 * Pide la ubicación del usuario solo cuando él lo decide (SOP F-04: con permiso).
 *
 * @returns {{
 *   location: import('@/types/domain').GeoPoint | null,
 *   status: 'idle' | 'locating' | 'ready' | 'denied' | 'unavailable',
 *   request: () => Promise<import('@/types/domain').GeoPoint | null>
 * }} Ubicación, estado y función para pedirla.
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle');

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return Promise.resolve(null);
    }
    setStatus('locating');
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(point);
          setStatus('ready');
          resolve(point);
        },
        () => {
          setStatus('denied');
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      );
    });
  }, []);

  return { location, status, request };
}
