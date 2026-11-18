import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Estado de una carga asíncrona.
 * @template T
 * @typedef {object} AsyncState
 * @property {T | undefined} data Datos cargados (undefined mientras carga la primera vez).
 * @property {boolean} loading true mientras se espera la respuesta.
 * @property {string | null} error Mensaje de error, o null si salió bien.
 * @property {() => Promise<void>} reload Vuelve a ejecutar la carga.
 * @property {(data: T) => void} setData Reemplaza los datos localmente (tras guardar, por ejemplo).
 */

/**
 * Ejecuta una función asíncrona al montar el componente y cada vez que cambian sus dependencias.
 * Evita actualizar el estado si el componente ya se desmontó o si llegó una respuesta vieja.
 *
 * @template T
 * @param {() => Promise<T>} loader Función que obtiene los datos (normalmente una llamada a `api`).
 * @param {unknown[]} deps Dependencias que disparan una nueva carga.
 * @returns {AsyncState<T>}
 */
export function useAsync(loader, deps) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await run();
      if (id === requestId.current) setData(result);
    } catch (err) {
      if (id === requestId.current) setError(err.message ?? 'Ocurrió un error inesperado.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    reload();
    return () => {
      requestId.current += 1;
    };
  }, [reload]);

  return { data, loading, error, reload, setData };
}
