import { LocateFixed } from 'lucide-react';
import { useState } from 'react';
import formStyles from '@/components/layout/Form.module.css';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/FormField';
import { DESCRIPTION_MAX_LENGTH } from '@/constants/app';
import { CANTONS_BY_PROVINCE, PROVINCES } from '@/constants/locations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSectionSave } from '@/hooks/useSectionSave';
import { api } from '@/services';
import { hasNoErrors, validateRequired } from '@/utils/validation';
import { EditorForm } from './EditorForm';
import styles from './InfoEditor.module.css';

const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p, label: p }));

/**
 * Convierte el texto de un campo de coordenada en número o null si está vacío.
 * @param {string} value Texto escrito.
 * @returns {number | null}
 */
function parseCoordinate(value) {
  const n = Number.parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/**
 * Paso 1 del asistente / pestaña "Información": datos del lugar y ubicación.
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a editar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSaved Recibe el establecimiento guardado.
 * @param {string} props.submitLabel Texto del botón de guardar.
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional.
 * @returns {import('react').JSX.Element}
 */
export function InfoEditor({ establishment, onSaved, submitLabel, secondaryAction }) {
  const [values, setValues] = useState({
    name: establishment.name,
    description: establishment.description,
    province: establishment.province,
    canton: establishment.canton,
    address: establishment.address,
    lat: establishment.location?.lat?.toString() ?? '',
    lng: establishment.location?.lng?.toString() ?? '',
  });
  const [errors, setErrors] = useState({});
  const geo = useGeolocation();

  const { submit, saving, error, saved, reset } = useSectionSave(() => {
    const lat = parseCoordinate(values.lat);
    const lng = parseCoordinate(values.lng);
    return api.business.update(establishment.id, {
      name: values.name.trim(),
      description: values.description.trim(),
      province: values.province,
      canton: values.canton,
      address: values.address.trim(),
      location: lat !== null && lng !== null ? { lat, lng } : null,
    });
  }, onSaved);

  /**
   * Actualiza un campo. Al cambiar la provincia se limpia el cantón.
   * @param {keyof typeof values} field
   * @param {string} value
   */
  const setField = (field, value) => {
    reset();
    setValues((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'province' ? { canton: '' } : {}),
    }));
  };

  /** Llena las coordenadas con la ubicación actual del dispositivo. */
  const fillCurrentLocation = async () => {
    const point = await geo.request();
    if (point) {
      setField('lat', point.lat.toFixed(6));
      setField('lng', point.lng.toFixed(6));
    }
  };

  /** @param {import('react').FormEvent} event */
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      name: validateRequired(values.name, 'El nombre'),
      province: validateRequired(values.province, 'La provincia'),
      canton: validateRequired(values.canton, 'El cantón'),
      address: validateRequired(values.address, 'La dirección'),
    };
    setErrors(nextErrors);
    if (hasNoErrors(nextErrors)) submit();
  };

  const cantonOptions = (CANTONS_BY_PROVINCE[values.province] ?? []).map((c) => ({
    value: c,
    label: c,
  }));

  return (
    <EditorForm
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      saving={saving}
      error={error}
      saved={saved}
      secondaryAction={secondaryAction}
    >
      <TextField
        label="Nombre del establecimiento"
        value={values.name}
        onChange={(e) => setField('name', e.target.value)}
        error={errors.name}
      />
      <TextAreaField
        label="Descripción"
        hint="Cuenta qué hace especial al lugar: tipo de césped, ambiente, torneos."
        maxLength={DESCRIPTION_MAX_LENGTH}
        value={values.description}
        onChange={(e) => setField('description', e.target.value)}
      />
      <div className={formStyles.row}>
        <SelectField
          label="Provincia"
          placeholder="Elige la provincia"
          options={PROVINCE_OPTIONS}
          value={values.province}
          onChange={(e) => setField('province', e.target.value)}
          error={errors.province}
        />
        <SelectField
          label="Cantón"
          placeholder={values.province ? 'Elige el cantón' : 'Primero elige la provincia'}
          options={cantonOptions}
          value={values.canton}
          onChange={(e) => setField('canton', e.target.value)}
          error={errors.canton}
          disabled={!values.province}
        />
      </div>
      <TextField
        label="Dirección"
        hint="Como la darías por teléfono, por ejemplo: 200 m sur del parque."
        value={values.address}
        onChange={(e) => setField('address', e.target.value)}
        error={errors.address}
      />

      <fieldset className={styles.location}>
        <legend className={styles.legend}>Ubicación para Waze y Google Maps</legend>
        <p className={styles.help}>
          Si estás en el establecimiento, usa tu ubicación actual. También puedes copiar las
          coordenadas desde Google Maps.
        </p>
        <div className={formStyles.row}>
          <TextField
            label="Latitud"
            inputMode="decimal"
            placeholder="9.9281"
            value={values.lat}
            onChange={(e) => setField('lat', e.target.value)}
          />
          <TextField
            label="Longitud"
            inputMode="decimal"
            placeholder="-84.0907"
            value={values.lng}
            onChange={(e) => setField('lng', e.target.value)}
          />
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            icon={LocateFixed}
            onClick={fillCurrentLocation}
            loading={geo.status === 'locating'}
          >
            Usar mi ubicación actual
          </Button>
          {geo.status === 'denied' && (
            <p className={styles.warning}>
              No pudimos obtener tu ubicación. Revisa el permiso del navegador.
            </p>
          )}
        </div>
      </fieldset>
    </EditorForm>
  );
}
