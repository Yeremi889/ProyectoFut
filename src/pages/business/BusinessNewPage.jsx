import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredCard } from '@/components/layout/CenteredCard';
import formStyles from '@/components/layout/Form.module.css';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/FormField';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import { validateRequired } from '@/utils/validation';

/**
 * Inicio del registro de un establecimiento: pide el nombre, crea el borrador
 * y abre el asistente de seis pasos (SOP F-21).
 * @returns {import('react').JSX.Element}
 */
export function BusinessNewPage() {
  useDocumentTitle('Nuevo establecimiento');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  /** @param {import('react').FormEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nameError = validateRequired(name, 'El nombre');
    setError(nameError);
    if (nameError) return;
    setCreating(true);
    try {
      const draft = await api.business.createDraft(name);
      navigate(ROUTES.businessWizard(draft.id), { replace: true });
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  };

  return (
    <CenteredCard
      title="Nuevo establecimiento"
      description="Empecemos por el nombre. Después completarás ubicación, servicios, canchas, fotos, horario y contacto."
    >
      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre del establecimiento"
          placeholder="Canchas El Estadio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
        />
        <Alert tone="info">
          Puedes guardar y salir en cualquier paso. Tu avance queda como borrador.
        </Alert>
        <Button type="submit" loading={creating} block>
          Empezar registro
        </Button>
      </form>
    </CenteredCard>
  );
}
