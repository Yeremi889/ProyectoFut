import { Warehouse } from 'lucide-react';
import { Chip } from '@/components/ui/Chip';
import {
  COURT_TYPE_LABELS,
  QUICK_FILTER_COURT_TYPES,
  SORT_OPTION_LABELS,
} from '@/constants/catalogs';
import styles from './FilterBar.module.css';

/**
 * Chips de filtro rápido y selector "Ordenar por" (SOP F-03 y F-04).
 * Intencionalmente simple: sin paneles de filtros avanzados (SOP sección 6).
 *
 * @param {object} props
 * @param {import('@/types/api').SearchFilters} props.filters Filtros actuales.
 * @param {(changes: Partial<import('@/types/api').SearchFilters>) => void} props.onChange Aplica cambios.
 * @param {string | null} [props.locationMessage] Aviso si no se pudo obtener la ubicación.
 * @returns {import('react').JSX.Element}
 */
export function FilterBar({ filters, onChange, locationMessage }) {
  const selected = filters.courtTypes ?? [];

  /**
   * Activa o desactiva un tipo de cancha.
   * @param {import('@/types/domain').CourtType} type
   */
  const toggleType = (type) => {
    const next = selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type];
    onChange({ courtTypes: next });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.chips} role="group" aria-label="Filtros rápidos">
        {QUICK_FILTER_COURT_TYPES.map((type) => (
          <Chip key={type} selected={selected.includes(type)} onToggle={() => toggleType(type)}>
            {COURT_TYPE_LABELS[type]}
          </Chip>
        ))}
        <Chip
          icon={Warehouse}
          selected={Boolean(filters.roofedOnly)}
          onToggle={() => onChange({ roofedOnly: !filters.roofedOnly })}
        >
          Techada
        </Chip>
      </div>

      <div className={styles.sort}>
        <label htmlFor="sort-by" className={styles.sortLabel}>
          Ordenar por
        </label>
        <select
          id="sort-by"
          className={styles.select}
          value={filters.sortBy ?? 'price'}
          onChange={(e) => onChange({ sortBy: e.target.value })}
        >
          {Object.entries(SORT_OPTION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {locationMessage && <p className={styles.message}>{locationMessage}</p>}
    </div>
  );
}
