import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/business/StatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import { formatRating } from '@/utils/format';

/**
 * Lista de todos los establecimientos con opción de suspender o reactivar (SOP F-42).
 * @returns {import('react').JSX.Element}
 */
export function AdminEstablishmentsPage() {
  useDocumentTitle('Establecimientos');
  const { data, loading, error, reload } = useAsync(() => api.admin.listAllEstablishments(), []);
  const [actionError, setActionError] = useState(null);

  /**
   * Suspende o reactiva, después de confirmar.
   * @param {import('@/types/domain').Establishment} est
   * @param {'approved' | 'suspended'} status
   */
  const changeStatus = async (est, status) => {
    const verb = status === 'suspended' ? 'suspender' : 'reactivar';
    if (!window.confirm(`¿Seguro que quieres ${verb} ${est.name}?`)) return;
    setActionError(null);
    try {
      await api.admin.setStatus(est.id, status);
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="container page-stack">
      <PageHeader
        title="Establecimientos"
        description="Todos los establecimientos registrados, en cualquier estado."
      />
      {actionError && <Alert tone="danger">{actionError}</Alert>}
      <Panel>
        {loading && !data && <LoadingState />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && (
          <DataTable
            caption="Establecimientos registrados"
            rows={data}
            rowKey={(e) => e.id}
            columns={[
              {
                key: 'name',
                header: 'Nombre',
                render: (e) =>
                  e.status === 'approved' && e.published ? (
                    <Link to={ROUTES.establishment(e.slug)}>{e.name}</Link>
                  ) : (
                    e.name
                  ),
              },
              {
                key: 'place',
                header: 'Ubicación',
                render: (e) => (e.canton ? `${e.canton}, ${e.province}` : 'Sin definir'),
              },
              {
                key: 'status',
                header: 'Estado',
                render: (e) => <StatusBadge status={e.status} published={e.published} />,
              },
              { key: 'courts', header: 'Canchas', align: 'right', render: (e) => e.courts.length },
              {
                key: 'rating',
                header: 'Calificación',
                align: 'right',
                render: (e) => (e.ratingCount ? formatRating(e.ratingAverage) : 'Sin reseñas'),
              },
              {
                key: 'actions',
                header: 'Acciones',
                render: (e) =>
                  e.status === 'approved' ? (
                    <Button size="sm" variant="danger" onClick={() => changeStatus(e, 'suspended')}>
                      Suspender
                    </Button>
                  ) : e.status === 'suspended' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => changeStatus(e, 'approved')}
                    >
                      Reactivar
                    </Button>
                  ) : null,
              },
            ]}
          />
        )}
      </Panel>
    </div>
  );
}
