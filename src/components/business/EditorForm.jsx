import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import styles from './EditorForm.module.css';

/**
 * Estructura común de las secciones de edición del establecimiento:
 * contenido, mensajes de error o éxito y botón de guardar.
 * La usan tanto el asistente de registro como la pantalla de edición.
 *
 * @param {object} props
 * @param {(event: import('react').FormEvent) => void} props.onSubmit Guarda la sección.
 * @param {string} props.submitLabel Texto del botón ("Guardar y continuar", "Guardar cambios").
 * @param {boolean} props.saving true mientras se guarda.
 * @param {string | null} [props.error] Error del servidor.
 * @param {boolean} [props.saved] Muestra el aviso "Cambios guardados".
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional (por ejemplo, "Atrás").
 * @param {import('react').ReactNode} props.children Campos.
 * @returns {import('react').JSX.Element}
 */
export function EditorForm({
  onSubmit,
  submitLabel,
  saving,
  error,
  saved,
  secondaryAction,
  children,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {children}
      {error && <Alert tone="danger">{error}</Alert>}
      {saved && !error && <Alert tone="success">Cambios guardados.</Alert>}
      <div className={styles.actions}>
        {secondaryAction}
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
