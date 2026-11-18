/** Decide a dónde enviar a un usuario después de iniciar sesión o registrarse. */
import { ROUTES } from '@/constants/routes';

/** Página principal de cada rol. */
const HOME_BY_ROLE = {
  player: ROUTES.home,
  business: ROUTES.businessDashboard,
  admin: ROUTES.adminModeration,
};

/**
 * Devuelve la ruta de destino tras iniciar sesión.
 * Si el usuario venía de una página concreta, vuelve a ella.
 * @param {import('@/types/domain').UserRole} role Rol del usuario.
 * @param {string | undefined} from Ruta desde la que llegó al inicio de sesión.
 * @returns {string}
 */
export function getPostLoginRoute(role, from) {
  if (from && from !== ROUTES.login && from !== ROUTES.register) return from;
  return HOME_BY_ROLE[role] ?? ROUTES.home;
}
