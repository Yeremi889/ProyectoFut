/**
 * Secciones de edición de un establecimiento, en el orden del asistente (SOP sección 4).
 * El asistente y la pantalla de edición usan esta misma lista, así no se duplica nada.
 */
import { AmenitiesEditor } from './AmenitiesEditor';
import { ContactEditor } from './ContactEditor';
import { CourtsEditor } from './CourtsEditor';
import { InfoEditor } from './InfoEditor';
import { PhotosEditor } from './PhotosEditor';
import { ScheduleEditor } from './ScheduleEditor';

/**
 * @typedef {object} EditorSection
 * @property {string} id Identificador (se usa en la URL y en las pestañas).
 * @property {string} label Nombre visible.
 * @property {string} description Explicación corta para el negocio.
 * @property {import('react').ComponentType<any>} Editor Componente de edición.
 */

/** @type {EditorSection[]} */
export const EDITOR_SECTIONS = [
  {
    id: 'informacion',
    label: 'Datos del lugar',
    description: 'Nombre, descripción y dónde queda.',
    Editor: InfoEditor,
  },
  {
    id: 'servicios',
    label: 'Servicios',
    description: 'Lo que ofreces además de las canchas.',
    Editor: AmenitiesEditor,
  },
  {
    id: 'canchas',
    label: 'Canchas',
    description: 'Cada cancha con su tipo y precios de día y de noche.',
    Editor: CourtsEditor,
  },
  {
    id: 'fotos',
    label: 'Fotos',
    description: 'Fotos de las canchas e instalaciones.',
    Editor: PhotosEditor,
  },
  {
    id: 'horario',
    label: 'Horario',
    description: 'Horas de atención de cada día.',
    Editor: ScheduleEditor,
  },
  {
    id: 'contacto',
    label: 'Contacto',
    description: 'Cómo te van a escribir los jugadores.',
    Editor: ContactEditor,
  },
];
