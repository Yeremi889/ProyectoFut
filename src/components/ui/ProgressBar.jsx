import styles from './ProgressBar.module.css';

/**
 * Barra de progreso horizontal (perfil completo, pasos del asistente).
 *
 * @param {object} props
 * @param {number} props.value Porcentaje de 0 a 100.
 * @param {string} props.label Descripción para lectores de pantalla.
 * @returns {import('react').JSX.Element}
 */
export function ProgressBar({ value, label }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
