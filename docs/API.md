# Contrato de la API

Esto es lo que el frontend espera del servidor. Está implementado en `src/services/http/`; el mock (`src/services/mock/`) simula exactamente las mismas respuestas.

Si el servidor real usa otras rutas o nombres de campos, se ajusta **solo** `src/services/http/`.

## Convenciones

- URL base: variable `VITE_API_URL`, por ejemplo `https://api.canchasya.cr/api`.
- Formato: JSON en las peticiones y respuestas, salvo la subida de fotos (`multipart/form-data`).
- Sesión: encabezado `Authorization: Bearer <token>`. El token se recibe al iniciar sesión o registrarse.
- Fechas: texto ISO 8601 (`2026-11-18T20:00:00.000Z`). Horas: `"HH:mm"` en 24 h.
- Precios: colones enteros, sin decimales.
- Errores: código HTTP adecuado y cuerpo `{ "message": "Texto para mostrar al usuario" }`. Si es `401`, el frontend cierra la sesión.

La forma completa de cada objeto (`User`, `Establishment`, `Review`...) está en `src/types/domain.js`.

## Autenticación

| Método y ruta                | Cuerpo                                                            | Respuesta                                      |
| ---------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| `POST /auth/register`        | `{ name, email, password, role }` (`role`: `player` o `business`) | `{ token, user }`                              |
| `POST /auth/login`           | `{ email, password }`                                             | `{ token, user }`                              |
| `GET /auth/me`               |                                                                   | `User`                                         |
| `POST /auth/forgot-password` | `{ email }`                                                       | `204`, siempre (no revela si el correo existe) |

El rol `admin` nunca se crea desde la web.

## Público (sin sesión)

| Método y ruta                      | Entrada                                                                                                             | Respuesta                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `GET /services`                    |                                                                                                                     | `Amenity[]`, solo activos                             |
| `GET /establishments`              | Query: `q`, `courtTypes` (separados por coma), `roofed=true`, `sort` (`price`, `rating` o `distance`), `lat`, `lng` | `EstablishmentSummary[]`, solo aprobados y publicados |
| `GET /establishments/{slug}`       |                                                                                                                     | `Establishment`; `404` si no es público               |
| `POST /establishments/{id}/events` | `{ type }` (`view`, `whatsapp`, `directions`)                                                                       | `204`                                                 |
| `GET /establishments/{id}/reviews` |                                                                                                                     | `Review[]` visibles, más recientes primero            |
| `POST /reports`                    | `{ establishmentId, reviewId?, reason, comment? }`                                                                  | `204`                                                 |

Reglas que debe aplicar el servidor:

- `sort=distance` ordena por distancia a `lat`/`lng` y agrega `distanceKm` a cada resultado.
- Registrar los términos de búsqueda y cuántos resultados dieron (para las métricas del administrador).
- `reason` de reporte: `phone`, `price`, `schedule`, `closed`, `other` u `offensive` (reseñas).

## Jugador (sesión con rol `player`)

| Método y ruta                            | Cuerpo                | Respuesta                |
| ---------------------------------------- | --------------------- | ------------------------ |
| `PUT /establishments/{id}/reviews`       | `{ rating, comment }` | `Review`                 |
| `GET /me/favorites`                      |                       | `EstablishmentSummary[]` |
| `POST /me/favorites`                     | `{ establishmentId }` | `204`                    |
| `DELETE /me/favorites/{establishmentId}` |                       | `204`                    |

La reseña es **una por jugador y establecimiento**: `PUT` crea o reemplaza la existente y recalcula `ratingAverage` y `ratingCount`. Agregar un favorito también cuenta como evento `favorite` en las estadísticas.

## Negocio (sesión con rol `business`)

Un negocio solo puede ver y editar sus propios establecimientos (si no, `404`).

