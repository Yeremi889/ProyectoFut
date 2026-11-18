import styles from './Tabs.module.css';

/**
 * Pestañas horizontales con desplazamiento en celular.
 *
 * @param {object} props
 * @param {{ id: string, label: string }[]} props.tabs Pestañas disponibles.
 * @param {string} props.activeId Id de la pestaña activa.
 * @param {(id: string) => void} props.onChange Se llama al elegir una pestaña.
 * @param {string} props.label Descripción del grupo para lectores de pantalla.
 * @returns {import('react').JSX.Element}
 */
export function Tabs({ tabs, activeId, onChange, label }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={`${styles.tab} ${tab.id === activeId ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
