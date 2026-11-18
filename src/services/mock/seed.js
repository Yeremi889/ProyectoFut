/**
 * Datos de ejemplo del mock. Todos los nombres y datos son ficticios.
 *
 * Cuentas de prueba (contraseña de todas: Demo1234):
 * - admin@demo.cr     Administrador
 * - negocio@demo.cr   Negocio con dos sucursales
 * - ana@demo.cr       Negocio
 * - jugador@demo.cr   Jugador
 */
import { DEFAULT_NIGHT_RATE_START } from '@/constants/catalogs';
import { hashPassword } from './helpers';
import { pitchImage } from './placeholderImages';

/** @typedef {import('@/types/domain').DaySchedule} DaySchedule */
/** @typedef {import('@/types/domain').Establishment} Establishment */
/** @typedef {import('./database').MockDatabase} MockDatabase */

const DEMO_PASSWORD = 'Demo1234';
const SEED_DATE = '2026-09-01T12:00:00.000Z';

/** Catálogo inicial de servicios (SOP F-23 / F-43). */
const AMENITIES = [
  { id: 'am_parking', name: 'Parqueo', icon: 'parking', active: true },
  { id: 'am_lockers', name: 'Vestidores', icon: 'lockers', active: true },
  { id: 'am_showers', name: 'Duchas', icon: 'showers', active: true },
  { id: 'am_roofed', name: 'Techada', icon: 'roofed', active: true },
  { id: 'am_lighting', name: 'Iluminación nocturna', icon: 'lighting', active: true },
  { id: 'am_cafeteria', name: 'Soda o cafetería', icon: 'cafeteria', active: true },
  { id: 'am_stands', name: 'Gradería', icon: 'stands', active: true },
  { id: 'am_balls', name: 'Alquiler de balones', icon: 'balls', active: true },
  { id: 'am_wifi', name: 'Wi-Fi', icon: 'wifi', active: true },
  { id: 'am_restrooms', name: 'Baños', icon: 'restrooms', active: true },
  { id: 'am_accessible', name: 'Acceso para silla de ruedas', icon: 'accessible', active: true },
];

/**
 * Crea un horario semanal con el mismo horario de lunes a sábado y otro para el domingo.
 * @param {string} open Apertura de lunes a sábado.
 * @param {string} close Cierre de lunes a sábado.
 * @param {{ open: string, close: string } | null} sunday Horario del domingo, o null si cierra.
 * @returns {DaySchedule[]}
 */
function weekSchedule(open, close, sunday) {
  /** @type {DaySchedule[]} */
  const days = [1, 2, 3, 4, 5, 6].map((day) => ({ day, closed: false, open, close }));
  days.push(
    sunday
      ? { day: 0, closed: false, ...sunday }
      : { day: 0, closed: true, open: '08:00', close: '22:00' },
  );
  return days;
}

/**
 * Completa un establecimiento con valores comunes.
 * @param {Partial<Establishment> & Pick<Establishment, 'id' | 'ownerId' | 'slug' | 'name'>} data
 * @returns {Establishment}
 */
function establishment(data) {
  return {
    description: '',
    province: '',
    canton: '',
    address: '',
    location: null,
    phone: '',
    whatsapp: '',
    nightRateStartsAt: DEFAULT_NIGHT_RATE_START,
    schedule: weekSchedule('08:00', '22:00', null),
    courts: [],
    photos: [],
    amenityIds: [],
    status: 'approved',
    rejectionReason: null,
    published: true,
    ratingAverage: 0,
    ratingCount: 0,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    ...data,
  };
}

/**
 * Crea fotos de ejemplo con la primera como portada.
 * @param {string} prefix Prefijo del id.
 * @param {[number, string][]} items Pares [tono, etiqueta].
 * @returns {import('@/types/domain').Photo[]}
 */
function photos(prefix, items) {
  return items.map(([hue, label], i) => ({
    id: `${prefix}_ph${i}`,
    url: pitchImage(hue, label),
    isCover: i === 0,
  }));
}

