import styles from './Switch.module.css';

/**
 * Interruptor encendido/apagado (por ejemplo, Publicado / Oculto).
 *
 * @param {object} props
 * @param {boolean} props.checked Estado actual.
 * @param {(checked: boolean) => void} props.onChange Se llama con el nuevo estado.
 * @param {string} props.label Texto visible junto al interruptor.
 * @param {boolean} [props.disabled] Desactiva el interruptor.
 * @returns {import('react').JSX.Element}
 */
export function Switch({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span>{label}</span>
    </label>
  );
}
