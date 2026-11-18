/**
 * Implementación simulada de la API (datos en localStorage).
 * Debe exponer exactamente la misma forma que src/services/http/index.js.
 */
import * as auth from './authMock';
import * as pub from './publicMock';
import * as business from './businessMock';
import * as admin from './adminMock';

export const mockApi = {
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

export { resetDatabase as resetMockData } from './database';