/** Establecimientos de ejemplo. */
const ESTABLISHMENTS = [
  establishment({
    id: 'est_bombonera',
    ownerId: 'usr_negocio',
    slug: 'la-bombonera-sintetica',
    name: 'La Bombonera Sintética',
    description:
      'Complejo con tres canchas de césped sintético de última generación, iluminación LED y soda con comidas rápidas. Ideal para mejengas entre amigos y torneos empresariales.',
    province: 'San José',
    canton: 'Desamparados',
    address: '200 m sur del parque central de Desamparados',
    location: { lat: 9.8968, lng: -84.0711 },
    phone: '2222-1111',
    whatsapp: '8888-1111',
    schedule: weekSchedule('15:00', '23:00', { open: '08:00', close: '20:00' }),
    courts: [
      {
        id: 'crt_b1',
        name: 'Cancha 1',
        type: 'futbol5',
        roofed: false,
        dayPrice: 16000,
        nightPrice: 20000,
      },
      {
        id: 'crt_b2',
        name: 'Cancha 2',
        type: 'futbol5',
        roofed: false,
        dayPrice: 16000,
        nightPrice: 20000,
      },
      {
        id: 'crt_b3',
        name: 'Cancha grande',
        type: 'futbol7',
        roofed: false,
        dayPrice: 26000,
        nightPrice: 32000,
      },
    ],
    photos: photos('est_bombonera', [
      [140, 'Cancha principal'],
      [125, 'Cancha 2'],
      [155, 'Vista nocturna'],
    ]),
    amenityIds: ['am_parking', 'am_lockers', 'am_showers', 'am_lighting', 'am_cafeteria'],
  }),
  establishment({
    id: 'est_bombonera_sur',
    ownerId: 'usr_negocio',
    slug: 'la-bombonera-curridabat',
    name: 'La Bombonera Curridabat',
    description: 'Nuestra segunda sede, con cancha techada para jugar sin importar la lluvia.',
    province: 'San José',
    canton: 'Curridabat',
    address: 'Frente al centro comercial, Curridabat',
    location: { lat: 9.9146, lng: -84.0346 },
    phone: '2222-1112',
    whatsapp: '8888-1112',
    schedule: weekSchedule('16:00', '23:00', null),
    courts: [
      {
        id: 'crt_bs1',
        name: 'Techada',
        type: 'futbol5',
        roofed: true,
        dayPrice: 20000,
        nightPrice: 24000,
      },
    ],
    photos: photos('est_bombonera_sur', [[110, 'Cancha techada']]),
    amenityIds: ['am_roofed', 'am_parking', 'am_restrooms'],
  }),
  establishment({
    id: 'est_golcenter',
    ownerId: 'usr_ana',
    slug: 'gol-center-heredia',
    name: 'Gol Center Heredia',
    description:
      'Canchas techadas para jugar llueva o truene. Contamos con gradería para la barra y alquiler de balones.',
    province: 'Heredia',
    canton: 'Santo Domingo',
    address: 'Frente al EBAIS de Santo Domingo',
    location: { lat: 9.9811, lng: -84.0896 },
    phone: '2244-2222',
    whatsapp: '8888-2222',
    schedule: weekSchedule('09:00', '22:00', { open: '09:00', close: '18:00' }),
    courts: [
      {
        id: 'crt_g1',
        name: 'Techada A',
        type: 'futbol5',
        roofed: true,
        dayPrice: 18000,
        nightPrice: 22000,
      },
      {
        id: 'crt_g2',
        name: 'Techada B',
        type: 'futbol5',
        roofed: true,
        dayPrice: 18000,
        nightPrice: 22000,
      },
      {
        id: 'crt_g3',
        name: 'Cancha 8',
        type: 'futbol8',
        roofed: false,
        dayPrice: 30000,
        nightPrice: 36000,
      },
    ],
    photos: photos('est_golcenter', [
      [100, 'Techada A'],
      [92, 'Gradería'],
      [118, 'Cancha 8'],
    ]),
    amenityIds: ['am_roofed', 'am_stands', 'am_balls', 'am_parking', 'am_restrooms', 'am_wifi'],
  }),
  establishment({
    id: 'est_estadiomini',
    ownerId: 'usr_ana',
    slug: 'estadio-mini-alajuela',
    name: 'Estadio Mini Alajuela',
    description:
      'La única cancha sintética de fútbol 11 de la zona. Perfecta para ligas, entrenamientos de equipos y partidos de fin de semana.',
    province: 'Alajuela',
    canton: 'Alajuela',
    address: 'Barrio San José, contiguo a la plaza',
    location: { lat: 10.0163, lng: -84.2116 },
    phone: '2430-3333',
    whatsapp: '8888-3333',
    nightRateStartsAt: '17:30',
    schedule: weekSchedule('06:00', '22:00', { open: '06:00', close: '20:00' }),
    courts: [
      {
        id: 'crt_e1',
        name: 'Estadio',
        type: 'futbol11',
        roofed: false,
        dayPrice: 55000,
        nightPrice: 65000,
      },
      {
        id: 'crt_e2',
        name: 'Auxiliar',
        type: 'futbol7',
        roofed: false,
        dayPrice: 24000,
        nightPrice: 30000,
      },
    ],
    photos: photos('est_estadiomini', [
      [150, 'Fútbol 11'],
      [135, 'Auxiliar'],
    ]),
    amenityIds: [
      'am_parking',
      'am_lockers',
      'am_showers',
      'am_lighting',
      'am_stands',
      'am_accessible',
    ],
  }),
  establishment({
    id: 'est_guarco',
    ownerId: 'usr_ana',
    slug: 'cancha-el-guarco',
    name: 'Cancha El Guarco',
    description: 'Ambiente familiar, precios accesibles y la mejor vista del valle.',
    province: 'Cartago',
    canton: 'El Guarco',
    address: 'Tejar, 100 m este de la iglesia',
    location: { lat: 9.8501, lng: -83.9393 },
    phone: '2551-4444',
    whatsapp: '8888-4444',
    schedule: weekSchedule('10:00', '22:00', { open: '08:00', close: '18:00' }),
    courts: [
      {
        id: 'crt_c1',
        name: 'Cancha única',
        type: 'futbol5',
        roofed: false,
        dayPrice: 13000,
        nightPrice: 16000,
      },
    ],
    photos: photos('est_guarco', [[130, '']]),
    amenityIds: ['am_parking', 'am_cafeteria', 'am_wifi'],
  }),
  establishment({
    id: 'est_liberia',
    ownerId: 'usr_ana',
    slug: 'arena-liberia',
    name: 'Arena Liberia',
    description:
      'Canchas nuevas con iluminación profesional, a cinco minutos del centro de Liberia.',
    province: 'Guanacaste',
    canton: 'Liberia',
    address: 'Barrio Los Cerros, Liberia',
    location: { lat: 10.6346, lng: -85.4377 },
    phone: '2666-5555',
    whatsapp: '8888-5555',
    schedule: weekSchedule('16:00', '00:00', { open: '14:00', close: '22:00' }),
    courts: [
      {
        id: 'crt_l1',
        name: 'Cancha 1',
        type: 'futbol5',
        roofed: false,
        dayPrice: 15000,
        nightPrice: 19000,
      },
      {
        id: 'crt_l2',
        name: 'Cancha 2',
        type: 'futbol7',
        roofed: false,
        dayPrice: 22000,
        nightPrice: 27000,
      },
    ],
    photos: photos('est_liberia', [
      [95, 'Cancha 1'],
      [105, 'Cancha 2'],
    ]),
    amenityIds: ['am_lighting', 'am_parking', 'am_restrooms', 'am_cafeteria'],
  }),
  establishment({
    id: 'est_pendiente',
    ownerId: 'usr_ana',
    slug: 'futbol-zona-puntarenas',
    name: 'Fútbol Zona Puntarenas',
    description: 'Cancha de fútbol 5 cerca del Paseo de los Turistas.',
    province: 'Puntarenas',
    canton: 'Puntarenas',
    address: 'El Carmen, Puntarenas',
    phone: '2661-6666',
    whatsapp: '8888-6666',
    courts: [
      {
        id: 'crt_p1',
        name: 'Cancha 1',
        type: 'futbol5',
        roofed: false,
        dayPrice: 14000,
        nightPrice: 17000,
      },
    ],
    photos: photos('est_pendiente', [[145, '']]),
    status: 'pending',
    published: false,
    updatedAt: '2026-11-15T15:00:00.000Z',
  }),
];

