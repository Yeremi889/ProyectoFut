import { useCallback, useState } from 'react';

/**
 * Maneja el estado de guardado de una sección de formulario (guardando, error, guardado).
 *
 * @template T
 * @param {() => Promise<T>} save Función que guarda y devuelve el resultado.
 * @param {(result: T) => void} [onSaved] Se llama con el resultado si salió bien.
 * @returns {{ submit: () => Promise<boolean>, saving: boolean, error: string | null, saved: boolean, reset: () => void }}
 *   `submit` devuelve true si se guardó.
 */
export function useSectionSave(save, onSaved) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const submit = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const result = await save();
      setSaved(true);
      onSaved?.(result);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [save, onSaved]);

  const reset = useCallback(() => setSaved(false), []);

  return { submit, saving, error, saved, reset };
}
