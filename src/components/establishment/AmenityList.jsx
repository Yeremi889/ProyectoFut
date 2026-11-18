import { useAmenities } from '@/hooks/useAmenities';
import { AMENITY_ICONS } from './amenityIcons';
import styles from './AmenityList.module.css';

/**
 * Muestra con ícono solo los servicios que ofrece el establecimiento (SOP F-23).
 *
 * @param {object} props
 * @param {string[]} props.amenityIds Ids de los servicios marcados.
 * @returns {import('react').JSX.Element | null} null si no marcó ninguno.
 */
export function AmenityList({ amenityIds }) {
  const { amenities } = useAmenities();
  const offered = amenities.filter((a) => amenityIds.includes(a.id));
  if (offered.length === 0) return null;

  return (
    <ul className={styles.list}>
      {offered.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity.icon];
        return (
          <li key={amenity.id} className={styles.item}>
            <span className={styles.icon}>
              <Icon size={20} aria-hidden="true" />
            </span>
            {amenity.name}
          </li>
        );
      })}
    </ul>
  );
}
