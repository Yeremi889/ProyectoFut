import { Check } from 'lucide-react';
import { useState } from 'react';
import { AMENITY_ICONS } from '@/components/establishment/amenityIcons';
import { LoadingState } from '@/components/ui/StateMessage';
import { useAmenities } from '@/hooks/useAmenities';
import { useSectionSave } from '@/hooks/useSectionSave';
import { api } from '@/services';
import { EditorForm } from './EditorForm';
import styles from './AmenitiesEditor.module.css';

/**
 * Paso 2 del asistente / pestaña "Servicios": cuadrícula de servicios con ícono y casilla (SOP F-23).
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a editar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSaved Recibe el establecimiento guardado.
 * @param {string} props.submitLabel Texto del botón de guardar.
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional.
 * @returns {import('react').JSX.Element}
 */
export function AmenitiesEditor({ establishment, onSaved, submitLabel, secondaryAction }) {
  const { amenities, loading } = useAmenities();
  const [selected, setSelected] = useState(new Set(establishment.amenityIds));
  const { submit, saving, error, saved, reset } = useSectionSave(
    () => api.business.update(establishment.id, { amenityIds: [...selected] }),
    onSaved,
  );

  /**
   * Marca o desmarca un servicio.
   * @param {string} id
   */
  const toggle = (id) => {
    reset();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return <LoadingState />;

  return (
    <EditorForm
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      submitLabel={submitLabel}
      saving={saving}
      error={error}
      saved={saved}
      secondaryAction={secondaryAction}
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Marca los servicios que ofreces</legend>
        <div className={styles.grid}>
          {amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity.icon];
            const checked = selected.has(amenity.id);
            return (
              <label
                key={amenity.id}
                className={`${styles.option} ${checked ? styles.checked : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.input}
                  checked={checked}
                  onChange={() => toggle(amenity.id)}
                />
                <span className={styles.icon}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className={styles.name}>{amenity.name}</span>
                <span className={styles.box} aria-hidden="true">
                  {checked && <Check size={16} />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </EditorForm>
  );
}
