import { useState } from 'react';
import formStyles from '@/components/layout/Form.module.css';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/FormField';
import { Switch } from '@/components/ui/Switch';
import { COURT_TYPE_LABELS } from '@/constants/catalogs';
import { hasNoErrors, validatePrice, validateRequired } from '@/utils/validation';

const TYPE_OPTIONS = Object.entries(COURT_TYPE_LABELS).map(([value, label]) => ({ value, label }));

/**
 * Formulario de una cancha: nombre, tipo, techada y precios (SOP F-24).
 *
 * @param {object} props
 * @param {import('@/types/domain').Court} [props.initial] Cancha a editar; si se omite, es nueva.
 * @param {(input: import('@/types/api').CourtInput) => Promise<void>} props.onSubmit Guarda la cancha.
 * @param {() => void} props.onCancel Cancela.
 * @returns {import('react').JSX.Element}
 */
export function CourtForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name: initial?.name ?? '',
    type: initial?.type ?? 'futbol5',
    roofed: initial?.roofed ?? false,
    dayPrice: initial?.dayPrice?.toString() ?? '',
    nightPrice: initial?.nightPrice?.toString() ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * @param {keyof typeof values} field
   * @param {string | boolean} value
   */
  const setField = (field, value) => setValues((prev) => ({ ...prev, [field]: value }));

  /** @param {import('react').FormEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const dayPrice = Number(values.dayPrice);
    const nightPrice = Number(values.nightPrice);
    const nextErrors = {
      name: validateRequired(values.name, 'El nombre'),
      dayPrice: validatePrice(dayPrice),
      nightPrice: validatePrice(nightPrice),
    };
    setErrors(nextErrors);
    if (!hasNoErrors(nextErrors)) return;

    setSaving(true);
    setSubmitError(null);
    try {
      await onSubmit({
        name: values.name.trim(),
        type: values.type,
        roofed: values.roofed,
        dayPrice,
        nightPrice,
      });
    } catch (err) {
      setSubmitError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
      <TextField
        label="Nombre de la cancha"
        placeholder="Cancha 1"
        value={values.name}
        onChange={(e) => setField('name', e.target.value)}
        error={errors.name}
      />
      <SelectField
        label="Tipo"
        options={TYPE_OPTIONS}
        value={values.type}
        onChange={(e) => setField('type', e.target.value)}
      />
      <Switch
        label="Cancha techada"
        checked={values.roofed}
        onChange={(checked) => setField('roofed', checked)}
      />
      <div className={formStyles.row}>
        <TextField
          label="Precio diurno por hora (₡)"
          inputMode="numeric"
          value={values.dayPrice}
          onChange={(e) => setField('dayPrice', e.target.value.replace(/\D/g, ''))}
          error={errors.dayPrice}
        />
        <TextField
          label="Precio nocturno por hora (₡)"
          inputMode="numeric"
          value={values.nightPrice}
          onChange={(e) => setField('nightPrice', e.target.value.replace(/\D/g, ''))}
          error={errors.nightPrice}
        />
      </div>
      {submitError && <Alert tone="danger">{submitError}</Alert>}
      <div className={formStyles.actions}>
        <Button type="submit" loading={saving}>
          {initial ? 'Guardar cancha' : 'Agregar cancha'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
