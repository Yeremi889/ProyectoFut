import styles from './CenteredCard.module.css';

/**
 * Contenedor centrado para formularios cortos (cuenta, recuperación, nuevo establecimiento).
 *
 * @param {object} props
 * @param {string} props.title Título.
 * @param {import('react').ReactNode} [props.description] Texto bajo el título.
 * @param {import('react').ReactNode} props.children Formulario.
 * @param {import('react').ReactNode} [props.footer] Enlaces al final (por ejemplo, "¿No tienes cuenta?").
 * @returns {import('react').JSX.Element}
 */
export function CenteredCard({ title, description, children, footer }) {
  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
