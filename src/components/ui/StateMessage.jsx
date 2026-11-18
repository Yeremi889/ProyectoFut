import { CircleAlert, Inbox } from 'lucide-react';
import styles from './StateMessage.module.css';

/**
 * Indicador de carga centrado.
 * @param {object} props
 * @param {string} [props.label] Texto para lectores de pantalla y visible debajo.
 * @returns {import('react').JSX.Element}
 */
export function LoadingState({ label = 'Cargando...' }) {
  return (
    <div className={styles.box} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.text}>{label}</p>
    </div>
  );
}

/**
 * Estado vacío con una sugerencia de qué hacer (nunca una pantalla en blanco).
 * @param {object} props
 * @param {string} props.title Qué pasa, en una línea.
 * @param {string} [props.description] Qué puede hacer el usuario.
 * @param {import('react').ReactNode} [props.action] Botón opcional.
 * @param {import('react').ComponentType<{ size?: number }>} [props.icon] Ícono (por defecto, bandeja).
 * @returns {import('react').JSX.Element}
 */
export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className={styles.box}>
      <Icon size={32} className={styles.icon} aria-hidden="true" />
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.text}>{description}</p>}
      {action}
    </div>
  );
}

/**
 * Estado de error con opción de reintentar.
 * @param {object} props
 * @param {string} props.message Qué falló, en lenguaje claro.
 * @param {() => void} [props.onRetry] Si se pasa, muestra el botón "Intentar de nuevo".
 * @returns {import('react').JSX.Element}
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.box} role="alert">
      <CircleAlert size={32} className={styles.errorIcon} aria-hidden="true" />
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
