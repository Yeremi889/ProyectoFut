# Arquitectura

## Capas

La app tiene tres capas. Cada una solo conoce a la de abajo.

```
Páginas (src/pages)            Arman cada pantalla con componentes
   |
Componentes (src/components)   Piezas visuales reutilizables
   |
Servicios (src/services)       Único acceso a datos: mock o servidor real
```

- Ninguna página ni componente usa `fetch` ni `localStorage` directamente: todo pasa por `api`, importado de `@/services`.
- La lógica que no es visual (horarios, precios, validaciones, links) vive en `src/utils` como funciones puras con pruebas.

## Carpetas

| Carpeta                                           | Contenido                                                               |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/app`                                         | Rutas de la aplicación                                                  |
| `src/config`                                      | Lectura de variables de entorno (único lugar que lee `import.meta.env`) |
| `src/constants`                                   | Catálogos fijos: rutas, provincias, tipos de cancha, límites            |
| `src/types`                                       | Forma de los datos documentada con JSDoc (`@typedef`)                   |
| `src/utils`                                       | Funciones puras y sus pruebas (`*.test.js`)                             |
| `src/services`                                    | Capa de datos: `http/` (servidor real) y `mock/` (simulado)             |
| `src/context`                                     | Estado global: sesión del usuario                                       |
| `src/hooks`                                       | Lógica reutilizable de React (`useAsync`, `useGeolocation`...)          |
| `src/styles`                                      | Variables de diseño (`tokens.css`) y estilos base                       |
| `src/components/ui`                               | Piezas genéricas: botones, campos, modales, tablas                      |
| `src/components/layout`                           | Encabezado, pie, títulos de página, contenedores                        |
| `src/components/establishment`                    | Piezas del perfil público de un establecimiento                         |
| `src/components/search`                           | Portada, buscador y filtros                                             |
| `src/components/business`                         | Editores y piezas del panel del negocio                                 |
| `src/components/admin`                            | Formularios del panel del administrador                                 |
| `src/pages/public`, `player`, `business`, `admin` | Una página por archivo, agrupadas por actor                             |

## Convenciones

**Archivos**

- Un componente por archivo, con el mismo nombre (`EstablishmentCard.jsx`). Sus estilos van al lado (`EstablishmentCard.module.css`).
- Excepción: `FormField.jsx` agrupa los campos de formulario (texto, área y selector) porque comparten la misma estructura.
- Componentes en `PascalCase`, funciones y variables en `camelCase`, constantes en `MAYUSCULAS_CON_GUION`.

**Documentación**

- Toda función y componente lleva un comentario JSDoc con qué hace, sus parámetros (`@param`, con tipo), lo que devuelve (`@returns`) y los errores posibles (`@throws`).
- Las referencias `SOP F-xx` conectan el código con el alcance del proyecto.

**Estilos**

- Siempre variables de `tokens.css` (`var(--color-turf)`), nunca colores o medidas sueltas.
- Diseño primero para celular; `@media (min-width: 900px)` para computadora.
- Sin emojis en ninguna parte del proyecto. Los íconos salen solo de Lucide; los de servicios se definen en `src/components/establishment/amenityIcons.js`.

**Datos**

- Nada de valores sueltos: límites, textos de catálogos y rutas van en `src/constants`.
- Los errores de la capa de servicios son `ApiError`, con un mensaje listo para mostrar al usuario.
- Cada pantalla que carga datos muestra estados de carga, vacío y error.
- Los filtros de búsqueda viven en la URL, para poder compartir una búsqueda.

**Accesibilidad**

- Etiquetas conectadas a cada campo (`FormField` lo hace solo).
- Foco visible con teclado, botones de al menos 44 px, textos alternativos en fotos.
- Las gráficas tienen una tabla equivalente.

## Guía de estilo

| Variable             | Valor            | Uso                                  |
| -------------------- | ---------------- | ------------------------------------ |
| `--color-turf`       | `#0b5d3b`        | Color principal (césped)             |
| `--color-chalk`      | `#ffffff`        | Líneas de cancha y texto sobre verde |
| `--color-floodlight` | `#e9a52f`        | Estrellas y foco del teclado         |
| `--color-bg`         | `#eef3ef`        | Fondo de página                      |
| `--color-ink`        | `#14221b`        | Texto principal                      |
| `--font-display`     | Barlow Condensed | Títulos                              |
| `--font-body`        | Barlow           | Texto                                |

El elemento distintivo es la portada con las líneas de una cancha dibujadas (`src/components/search/PitchLines.jsx`). El resto de la interfaz se mantiene sobrio.
