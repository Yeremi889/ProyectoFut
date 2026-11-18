/**
 * Rutas de la aplicación. Usar siempre estas funciones en lugar de escribir rutas a mano,
 * así un cambio de URL se hace en un solo lugar.
 */
export const ROUTES = {
  home: '/',
  establishment: (slug) => `/c/${slug}`,
  login: '/ingresar',
  register: '/registro',
  forgotPassword: '/recuperar-contrasena',
  favorites: '/favoritos',
  terms: '/terminos',
  privacy: '/privacidad',

  businessDashboard: '/negocio',
  businessNew: '/negocio/nuevo',
  businessWizard: (id) => `/negocio/${id}/asistente`,
  businessEdit: (id) => `/negocio/${id}/editar`,
  businessInsights: (id) => `/negocio/${id}/resumen`,

  adminModeration: '/admin',
  adminEstablishments: '/admin/establecimientos',
  adminAmenities: '/admin/servicios',
  adminMetrics: '/admin/metricas',
};
