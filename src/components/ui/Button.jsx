import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * Botón reutilizable. Se renderiza como <button>, como link interno (to) o link externo (href).
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp'} [props.variant] Estilo visual.
 * @param {'md' | 'sm'} [props.size] Tamaño.
 * @param {string} [props.to] Ruta interna: lo convierte en <Link>.
 * @param {string} [props.href] URL externa: lo convierte en <a> que abre en otra pestaña.
 * @param {import('react').ComponentType<{ size?: number }>} [props.icon] Ícono de Lucide a la izquierda.
 * @param {boolean} [props.loading] Muestra estado de carga y desactiva el botón.
 * @param {boolean} [props.block] Ocupa todo el ancho disponible.
 * @param {import('react').ReactNode} props.children Texto del botón.
 * @returns {import('react').JSX.Element}
 */
export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon: Icon,
  loading = false,
  block = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [styles.button, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 16 : 18} aria-hidden="true" />
      )}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={loading || rest.disabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
