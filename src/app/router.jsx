/**
 * Definición de todas las rutas de la aplicación.
 * Las rutas de negocio y administrador están protegidas por rol.
 */
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireRole } from '@/components/routing/RequireRole';
import { ROUTES } from '@/constants/routes';
import { AdminAmenitiesPage } from '@/pages/admin/AdminAmenitiesPage';
import { AdminEstablishmentsPage } from '@/pages/admin/AdminEstablishmentsPage';
import { AdminMetricsPage } from '@/pages/admin/AdminMetricsPage';
import { AdminModerationPage } from '@/pages/admin/AdminModerationPage';
import { BusinessDashboardPage } from '@/pages/business/BusinessDashboardPage';
import { BusinessNewPage } from '@/pages/business/BusinessNewPage';
import { EstablishmentEditPage } from '@/pages/business/EstablishmentEditPage';
import { EstablishmentInsightsPage } from '@/pages/business/EstablishmentInsightsPage';
import { EstablishmentWizardPage } from '@/pages/business/EstablishmentWizardPage';
import { FavoritesPage } from '@/pages/player/FavoritesPage';
import { EstablishmentPage } from '@/pages/public/EstablishmentPage';
import { ForgotPasswordPage } from '@/pages/public/ForgotPasswordPage';
import { HomePage } from '@/pages/public/HomePage';
import { LegalPage } from '@/pages/public/LegalPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { RegisterPage } from '@/pages/public/RegisterPage';

/**
 * Envuelve una página para que solo la vea un rol.
 * @param {import('@/types/domain').UserRole} role Rol requerido.
 * @param {import('react').ReactNode} page Página.
 * @returns {import('react').JSX.Element}
 */
const only = (role, page) => <RequireRole role={role}>{page}</RequireRole>;

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Públicas
      { path: ROUTES.home, element: <HomePage /> },
      { path: '/c/:slug', element: <EstablishmentPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ROUTES.terms, element: <LegalPage document="terms" /> },
      { path: ROUTES.privacy, element: <LegalPage document="privacy" /> },

      // Jugador
      { path: ROUTES.favorites, element: only('player', <FavoritesPage />) },

      // Negocio
      { path: ROUTES.businessDashboard, element: only('business', <BusinessDashboardPage />) },
      { path: ROUTES.businessNew, element: only('business', <BusinessNewPage />) },
      { path: '/negocio/:id/asistente', element: only('business', <EstablishmentWizardPage />) },
      { path: '/negocio/:id/editar', element: only('business', <EstablishmentEditPage />) },
      { path: '/negocio/:id/resumen', element: only('business', <EstablishmentInsightsPage />) },

      // Administrador
      { path: ROUTES.adminModeration, element: only('admin', <AdminModerationPage />) },
      { path: ROUTES.adminEstablishments, element: only('admin', <AdminEstablishmentsPage />) },
      { path: ROUTES.adminAmenities, element: only('admin', <AdminAmenitiesPage />) },
      { path: ROUTES.adminMetrics, element: only('admin', <AdminMetricsPage />) },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
