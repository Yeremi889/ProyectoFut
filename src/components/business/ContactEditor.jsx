import { useState } from 'react';
import formStyles from '@/components/layout/Form.module.css';
import { TextField } from '@/components/ui/FormField';
import { useSectionSave } from '@/hooks/useSectionSave';
import { api } from '@/services';
import { validatePhone } from '@/utils/validation';
import { EditorForm } from './EditorForm';

/**
 * Paso 6 del asistente / pestaña "Contacto": teléfono y WhatsApp.
 * Al menos uno es obligatorio; el WhatsApp es el contacto principal de la plataforma.
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a editar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSaved Recibe el establecimiento guardado.
 * @param {string} props.submitLabel Texto del botón de guardar.
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional.
 * @returns {import('react').JSX.Element}
 */
export function ContactEditor({ establishment, onSaved, submitLabel, secondaryAction }) {
  const [phone, setPhone] = useState(establishment.phone);
  const [whatsapp, setWhatsapp] = useState(establishment.whatsapp);
  const [errors, setErrors] = useState({});

  const { submit, saving, error, saved, reset } = useSectionSave(
    () => api.business.update(establishment.id, { phone: phone.trim(), whatsapp: whatsapp.trim() }),
    onSaved,
  );

  /** @param {import('react').FormEvent} event */
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      whatsapp: whatsapp ? validatePhone(whatsapp) : null,
      phone: phone ? validatePhone(phone) : null,
    };
    if (!phone && !whatsapp) nextErrors.whatsapp = 'Agrega al menos un WhatsApp o un teléfono.';
    setErrors(nextErrors);
    if (!nextErrors.whatsapp && !nextErrors.phone) submit();
  };

  return (
    <EditorForm
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      saving={saving}
      error={error}
      saved={saved}
      secondaryAction={secondaryAction}
    >
      <div className={formStyles.row}>
        <TextField
          label="WhatsApp"
          type="tel"
          inputMode="tel"
          placeholder="8888-1111"
          hint="Los jugadores te escribirán aquí con un mensaje ya preparado."
          value={whatsapp}
          onChange={(e) => {
            reset();
            setWhatsapp(e.target.value);
          }}
          error={errors.whatsapp}
        />
        <TextField
          label="Teléfono (opcional)"
          type="tel"
          inputMode="tel"
          placeholder="2222-1111"
          value={phone}
          onChange={(e) => {
            reset();
            setPhone(e.target.value);
          }}
          error={errors.phone}
        />
      </div>
    </EditorForm>
  );
}
