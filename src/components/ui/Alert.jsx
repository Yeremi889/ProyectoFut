import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import styles from './Alert.module.css';

const ICONS = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert };

/**
 * Aviso dentro de la página (confirmaciones, advertencias, errores de formulario).
 *
 * @param {object} props
 * @param {'info' | 'success' | 'warning' | 'danger'} [props.tone] Significado del aviso.
 * @param {string} [props.title] Título opcional en negrita.
 * @param {import('react').ReactNode} props.children Contenido.
 * @returns {import('react').JSX.Element}
 */
export function Alert({ tone = 'info', title, children }) {
  const Icon = ICONS[tone];
  return (
    <div
      className={`${styles.alert} ${styles[tone]}`}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      <Icon size={20} className={styles.icon} aria-hidden="true" />
      <div>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
