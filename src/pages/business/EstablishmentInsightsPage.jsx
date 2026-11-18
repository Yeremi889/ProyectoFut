import { Link, useParams } from 'react-router-dom';
import { ReviewReplyForm } from '@/components/business/ReviewReplyForm';
import { ShareCard } from '@/components/business/ShareCard';
import { StatsOverview } from '@/components/business/StatsOverview';
import { ReviewItem } from '@/components/establishment/ReviewItem';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import styles from './EstablishmentInsightsPage.module.css';

/**
 * Resumen del establecimiento para el negocio: link y QR, estadísticas y reseñas con respuesta
 * (SOP F-28, F-29 y F-31).
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentInsightsPage() {
  const { id = '' } = useParams();
  const { data, loading, error, reload, setData } = useAsync(async () => {
    const [establishment, stats, reviews] = await Promise.all([
      api.business.getMine(id),
      api.business.getStats(id),
      api.business.listReviews(id),
    ]);
    return { establishment, stats, reviews };
  }, [id]);
  useDocumentTitle(data ? `Resumen de ${data.establishment.name}` : 'Resumen');

  if (loading && !data) return <LoadingState />;
  if (error || !data)
    return <ErrorState message={error ?? 'No se pudo cargar el resumen.'} onRetry={reload} />;

  const { establishment, stats, reviews } = data;

  /**
   * Reemplaza una reseña tras responderla.
   * @param {import('@/types/domain').Review} updated
   */
  const handleReplySaved = (updated) =>
    setData({ ...data, reviews: reviews.map((r) => (r.id === updated.id ? updated : r)) });

  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title={establishment.name}
        description="Cómo te encuentran los jugadores y qué opinan."
        back={
          <Link to={ROUTES.businessDashboard} className={styles.back}>
            Mis establecimientos
          </Link>
        }
      />

      <Panel title="Tu link y código QR">
        <ShareCard establishment={establishment} />
      </Panel>

      <Panel title="Estadísticas">
        <StatsOverview stats={stats} />
      </Panel>

      <Panel title="Reseñas">
        {reviews.length === 0 ? (
          <p className={styles.empty}>
            Todavía no tienes reseñas. Comparte tu link para que tus clientes opinen.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id}>
              {review.hidden && <Badge tone="danger">Ocultada por moderación</Badge>}
              <ReviewItem
                review={review}
                footer={<ReviewReplyForm review={review} onSaved={handleReplySaved} />}
              />
            </div>
          ))
        )}
      </Panel>
    </div>
  );
}
