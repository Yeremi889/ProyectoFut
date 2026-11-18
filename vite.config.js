import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Configuración de Vite (servidor de desarrollo y build) y de Vitest (pruebas).
 * El alias "@" apunta a la carpeta src para evitar rutas relativas largas.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
});
