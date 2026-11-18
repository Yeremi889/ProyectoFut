import { Building2, ChartColumn, Pencil, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/business/StatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import { computeCompleteness } from '@/utils/completeness';
import styles from './BusinessDashboardPage.module.css';

/**
 * Panel principal del negocio: sus establecimientos (sucursales) y su estado (SOP F-22).
 * @returns {import('react').JSX.Element}
 */
export function BusinessDashboardPage() {
  useDocumentTitle('Mis establecimientos');
  const { data, loading, error, reload } = useAsync(() => api.business.listMine(), []);

  return (
    <div className="container">
      <PageHeader
        title="Mis establecimientos"
        description="Administra la información, canchas y fotos de cada sucursal."
        actions={
          <Button icon={Plus} to={ROUTES.businessNew}>
            Agregar establecimiento
          </Button>
        }
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && data.length === 0 && (
        <EmptyState
          icon={Building2}
          title="Registra tu primer establecimiento"
          description="En seis pasos cortos tendrás tu perfil listo para enviar a revisión."
          action={<Button to={ROUTES.businessNew}>Empezar</Button>}
        />
      )}

      <div className={styles.list}>
        {data?.map((est) => {
          const { percent } = computeCompleteness(est);
          const inProgress = est.status === 'draft';
          return (
            <article key={est.id} className={styles.item}>
              <div className={styles.info}>
                <StatusBadge status={est.status} published={est.published} />
                <h2 className={styles.name}>{est.name}</h2>
                <p className={styles.place}>
                  {est.canton ? `${est.canton}, ${est.province}` : 'Ubicación pendiente'}
                </p>
                {est.status === 'rejected' && est.rejectionReason && (
                  <p className={styles.rejection}>Motivo del rechazo: {est.rejectionReason}</p>
                )}
              </div>

              <div className={styles.progress}>
                <p className={styles.progressLabel}>Perfil completo al {percent} %</p>
                <ProgressBar value={percent} label={`Perfil completo al ${percent} %`} />
              </div>

              <div className={styles.actions}>
                {inProgress ? (
                  <Button to={ROUTES.businessWizard(est.id)}>Continuar registro</Button>
                ) : (
                  <>
                    <Button variant="secondary" icon={Pencil} to={ROUTES.businessEdit(est.id)}>
                      Editar
                    </Button>
                    <Button
                      variant="secondary"
                      icon={ChartColumn}
                      to={ROUTES.businessInsights(est.id)}
                    >
                      Estadísticas y reseñas
                    </Button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
