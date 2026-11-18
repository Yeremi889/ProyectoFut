import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import styles from './AdminMetricsPage.module.css';

/**
 * Lista de términos de búsqueda con su cantidad.
 * @param {{ items: { term: string, count: number }[], empty: string }} props
 * @returns {import('react').JSX.Element}
 */
function TermList({ items, empty }) {
  if (items.length === 0) return <p className={styles.empty}>{empty}</p>;
  return (
    <ol className={styles.terms}>
      {items.map((item) => (
        <li key={item.term} className={styles.term}>
          <span>{item.term}</span>
          <span className={styles.termCount}>{item.count}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Métricas generales de la plataforma (SOP F-44).
 * Las zonas buscadas sin resultados indican dónde conviene conseguir negocios.
 * @returns {import('react').JSX.Element}
 */
export function AdminMetricsPage() {
  useDocumentTitle('Métricas');
  const { data, loading, error, reload } = useAsync(() => api.admin.getMetrics(), []);

  return (
    <div className="container page-stack">
      <PageHeader title="Métricas" description="Cómo se está usando la plataforma." />
      {loading && !data && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <>
          <dl className={styles.tiles}>
            <div className={styles.tile}>
              <dt>Establecimientos activos</dt>
              <dd>{data.activeEstablishments}</dd>
            </div>
            <div className={styles.tile}>
              <dt>Esperando aprobación</dt>
              <dd>{data.pendingEstablishments}</dd>
            </div>
            <div className={styles.tile}>
              <dt>Visitas a perfiles en 30 días</dt>
              <dd>{data.totalViewsLast30Days}</dd>
            </div>
          </dl>
          <div className={styles.columns}>
            <Panel title="Búsquedas más frecuentes">
              <TermList items={data.topSearches} empty="Todavía no hay búsquedas registradas." />
            </Panel>
            <Panel title="Búsquedas sin resultados">
              <TermList
                items={data.searchesWithoutResults}
                empty="Todas las búsquedas encontraron canchas."
              />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
