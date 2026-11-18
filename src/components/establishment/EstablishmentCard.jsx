import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StarRating } from '@/components/ui/StarRating';
import { COURT_TYPE_LABELS } from '@/constants/catalogs';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, formatDistance } from '@/utils/format';
import { OpenNowBadge } from './OpenNowBadge';
import styles from './EstablishmentCard.module.css';

/**
 * Tarjeta de un establecimiento en el listado (SOP F-01).
 * Toda la tarjeta es un enlace al detalle.
 *
 * @param {object} props
 * @param {import('@/types/domain').EstablishmentSummary} props.establishment Resumen a mostrar.
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentCard({ establishment: e }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {e.coverUrl ? (
          <img src={e.coverUrl} alt={`Foto de ${e.name}`} loading="lazy" className={styles.image} />
        ) : (
          <div className={styles.noImage} aria-hidden="true" />
        )}
        <div className={styles.badge}>
          <OpenNowBadge schedule={e.schedule} />
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link to={ROUTES.establishment(e.slug)} className={styles.link}>
            {e.name}
          </Link>
        </h3>

        <p className={styles.place}>
          <MapPin size={16} aria-hidden="true" />
          {e.canton}, {e.province}
          {typeof e.distanceKm === 'number' && <span> a {formatDistance(e.distanceKm)}</span>}
        </p>

        <StarRating value={e.ratingAverage} count={e.ratingCount} />

        <p className={styles.types}>{e.courtTypes.map((t) => COURT_TYPE_LABELS[t]).join(', ')}</p>

        {e.fromPrice !== null && (
          <p className={styles.price}>
            <span className={styles.priceLabel}>Desde</span>
            <span className={styles.priceValue}>{formatCurrency(e.fromPrice)}</span>
            <span className={styles.priceLabel}>por hora</span>
          </p>
        )}
      </div>
    </article>
  );
}
