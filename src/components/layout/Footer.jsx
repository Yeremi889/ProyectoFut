import { Link } from 'react-router-dom';
import { APP_NAME } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import styles from './Footer.module.css';

/**
 * Pie de página con enlaces legales (SOP sección 7: Ley 8968).
 * @returns {import('react').JSX.Element}
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          {APP_NAME} reúne canchas de fútbol sintético de Costa Rica. Los precios y horarios los
          publica cada establecimiento.
        </p>
        <nav className={styles.links} aria-label="Legal">
          <Link to={ROUTES.terms}>Términos y condiciones</Link>
          <Link to={ROUTES.privacy}>Política de privacidad</Link>
          <Link to={`${ROUTES.register}?tipo=negocio`}>Registrar mi cancha</Link>
        </nav>
      </div>
    </footer>
  );
}
