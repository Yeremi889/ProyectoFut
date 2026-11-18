import { Moon, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { COURT_TYPE_LABELS } from '@/constants/catalogs';
import { formatCurrency } from '@/utils/format';
import { formatTime12h } from '@/utils/time';
import styles from './CourtPriceList.module.css';

/**
 * Lista de canchas con precio diurno y nocturno (SOP F-06 y regla 2).
 *
 * @param {object} props
 * @param {import('@/types/domain').Court[]} props.courts Canchas.
 * @param {string} props.nightRateStartsAt Hora en que empieza la tarifa nocturna.
 * @returns {import('react').JSX.Element}
 */
export function CourtPriceList({ courts, nightRateStartsAt }) {
  if (courts.length === 0) return <p className={styles.empty}>Sin canchas registradas.</p>;

  return (
    <div className={styles.wrapper}>
      <p className={styles.note}>
        La tarifa nocturna aplica desde las {formatTime12h(nightRateStartsAt)}.
      </p>
      <ul className={styles.list}>
        {courts.map((court) => (
          <li key={court.id} className={styles.court}>
            <div className={styles.info}>
              <h3 className={styles.name}>{court.name}</h3>
              <div className={styles.tags}>
                <Badge tone="info">{COURT_TYPE_LABELS[court.type]}</Badge>
                {court.roofed && <Badge tone="neutral">Techada</Badge>}
              </div>
            </div>
            <dl className={styles.prices}>
              <div className={styles.price}>
                <dt>
                  <Sun size={16} aria-hidden="true" /> Día
                </dt>
                <dd>{formatCurrency(court.dayPrice)}</dd>
              </div>
              <div className={styles.price}>
                <dt>
                  <Moon size={16} aria-hidden="true" /> Noche
                </dt>
                <dd>{formatCurrency(court.nightPrice)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
