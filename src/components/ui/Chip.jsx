import styles from './Chip.module.css';

/**
 * Chip de filtro rápido que se activa o desactiva con un toque (SOP F-03).
 *
 * @param {object} props
 * @param {boolean} props.selected Si el chip está activo.
 * @param {() => void} props.onToggle Se llama al tocarlo.
 * @param {import('react').ComponentType<{ size?: number }>} [props.icon] Ícono opcional.
 * @param {import('react').ReactNode} props.children Texto del chip.
 * @returns {import('react').JSX.Element}
 */
export function Chip({ selected, onToggle, icon: Icon, children }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={onToggle}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}