| Método y ruta                                        | Cuerpo                                         | Respuesta                                                    |
| ---------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `GET /me/establishments`                             |                                                | `Establishment[]`, cualquier estado                          |
| `POST /me/establishments`                            | `{ name }`                                     | `Establishment` en estado `draft`, con `slug` único          |
| `GET /me/establishments/{id}`                        |                                                | `Establishment`                                              |
| `PUT /me/establishments/{id}`                        | Campos editables (ver abajo) o `{ published }` | `Establishment`                                              |
| `POST /me/establishments/{id}/submit`                |                                                | `Establishment` en estado `pending`                          |
| `POST /me/establishments/{id}/courts`                | `{ name, type, roofed, dayPrice, nightPrice }` | `Court`                                                      |
| `PUT /me/establishments/{id}/courts/{courtId}`       | Igual que arriba                               | `Court`                                                      |
| `DELETE /me/establishments/{id}/courts/{courtId}`    |                                                | `204`                                                        |
| `POST /me/establishments/{id}/photos`                | `multipart/form-data`, campo `photo`           | `Establishment`                                              |
| `DELETE /me/establishments/{id}/photos/{photoId}`    |                                                | `Establishment`                                              |
| `PUT /me/establishments/{id}/photos/{photoId}/cover` |                                                | `Establishment`                                              |
| `PUT /me/establishments/{id}/photos/{photoId}/move`  | `{ direction }` (`-1` o `1`)                   | `Establishment`                                              |
| `GET /me/establishments/{id}/stats`                  |                                                | `MonthlyStats[]`, últimos 6 meses, del más antiguo al actual |
| `GET /establishments/{id}/reviews`                   |                                                | `Review[]`, incluidas las ocultas si es el dueño             |
| `PUT /reviews/{reviewId}/reply`                      | `{ text }`                                     | `Review`                                                     |

**Campos editables:** `name`, `description`, `province`, `canton`, `address`, `location` (`{ lat, lng }` o `null`), `phone`, `whatsapp`, `nightRateStartsAt`, `schedule`, `amenityIds`. El servidor debe ignorar cualquier otro campo (estado, dueño, calificación).

Reglas:

- `submit` exige ubicación completa, al menos una cancha y un teléfono o WhatsApp; si falta algo, `400` con el mensaje.
- `published` solo se puede cambiar si el estado es `approved`.
- Fotos: JPG, PNG o WebP, máximo 8 MB cada una y 12 por establecimiento (valores provisionales, ver SOP sección 10). La primera foto subida queda como portada; al borrar la portada, la siguiente pasa a serlo.

## Administrador (sesión con rol `admin`)

| Método y ruta                              | Cuerpo                                                     | Respuesta                             |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------- |
| `GET /admin/establishments?status=pending` |                                                            | `PendingEstablishment[]`              |
| `GET /admin/establishments`                |                                                            | `Establishment[]`                     |
| `POST /admin/establishments/{id}/approve`  |                                                            | `204`; queda `approved` y publicado   |
| `POST /admin/establishments/{id}/reject`   | `{ reason }`                                               | `204`; queda `rejected` con el motivo |
| `PUT /admin/establishments/{id}/status`    | `{ status }` (`approved` o `suspended`)                    | `204`                                 |
| `GET /admin/reports?status=open`           |                                                            | `ReportWithContext[]`                 |
| `POST /admin/reports/{id}/resolve`         | `{ action }` (`dismiss`, `hide-review`, `notify-business`) | `204`                                 |
| `GET /admin/services`                      |                                                            | `Amenity[]`, incluidos los inactivos  |
| `POST /admin/services`                     | `{ name, icon, active }`                                   | `Amenity`                             |
| `PUT /admin/services/{id}`                 | `{ name, icon, active }`                                   | `Amenity`                             |
| `GET /admin/metrics`                       |                                                            | `PlatformMetrics`                     |

Pendiente para el servidor: `notify-business` debería enviar un aviso al negocio (correo o notificación). El frontend solo registra la acción.
