/**
 * Implementación de la API contra el servidor real.
 * Debe exponer exactamente la misma forma que src/services/mock/index.js.
 */
import * as auth from './authHttp';
import * as pub from './publicHttp';
import * as business from './businessHttp';
import * as admin from './adminHttp';

export const httpApi = {
  auth,
  catalog: { listAmenities: pub.listAmenities },
  establishments: {
    search: pub.searchEstablishments,
    getBySlug: pub.getEstablishmentBySlug,
    trackEvent: pub.trackEvent,
  },
  reviews: { list: pub.listReviews, upsert: pub.upsertReview },
  favorites: { list: pub.listFavorites, add: pub.addFavorite, remove: pub.removeFavorite },
  reports: { create: pub.createReport },
  business,
  admin,
};
