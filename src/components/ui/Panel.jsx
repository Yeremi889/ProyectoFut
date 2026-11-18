import styles from './Panel.module.css';

/**
 * Superficie blanca con borde para agrupar contenido relacionado.
 *
 * @param {object} props
 * @param {string} [props.title] Título opcional del panel.
 * @param {import('react').ReactNode} [props.actions] Acciones a la derecha del título.
 * @param {'section' | 'div'} [props.as] Elemento HTML a usar.
 * @param {import('react').ReactNode} props.children Contenido.
 * @returns {import('react').JSX.Element}
 */
export function Panel({ title, actions, as: Tag = 'section', className = '', children }) {
  return (
    <Tag className={`${styles.panel} ${className}`}>
      {(title || actions) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </Tag>
  );
}
