import { Flag, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AmenityList } from '@/components/establishment/AmenityList';
import { ContactActions } from '@/components/establishment/ContactActions';
import { CourtPriceList } from '@/components/establishment/CourtPriceList';
import { FavoriteButton } from '@/components/establishment/FavoriteButton';
import { OpenNowBadge } from '@/components/establishment/OpenNowBadge';
import { PhotoGallery } from '@/components/establishment/PhotoGallery';
import { ReportDialog } from '@/components/establishment/ReportDialog';
import { ReviewsSection } from '@/components/establishment/ReviewsSection';
import { ScheduleList } from '@/components/establishment/ScheduleList';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { StarRating } from '@/components/ui/StarRating';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import styles from './EstablishmentPage.module.css';

/**
 * Detalle público de un establecimiento (SOP F-06 a F-12).
 * Registra una visita para las estadísticas del negocio al cargarse.
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentPage() {
  const { slug = '' } = useParams();
  const {
    data: est,
    loading,
    error,
    reload,
    setData,
  } = useAsync(() => api.establishments.getBySlug(slug), [slug]);
  const [reportOpen, setReportOpen] = useState(false);
  useDocumentTitle(est?.name);

  useEffect(() => {
    if (est?.id) api.establishments.trackEvent(est.id, 'view');
  }, [est?.id]);

  if (loading && !est) return <LoadingState />;
  if (error || !est)
    return (
      <ErrorState message={error ?? 'No encontramos este establecimiento.'} onRetry={reload} />
    );

  /**
   * Actualiza la calificación mostrada tras publicar una reseña.
   * @param {{ ratingAverage: number, ratingCount: number }} rating
   */
  const handleRatingChange = (rating) => setData({ ...est, ...rating });

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <div className={styles.headline}>
          <OpenNowBadge schedule={est.schedule} />
          <h1 className={styles.name}>{est.name}</h1>
          <p className={styles.place}>
            <MapPin size={18} aria-hidden="true" />
            {est.address}, {est.canton}, {est.province}
          </p>
          <StarRating value={est.ratingAverage} count={est.ratingCount} size="md" />
        </div>
        <FavoriteButton establishmentId={est.id} />
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <PhotoGallery photos={est.photos} name={est.name} />

          {est.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Sobre el lugar</h2>
              <p className={styles.description}>{est.description}</p>
            </section>
          )}

          {est.amenityIds.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Servicios</h2>
              <AmenityList amenityIds={est.amenityIds} />
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Canchas y precios por hora</h2>
            <CourtPriceList courts={est.courts} nightRateStartsAt={est.nightRateStartsAt} />
          </section>

          <ReviewsSection establishmentId={est.id} onRatingChange={handleRatingChange} />
        </div>

        <aside className={styles.aside}>
          <div className={styles.sticky}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Contacto</h2>
              <p className={styles.hint}>
                Consulta disponibilidad y aparta directamente con el establecimiento.
              </p>
              <ContactActions establishment={est} />
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Horario</h2>
              <ScheduleList schedule={est.schedule} />
            </section>

            <button type="button" className={styles.report} onClick={() => setReportOpen(true)}>
              <Flag size={16} aria-hidden="true" /> Reportar información incorrecta
            </button>
          </div>
        </aside>
      </div>

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        establishmentId={est.id}
      />
    </div>
  );
}
