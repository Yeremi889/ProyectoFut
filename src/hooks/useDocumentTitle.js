import { useEffect } from 'react';
import { APP_NAME } from '@/constants/app';

/**
 * Cambia el título de la pestaña del navegador (y el que usan los buscadores, SOP sección 7: SEO).
 * @param {string | undefined} title Título de la página; si se omite, se usa solo el nombre de la app.
 * @returns {void}
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${APP_NAME}`
      : `${APP_NAME}: canchas sintéticas en Costa Rica`;
  }, [title]);
}
