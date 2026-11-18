import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';
import styles from './Header.module.css';

/** Enlaces del menú según el rol de la sesión. */
const NAV_BY_ROLE = {
  guest: [{ to: ROUTES.home, label: 'Buscar canchas' }],
  player: [
    { to: ROUTES.home, label: 'Buscar canchas' },
    { to: ROUTES.favorites, label: 'Mis favoritos' },
  ],
  business: [
    { to: ROUTES.home, label: 'Buscar canchas' },
    { to: ROUTES.businessDashboard, label: 'Mis establecimientos' },
  ],
  admin: [
    { to: ROUTES.adminModeration, label: 'Moderación' },
    { to: ROUTES.adminEstablishments, label: 'Establecimientos' },
    { to: ROUTES.adminAmenities, label: 'Servicios' },
    { to: ROUTES.adminMetrics, label: 'Métricas' },
  ],
};

/**
 * Encabezado fijo con logo, navegación según el rol y menú desplegable en celular.
 * @returns {import('react').JSX.Element}
 */
export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // El menú de celular se guarda junto con la página donde se abrió:
  // al navegar a otra página queda cerrado automáticamente.
  const [openAt, setOpenAt] = useState(null);
  const menuOpen = openAt === location.pathname;
  const links = NAV_BY_ROLE[user?.role ?? 'guest'];

  /** Cierra la sesión y vuelve al inicio. */
  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpenAt(menuOpen ? null : location.pathname)}
        >
          {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        <nav
          id="main-nav"
          className={`${styles.nav} ${menuOpen ? styles.open : ''}`}
          aria-label="Principal"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {link.label}
            </NavLink>
          ))}

          <div className={styles.account}>
            {user ? (
              <>
                <span className={styles.userName}>{user.name}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" to={ROUTES.login}>
                  Iniciar sesión
                </Button>
                <Button size="sm" to={`${ROUTES.register}?tipo=negocio`}>
                  Registrar mi cancha
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
