import { useState } from 'react';
import { AMENITY_ICONS, AMENITY_ICON_KEYS } from '@/components/establishment/amenityIcons';
import formStyles from '@/components/layout/Form.module.css';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/FormField';
import { Switch } from '@/components/ui/Switch';
import { validateRequired } from '@/utils/validation';
import styles from './AmenityForm.module.css';

/**
 * Formulario de un servicio del catálogo: nombre, ícono y si está activo.
 *
 * @param {object} props
 * @param {import('@/types/domain').Amenity} [props.initial] Servicio a editar; si se omite, es nuevo.
 * @param {(amenity: Omit<import('@/types/domain').Amenity, 'id'> & { id?: string }) => Promise<void>} props.onSubmit Guarda.
 * @param {() => void} props.onCancel Cancela.
 * @returns {import('react').JSX.Element}
 */
export function AmenityForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? AMENITY_ICON_KEYS[0]);
  const [active, setActive] = useState(initial?.active ?? true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /** @param {import('react').FormEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nameError = validateRequired(name, 'El nombre');
    setError(nameError);
    if (nameError) return;
    setSaving(true);
    try {
      await onSubmit({ id: initial?.id, name, icon, active });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
      <TextField
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error && !name ? error : null}
      />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Ícono</legend>
        <div className={styles.icons}>
          {AMENITY_ICON_KEYS.map((key) => {
            const Icon = AMENITY_ICONS[key];
            return (
              <label key={key} className={`${styles.icon} ${icon === key ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="icon"
                  value={key}
                  checked={icon === key}
                  onChange={() => setIcon(key)}
                  className="visually-hidden"
                />
                <Icon size={22} aria-hidden="true" />
                <span className="visually-hidden">{key}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <Switch label={active ? 'Activo' : 'Inactivo'} checked={active} onChange={setActive} />
      {error && name && <Alert tone="danger">{error}</Alert>}

      <div className={formStyles.actions}>
        <Button type="submit" loading={saving}>
          Guardar servicio
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
