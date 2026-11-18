# Cómo contribuir

## Ramas

- `main` siempre debe compilar y pasar las pruebas.
- Cada funcionalidad o corrección va en su propia rama, creada desde `main`:
  - `feat/nombre-corto` para funcionalidades nuevas
  - `fix/nombre-corto` para correcciones
  - `docs/nombre-corto` para documentación
- Los cambios entran a `main` por Pull Request, para que se puedan revisar.

## Commits

Se usa la convención [Conventional Commits](https://www.conventionalcommits.org/es/):

```
feat: agregar filtro de cancha techada
fix: corregir cálculo de "Abierto ahora" después de medianoche
docs: documentar endpoint de reseñas
refactor: separar la galería en su propio componente
test: agregar pruebas de precios nocturnos
style: aplicar formato con Prettier
```

Commits pequeños, con un solo propósito cada uno.

## Antes de abrir un Pull Request

```bash
npm run lint
npm test
npm run format:check
npm run build
```

Los cuatro comandos deben terminar sin errores.

## Lista de revisión

- [ ] Las funciones nuevas tienen comentario JSDoc (qué hace, parámetros, retorno).
- [ ] No hay colores ni medidas sueltas: se usan las variables de `tokens.css`.
- [ ] Las pantallas nuevas tienen estado de carga, vacío y error.
- [ ] La lógica nueva en `src/utils` tiene pruebas.
- [ ] Se probó en un celular o con el modo móvil del navegador.
- [ ] No hay emojis.
