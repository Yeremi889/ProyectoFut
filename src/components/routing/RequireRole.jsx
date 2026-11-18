import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';

/**
 * Protege una ruta: si no hay sesión envía al inicio de sesión; si el rol no coincide, al inicio.
 * Después de iniciar sesión, el usuario vuelve a la página que quería ver.
 *
 * @param {object} props
 * @param {import('@/types/domain').UserRole} props.role Rol requerido.
 * @param {import('react').ReactNode} props.children Página protegida.
 * @returns {import('react').JSX.Element}
 */
export function RequireRole({ role, children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <LoadingState />;
  if (!user) return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  if (user.role !== role) return <Navigate to={ROUTES.home} replace />;
  return children;
}
