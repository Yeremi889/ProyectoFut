import { EstablishmentCard } from './EstablishmentCard';
import styles from './EstablishmentGrid.module.css';

/**
 * Cuadrícula responsiva de tarjetas de establecimientos.
 *
 * @param {object} props
 * @param {import('@/types/domain').EstablishmentSummary[]} props.items Establecimientos.
 * @param {boolean} [props.dimmed] Atenúa la cuadrícula mientras se actualizan los resultados.
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentGrid({ items, dimmed = false }) {
  return (
    <div className={`${styles.grid} ${dimmed ? styles.dimmed : ''}`}>
      {items.map((est) => (
        <EstablishmentCard key={est.id} establishment={est} />
      ))}
    </div>
  );
}
