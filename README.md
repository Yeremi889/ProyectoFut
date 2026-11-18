# ProyectoFut (CanchasYa)

Directorio web de canchas de fútbol sintético en Costa Rica. Los negocios registran sus establecimientos (canchas, precios, fotos, servicios y horario) y los jugadores los encuentran y los contactan por WhatsApp.

El alcance funcional está en el SOP del proyecto. Cada función del código lleva su identificador (por ejemplo, `SOP F-05`) para ubicarla rápido.

> **Estado actual:** el frontend está completo y funciona con **datos simulados** guardados en el navegador. Para conectarlo al servidor real, ver [Conectar el servidor](#conectar-el-servidor).

## Tecnología

| Herramienta                                                | Uso                                  |
| ---------------------------------------------------------- | ------------------------------------ |
| [React 19](https://react.dev) + JavaScript                 | Interfaz                             |
| [Vite](https://vite.dev)                                   | Servidor de desarrollo y compilación |
| [React Router](https://reactrouter.com)                    | Rutas y páginas                      |
| [Lucide](https://lucide.dev)                               | Íconos (un solo set, de línea)       |
| CSS Modules                                                | Estilos aislados por componente      |
| [Vitest](https://vitest.dev)                               | Pruebas automáticas                  |
| [Oxlint](https://oxc.rs) + [Prettier](https://prettier.io) | Revisión de código y formato         |

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación y uso

```bash
npm install            # instala las dependencias
cp .env.example .env   # crea la configuración local
npm run dev            # abre la app en http://localhost:5173
```

### Cuentas de prueba (modo simulado)

La contraseña de todas es `Demo1234`.

| Correo            | Rol                        |
| ----------------- | -------------------------- |
| `jugador@demo.cr` | Jugador                    |
| `negocio@demo.cr` | Negocio con dos sucursales |
| `ana@demo.cr`     | Negocio                    |
| `admin@demo.cr`   | Administrador              |

Para volver a los datos de ejemplo, borra el almacenamiento del sitio en el navegador (Herramientas de desarrollador, pestaña Application, Local Storage).

## Scripts

| Comando           | Qué hace                                      |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga automática |
| `npm run build`   | Compila la versión de producción en `dist/`   |
| `npm run preview` | Sirve la compilación de `dist/` para probarla |
| `npm test`        | Ejecuta las pruebas automáticas               |
| `npm run lint`    | Revisa errores y malas prácticas en el código |
| `npm run format`  | Da formato a todo el código con Prettier      |

Antes de cada commit: `npm run lint && npm test && npm run format:check`.

## Conectar el servidor

1. En `.env`, cambia `VITE_USE_MOCK=false` y pon la URL del servidor en `VITE_API_URL`.
2. Revisa que el servidor cumpla el contrato de [docs/API.md](docs/API.md).
3. Si alguna ruta o campo es distinto, ajústalo **solo** en `src/services/http/`. Las pantallas no se tocan.

La prueba `src/services/services.test.js` verifica que el cliente HTTP y el mock tengan exactamente las mismas funciones.

## Publicar

`npm run build` genera archivos estáticos en `dist/`. Como la app usa rutas del navegador (`/c/mi-cancha`), el hosting debe devolver `index.html` para cualquier ruta:

- **Netlify:** archivo `public/_redirects` con `/* /index.html 200`.
- **Vercel:** `vercel.json` con `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
- **Apache o Nginx:** regla de _fallback_ a `index.html`.

## Documentación

- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): estructura de carpetas, capas, convenciones y guía de estilo.
- [docs/API.md](docs/API.md): contrato con el servidor (endpoints, entradas y salidas).
- [docs/CONTRIBUIR.md](docs/CONTRIBUIR.md): flujo de ramas, commits y revisión.