/** Reseñas de ejemplo. */
const REVIEWS = [
  {
    id: 'rev_1',
    establishmentId: 'est_bombonera',
    userId: 'usr_jugador',
    userName: 'Diego R.',
    rating: 5,
    comment: 'Excelente césped y buena iluminación. Los vestidores muy limpios.',
  },
  {
    id: 'rev_2',
    establishmentId: 'est_bombonera',
    userId: 'usr_x1',
    userName: 'Pablo M.',
    rating: 4,
    comment: 'Muy buena cancha, el parqueo se llena rápido los viernes.',
  },
  {
    id: 'rev_3',
    establishmentId: 'est_golcenter',
    userId: 'usr_x1',
    userName: 'Pablo M.',
    rating: 5,
    comment: 'Perfecta para cuando llueve. La atención es muy buena.',
  },
  {
    id: 'rev_4',
    establishmentId: 'est_estadiomini',
    userId: 'usr_x2',
    userName: 'Laura C.',
    rating: 4,
    comment: 'La cancha de fútbol 11 está en muy buen estado.',
  },
  {
    id: 'rev_5',
    establishmentId: 'est_guarco',
    userId: 'usr_x2',
    userName: 'Laura C.',
    rating: 3,
    comment: 'Buen precio, aunque el césped ya necesita mantenimiento.',
  },
].map((r) => ({
  ...r,
  reply: null,
  hidden: false,
  createdAt: '2026-10-20T20:00:00.000Z',
  updatedAt: '2026-10-20T20:00:00.000Z',
}));

