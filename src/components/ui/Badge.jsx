import styles from './Badge.module.css';

/**
 * Etiqueta pequeña de estado (abierto, pendiente, aprobado...).
 *
 * @param {object} props
 * @param {'neutral' | 'success' | 'warning' | 'danger' | 'info'} [props.tone] Color según significado.
 * @param {import('react').ReactNode} props.children Texto.
 * @returns {import('react').JSX.Element}
 */
export function Badge({ tone = 'neutral', children }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
