/**
 * Relación entre la clave de ícono de un servicio y su ícono de Lucide.
 * Todos los íconos son del mismo set (línea, mismo grosor), según la guía de estilo.
 * Para agregar un servicio nuevo con otro ícono, agregarlo aquí y en AmenityIconKey (types/domain.js).
 */
import {
  Accessibility,
  CircleDot,
  Coffee,
  DoorOpen,
  Lightbulb,
  ShowerHead,
  SquareParking,
  Toilet,
  Users,
  Warehouse,
  Wifi,
} from 'lucide-react';

/** @type {Record<import('@/types/domain').AmenityIconKey, import('react').ComponentType<{ size?: number }>>} */
export const AMENITY_ICONS = {
  parking: SquareParking,
  lockers: DoorOpen,
  showers: ShowerHead,
  roofed: Warehouse,
  lighting: Lightbulb,
  cafeteria: Coffee,
  stands: Users,
  balls: CircleDot,
  wifi: Wifi,
  restrooms: Toilet,
  accessible: Accessibility,
};

/** Claves disponibles, para el selector del administrador. */
export const AMENITY_ICON_KEYS = Object.keys(AMENITY_ICONS);
