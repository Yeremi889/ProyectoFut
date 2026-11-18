import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { getFromPrice } from '@/utils/pricing';
import styles from './EstablishmentPreview.module.css';

/**
 * Vista previa de la tarjeta pública de un establecimiento, para que el negocio vea cómo aparecerá.
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento completo.
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentPreview({ establishment: e }) {
  const cover = e.photos.find((p) => p.isCover) ?? e.photos[0];

  /** @type {import('@/types/domain').EstablishmentSummary} */
  const summary = {
    id: e.id,
    slug: e.slug,
    name: e.name,
    province: e.province || 'Provincia',
    canton: e.canton || 'Cantón',
    coverUrl: cover?.url ?? null,
    fromPrice: getFromPrice(e.courts),
    ratingAverage: e.ratingAverage,
    ratingCount: e.ratingCount,
    courtTypes: [...new Set(e.courts.map((c) => c.type))],
    hasRoofedCourt: e.courts.some((c) => c.roofed),
    schedule: e.schedule,
    location: e.location,
  };

  return (
    <div className={styles.preview} inert>
      <EstablishmentCard establishment={summary} />
    </div>
  );
}
