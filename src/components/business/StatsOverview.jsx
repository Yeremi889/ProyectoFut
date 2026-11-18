import { STAT_EVENT_LABELS } from '@/constants/catalogs';
import { formatMonth } from '@/utils/format';
import { MonthlyBarChart } from './MonthlyBarChart';
import styles from './StatsOverview.module.css';

/** Orden en que se muestran las métricas. */
const METRICS = ['view', 'whatsapp', 'directions', 'favorite'];

/**
 * Calcula el cambio porcentual entre dos valores.
 * @param {number} current Valor del mes actual.
 * @param {number} previous Valor del mes anterior.
 * @returns {number | null} Porcentaje redondeado, o null si no hay base de comparación.
 */
function percentChange(current, previous) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Estadísticas del negocio (SOP F-29): totales del mes actual frente al anterior,
 * gráfico de visitas por mes y tabla completa como alternativa accesible.
 *
 * @param {object} props
 * @param {import('@/types/domain').MonthlyStats[]} props.stats Meses, del más antiguo al actual.
 * @returns {import('react').JSX.Element}
 */
export function StatsOverview({ stats }) {
  const current = stats.at(-1);
  const previous = stats.at(-2);

  return (
    <div className={styles.wrapper}>
      <dl className={styles.tiles}>
        {METRICS.map((metric) => {
          const value = current?.[metric] ?? 0;
          const change = previous ? percentChange(value, previous[metric]) : null;
          return (
            <div key={metric} className={styles.tile}>
              <dt className={styles.tileLabel}>{STAT_EVENT_LABELS[metric]}</dt>
              <dd className={styles.tileValue}>{value}</dd>
              {change !== null && (
                <dd className={styles.tileChange}>
                  {change >= 0 ? `${change} % más` : `${Math.abs(change)} % menos`} que el mes
                  pasado
                </dd>
              )}
            </div>
          );
        })}
      </dl>

      <MonthlyBarChart
        title="Visitas al perfil por mes"
        data={stats.map((s) => ({ label: formatMonth(s.month), value: s.view }))}
      />

      <details className={styles.details}>
        <summary>Ver la tabla de los últimos 6 meses</summary>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Mes</th>
                {METRICS.map((m) => (
                  <th key={m} scope="col">
                    {STAT_EVENT_LABELS[m]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.month}>
                  <th scope="row">{formatMonth(s.month)}</th>
                  {METRICS.map((m) => (
                    <td key={m}>{s[m]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
