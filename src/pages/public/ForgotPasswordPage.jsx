import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CenteredCard } from '@/components/layout/CenteredCard';
import formStyles from '@/components/layout/Form.module.css';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/FormField';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import { validateEmail } from '@/utils/validation';

/**
 * Solicitud de recuperación de contraseña (SOP F-09 y F-20).
 * Siempre muestra el mismo mensaje para no revelar qué correos están registrados.
 * @returns {import('react').JSX.Element}
 */
export function ForgotPasswordPage() {
  useDocumentTitle('Recuperar contraseña');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  /**
   * @param {import('react').FormEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;
    setSending(true);
    try {
      await api.auth.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <CenteredCard
      title="Recuperar contraseña"
      description="Te enviaremos un enlace para crear una contraseña nueva."
      footer={<Link to={ROUTES.login}>Volver a iniciar sesión</Link>}
    >
      {sent ? (
        <Alert tone="success" title="Revisa tu correo">
          Si {email} tiene una cuenta, recibirás un enlace en los próximos minutos.
        </Alert>
      ) : (
        <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Correo"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" loading={sending} block>
            Enviar enlace
          </Button>
        </form>
      )}
    </CenteredCard>
  );
}
