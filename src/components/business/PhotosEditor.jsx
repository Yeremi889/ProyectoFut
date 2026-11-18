import { ChevronLeft, ChevronRight, ImagePlus, Star, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTOS_PER_ESTABLISHMENT,
  MAX_PHOTO_SIZE_MB,
} from '@/constants/app';
import { useSectionSave } from '@/hooks/useSectionSave';
import { api } from '@/services';
import { validateImageFile } from '@/utils/image';
import { EditorForm } from './EditorForm';
import styles from './PhotosEditor.module.css';

/**
 * Paso 4 del asistente / pestaña "Fotos": subir, ordenar, elegir portada y eliminar (SOP F-25).
 * Cada cambio se guarda de inmediato; el botón final solo continúa.
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a editar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSaved Recibe el establecimiento actualizado.
 * @param {string} props.submitLabel Texto del botón final.
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional.
 * @returns {import('react').JSX.Element}
 */
export function PhotosEditor({ establishment, onSaved, submitLabel, secondaryAction }) {
  const [photos, setPhotos] = useState(establishment.photos);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const inputRef = useRef(null);
  const remaining = MAX_PHOTOS_PER_ESTABLISHMENT - photos.length;

  const { submit, saving, error } = useSectionSave(
    () => api.business.getMine(establishment.id),
    onSaved,
  );

  /**
   * Ejecuta una acción sobre las fotos y actualiza la lista con la respuesta.
   * @param {string | null} id Foto afectada (para mostrar su estado de carga).
   * @param {() => Promise<import('@/types/domain').Establishment>} action
   */
  const run = async (id, action) => {
    setBusyId(id);
    setActionError(null);
    try {
      const updated = await action();
      setPhotos(updated.photos);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  /**
   * Valida y sube las fotos elegidas, una por una, respetando el máximo.
   * @param {import('react').ChangeEvent<HTMLInputElement>} event
   */
  const handleFiles = async (event) => {
    const files = [...(event.target.files ?? [])].slice(0, remaining);
    event.target.value = '';
    const invalid = files.map(validateImageFile).find(Boolean);
    if (invalid) {
      setActionError(invalid);
      return;
    }
    setUploading(true);
    for (const file of files) {
      await run(null, () => api.business.uploadPhoto(establishment.id, file));
    }
    setUploading(false);
  };

  return (
    <EditorForm
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      submitLabel={submitLabel}
      saving={saving}
      error={error ?? actionError}
      secondaryAction={secondaryAction}
    >
      <div className={styles.uploader}>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_PHOTO_TYPES.join(',')}
          multiple
          className="visually-hidden"
          onChange={handleFiles}
          aria-label="Elegir fotos"
        />
        <Button
          variant="secondary"
          icon={ImagePlus}
          onClick={() => inputRef.current?.click()}
          loading={uploading}
          disabled={remaining <= 0}
        >
          Subir fotos
        </Button>
        <p className={styles.hint}>
          JPG, PNG o WebP de hasta {MAX_PHOTO_SIZE_MB} MB. Puedes subir {Math.max(remaining, 0)}{' '}
          más. La primera foto es la portada.
        </p>
      </div>

      {photos.length === 0 ? (
        <p className={styles.empty}>
          Las fotos de las canchas son lo primero que miran los jugadores. Sube al menos tres.
        </p>
      ) : (
        <ul className={styles.grid}>
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className={`${styles.photo} ${busyId === photo.id ? styles.busy : ''}`}
            >
              <img src={photo.url} alt={`Foto ${index + 1}`} className={styles.image} />
              {photo.isCover && (
                <span className={styles.cover}>
                  <Badge tone="success">Portada</Badge>
                </span>
              )}
              <div className={styles.tools}>
                <button
                  type="button"
                  className={styles.tool}
                  disabled={index === 0}
                  onClick={() =>
                    run(photo.id, () => api.business.movePhoto(establishment.id, photo.id, -1))
                  }
                  aria-label="Mover antes"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.tool}
                  disabled={index === photos.length - 1}
                  onClick={() =>
                    run(photo.id, () => api.business.movePhoto(establishment.id, photo.id, 1))
                  }
                  aria-label="Mover después"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.tool}
                  disabled={photo.isCover}
                  onClick={() =>
                    run(photo.id, () => api.business.setCoverPhoto(establishment.id, photo.id))
                  }
                  aria-label="Usar como portada"
                >
                  <Star size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.tool} ${styles.delete}`}
                  onClick={() =>
                    run(photo.id, () => api.business.deletePhoto(establishment.id, photo.id))
                  }
                  aria-label="Eliminar foto"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </EditorForm>
  );
}
