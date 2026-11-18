import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CenteredCard } from '@/components/layout/CenteredCard';
import formStyles from '@/components/layout/Form.module.css';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/FormField';
import { Tabs } from '@/components/ui/Tabs';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPostLoginRoute } from '@/utils/redirects';
import { hasNoErrors, validateEmail, validatePassword, validateRequired } from '@/utils/validation';
import styles from './RegisterPage.module.css';

/** Tipos de cuenta que se pueden crear desde la web. */
const ACCOUNT_TABS = [
  { id: 'player', label: 'Soy jugador' },
  { id: 'business', label: 'Tengo canchas' },
];

/** Texto que explica cada tipo de cuenta. */
const ACCOUNT_DESCRIPTIONS = {
  player:
    'Con tu cuenta puedes dejar reseñas y guardar tus canchas favoritas. Buscar y contactar no la necesita.',
  business:
    'Registra tu establecimiento, sube fotos y precios, y recibe contactos de jugadores por WhatsApp.',
};

/**
 * Registro de jugador o de negocio (SOP F-09 y F-20).
 * "?tipo=negocio" en la URL abre directamente la pestaña de negocio.
 * Incluye el consentimiento exigido por la Ley 8968.
 * @returns {import('react').JSX.Element}
 */
export function RegisterPage() {
  useDocumentTitle('Crear cuenta');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('tipo') === 'negocio' ? 'business' : 'player');
  const [form, setForm] = useState({ name: '', email: '', password: '', accepted: false });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Actualiza un campo del formulario.
   * @param {keyof typeof form} field
   * @param {string | boolean} value
   */
  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  /**
   * Valida, crea la cuenta y redirige.
   * @param {import('react').FormEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      name: validateRequired(form.name, 'El nombre'),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      accepted: form.accepted ? null : 'Debes aceptar los términos y la política de privacidad.',
    };
    setErrors(nextErrors);
    if (!hasNoErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      });
      navigate(role === 'business' ? ROUTES.businessNew : getPostLoginRoute(user.role), {
        replace: true,
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CenteredCard
      title="Crear cuenta"
      footer={
        <>
          ¿Ya tienes cuenta? <Link to={ROUTES.login}>Iniciar sesión</Link>
        </>
      }
    >
      <Tabs tabs={ACCOUNT_TABS} activeId={role} onChange={setRole} label="Tipo de cuenta" />
      <p className={styles.description}>{ACCOUNT_DESCRIPTIONS[role]}</p>

      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label={role === 'business' ? 'Nombre del responsable' : 'Nombre'}
          autoComplete="name"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
        />
        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          hint="Al menos 8 caracteres, con letras y números."
          value={form.password}
          onChange={(e) => setField('password', e.target.value)}
          error={errors.password}
        />

        <div>
          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={form.accepted}
              onChange={(e) => setField('accepted', e.target.checked)}
            />
            <span>
              Acepto los <Link to={ROUTES.terms}>términos y condiciones</Link> y la{' '}
              <Link to={ROUTES.privacy}>política de privacidad</Link>.
            </span>
          </label>
          {errors.accepted && (
            <p className={styles.error} role="alert">
              {errors.accepted}
            </p>
          )}
        </div>

        {submitError && <Alert tone="danger">{submitError}</Alert>}
        <Button type="submit" loading={submitting} block>
          Crear cuenta
        </Button>
      </form>
    </CenteredCard>
  );
}
