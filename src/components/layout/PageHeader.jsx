import styles from './PageHeader.module.css';

/**
 * Título de página interna (paneles, formularios), con descripción y acciones opcionales.
 *
 * @param {object} props
 * @param {string} props.title Título principal (h1).
 * @param {import('react').ReactNode} [props.description] Texto bajo el título.
 * @param {import('react').ReactNode} [props.actions] Botones a la derecha.
 * @param {import('react').ReactNode} [props.back] Enlace de regreso sobre el título.
 * @returns {import('react').JSX.Element}
 */
export function PageHeader({ title, description, actions, back }) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {back}
        <h1 className={styles.title}>{title}</h1>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