/**
 * Genera eventos de estadísticas de los últimos 6 meses con cantidades crecientes.
 * Usa una fórmula fija (no aleatoria) para que las gráficas siempre se vean igual.
 * @returns {MockDatabase['events']}
 */
function buildEvents() {
  /** @type {MockDatabase['events']} */
  const events = [];
  const base = { view: 40, whatsapp: 9, directions: 6, favorite: 2 };
  const ids = ['est_bombonera', 'est_bombonera_sur', 'est_golcenter', 'est_estadiomini'];
  const now = new Date();

  ids.forEach((establishmentId, e) => {
    for (let m = 5; m >= 0; m -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - m, 10, 12).toISOString();
      Object.entries(base).forEach(([type, count]) => {
        const total = Math.round(count * (1 + (5 - m) * 0.18) * (1 - e * 0.15));
        for (let i = 0; i < total; i += 1) events.push({ establishmentId, type, at: date });
      });
    }
  });
  return events;
}

/**
 * Construye la base de datos inicial del mock.
 * @returns {Promise<MockDatabase>}
 */
export async function buildSeed() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const user = (id, name, email, role) => ({
    id,
    name,
    email,
    role,
    passwordHash,
    createdAt: SEED_DATE,
  });

  /** @type {MockDatabase} */
  const db = {
    users: [
      user('usr_admin', 'Administración', 'admin@demo.cr', 'admin'),
      user('usr_negocio', 'Carlos Mora', 'negocio@demo.cr', 'business'),
      user('usr_ana', 'Ana Solís', 'ana@demo.cr', 'business'),
      user('usr_jugador', 'Diego Rojas', 'jugador@demo.cr', 'player'),
    ],
    establishments: ESTABLISHMENTS,
    amenities: AMENITIES,
    reviews: REVIEWS,
    favorites: [{ userId: 'usr_jugador', establishmentId: 'est_golcenter', createdAt: SEED_DATE }],
    reports: [
      {
        id: 'rep_1',
        kind: 'info',
        establishmentId: 'est_guarco',
        reviewId: null,
        reason: 'price',
        comment: 'El precio nocturno ahora es de 18 000.',
        status: 'open',
        resolution: null,
        createdAt: '2026-11-14T02:00:00.000Z',
      },
    ],
    events: buildEvents(),
    searches: [
      { term: 'desamparados', results: 1, at: SEED_DATE },
      { term: 'heredia', results: 1, at: SEED_DATE },
      { term: 'perez zeledon', results: 0, at: SEED_DATE },
      { term: 'perez zeledon', results: 0, at: SEED_DATE },
      { term: 'limon', results: 0, at: SEED_DATE },
    ],
  };

  // Calcular calificaciones iniciales a partir de las reseñas.
  db.establishments.forEach((est) => {
    const own = db.reviews.filter((r) => r.establishmentId === est.id);
    est.ratingCount = own.length;
    est.ratingAverage = own.length ? own.reduce((s, r) => s + r.rating, 0) / own.length : 0;
  });

  return db;
}
