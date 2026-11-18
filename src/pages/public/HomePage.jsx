import { SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EstablishmentGrid } from '@/components/establishment/EstablishmentGrid';
import { FilterBar } from '@/components/search/FilterBar';
import { SearchHero } from '@/components/search/SearchHero';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGeolocation } from '@/hooks/useGeolocation';
import { api } from '@/services';
import { pluralize } from '@/utils/format';
import { filtersFromParams, filtersToParams } from '@/utils/searchParams';
import styles from './HomePage.module.css';

/**
 * Página de inicio: buscador, filtros rápidos, orden y listado (SOP F-01 a F-05).
 * Los filtros viven en la URL para poder compartir la búsqueda.
 * @returns {import('react').JSX.Element}
 */
export function HomePage() {
  useDocumentTitle();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const geo = useGeolocation();
  const [locationMessage, setLocationMessage] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => api.establishments.search({ ...filters, near: geo.location ?? undefined }),
    [params, geo.location],
  );

  /**
   * Combina cambios con los filtros actuales y los escribe en la URL.
   * Si se elige ordenar por cercanía, pide la ubicación primero.
   * @param {Partial<import('@/types/api').SearchFilters>} changes
   */
  const updateFilters = async (changes) => {
    if (changes.sortBy === 'distance' && !geo.location) {
      const point = await geo.request();
      if (!point) {
        setLocationMessage('No pudimos obtener tu ubicación. Revisa el permiso del navegador.');
        return;
      }
    }
    setLocationMessage(null);
    setParams(filtersToParams({ ...filters, ...changes }), { replace: true });
  };

  const hasFilters = Boolean(filters.query || filters.courtTypes?.length || filters.roofedOnly);

  return (
    <>
      <SearchHero
        key={filters.query}
        query={filters.query ?? ''}
        onSearch={(query) => updateFilters({ query })}
      />

      <section className="container" aria-labelledby="results-title">
        <FilterBar filters={filters} onChange={updateFilters} locationMessage={locationMessage} />

        <h2 id="results-title" className={styles.count}>
          {loading
            ? 'Buscando canchas'
            : pluralize(data?.length ?? 0, 'establecimiento', 'establecimientos')}
        </h2>

        {loading && !data && <LoadingState label="Buscando canchas..." />}
        {error && <ErrorState message={error} onRetry={reload} />}

        {data && data.length === 0 && !loading && (
          <EmptyState
            icon={SearchX}
            title="No hay canchas con esos filtros"
            description="Prueba con otra zona o quita algunos filtros para ver más resultados."
            action={
              hasFilters && (
                <Button variant="secondary" onClick={() => setParams({}, { replace: true })}>
                  Quitar filtros
                </Button>
              )
            }
          />
        )}

        {data && data.length > 0 && <EstablishmentGrid items={data} dimmed={loading} />}
      </section>
    </>
  );
}
