import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CenteredCard } from '@/components/layout/CenteredCard';
import formStyles from '@/components/layout/Form.module.css';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/FormField';
import { USE_MOCK_API } from '@/config/env';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPostLoginRoute } from '@/utils/redirects';
import { validateEmail, validateRequired } from '@/utils/validation';

/**
 * Inicio de sesión para jugadores, negocios y administradores (SOP F-09 y F-20).
 * @returns {import('react').JSX.Element}
 */
export function LoginPage() {
  useDocumentTitle('Iniciar sesión');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Valida, inicia sesión y redirige según el rol.
   * @param {import('react').FormEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(email),
      password: validateRequired(password, 'La contraseña'),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const user = await login(email, password);
      navigate(getPostLoginRoute(user.role, location.state?.from), { replace: true });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CenteredCard
      title="Iniciar sesión"
      footer={
        <>
          ¿No tienes cuenta? <Link to={ROUTES.register}>Crear cuenta</Link>
        </>
      }
    >
      {USE_MOCK_API && (
        <Alert tone="info" title="Modo de prueba">
          Usa negocio@demo.cr, jugador@demo.cr o admin@demo.cr con la contraseña Demo1234.
        </Alert>
      )}
      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Link to={ROUTES.forgotPassword} className={formStyles.link}>
          Olvidé mi contraseña
        </Link>
        {submitError && <Alert tone="danger">{submitError}</Alert>}
        <Button type="submit" loading={submitting} block>
          Iniciar sesión
        </Button>
      </form>
    </CenteredCard>
  );
}
