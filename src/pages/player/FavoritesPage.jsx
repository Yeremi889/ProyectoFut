import { Heart } from 'lucide-react';
import { EstablishmentGrid } from '@/components/establishment/EstablishmentGrid';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';

/**
 * Lista de establecimientos guardados por el jugador (SOP F-11).
 * @returns {import('react').JSX.Element}
 */
export function FavoritesPage() {
  useDocumentTitle('Mis favoritos');
  const { data, loading, error, reload } = useAsync(() => api.favorites.list(), []);

  return (
    <div className="container">
      <PageHeader
        title="Mis favoritos"
        description="Las canchas que guardaste para encontrarlas rápido."
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && data.length === 0 && (
        <EmptyState
          icon={Heart}
          title="Todavía no tienes favoritos"
          description="En el detalle de cualquier establecimiento toca Guardar en favoritos."
          action={<Button to={ROUTES.home}>Buscar canchas</Button>}
        />
      )}
      {data && data.length > 0 && <EstablishmentGrid items={data} />}
    </div>
  );
}
