import { Link } from 'react-router-dom';
import { APP_NAME } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import styles from './Logo.module.css';

/**
 * Logotipo provisional: una cancha vista desde arriba más el nombre de la plataforma.
 * @param {object} props
 * @param {boolean} [props.inverted] Versión blanca para fondos verdes.
 * @returns {import('react').JSX.Element}
 */
export function Logo({ inverted = false }) {
  return (
    <Link to={ROUTES.home} className={`${styles.logo} ${inverted ? styles.inverted : ''}`}>
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" className={styles.mark}>
        <rect width="32" height="32" rx="8" className={styles.markBg} />
        <g fill="none" strokeWidth="2" className={styles.markLines}>
          <rect x="6" y="9" width="20" height="14" rx="1.5" />
          <line x1="16" y1="9" x2="16" y2="23" />
          <circle cx="16" cy="16" r="3" />
        </g>
      </svg>
      <span className={styles.name}>{APP_NAME}</span>
    </Link>
  );
}
