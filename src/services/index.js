/**
 * Punto único de acceso a datos. Las pantallas y componentes SOLO importan `api` desde aquí.
 *
 * Según VITE_USE_MOCK se usa el mock (datos simulados en el navegador) o el servidor real.
 * Ambas implementaciones tienen exactamente las mismas funciones, así que cambiar de una a otra
 * no requiere tocar ninguna pantalla.
 */
import { USE_MOCK_API } from '@/config/env';
import { httpApi } from './http';
import { mockApi } from './mock';

export const api = USE_MOCK_API ? mockApi : httpApi;

export { ApiError } from './ApiError';
