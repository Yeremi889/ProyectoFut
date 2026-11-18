import styles from './PitchLines.module.css';

/**
 * Dibujo decorativo de las líneas de una cancha (media cancha con área y círculo central).
 * Es el elemento distintivo de la portada. Es solo decoración: se oculta a lectores de pantalla.
 * @returns {import('react').JSX.Element}
 */
export function PitchLines() {
  return (
    <svg
      className={styles.lines}
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="40" y="30" width="1120" height="360" />
        <line x1="600" y1="30" x2="600" y2="390" />
        <circle cx="600" cy="210" r="86" />
        <rect x="40" y="110" width="150" height="200" />
        <rect x="40" y="165" width="56" height="90" />
        <path d="M190 160 A 70 70 0 0 1 190 260" />
        <rect x="1010" y="110" width="150" height="200" />
        <rect x="1104" y="165" width="56" height="90" />
        <path d="M1010 160 A 70 70 0 0 0 1010 260" />
      </g>
      <circle cx="600" cy="210" r="6" fill="currentColor" />
    </svg>
  );
}
