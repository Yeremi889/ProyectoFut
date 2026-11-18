import { useState } from 'react';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services';
import { ReportDialog } from './ReportDialog';
import { ReviewForm } from './ReviewForm';
import { ReviewItem } from './ReviewItem';
import styles from './ReviewsSection.module.css';

/**
 * Sección de reseñas del detalle: formulario del jugador y lista de reseñas (SOP F-10).
 *
 * @param {object} props
 * @param {string} props.establishmentId Establecimiento.
 * @param {(rating: { ratingAverage: number, ratingCount: number }) => void} props.onRatingChange
 *   Avisa a la página el nuevo promedio después de publicar una reseña.
 * @returns {import('react').JSX.Element}
 */
export function ReviewsSection({ establishmentId, onRatingChange }) {
  const { user } = useAuth();
  const {
    data: reviews,
    loading,
    error,
    reload,
    setData,
  } = useAsync(() => api.reviews.list(establishmentId), [establishmentId]);
  const [reported, setReported] = useState(null);
  const mine = reviews?.find((r) => r.userId === user?.id);

  /**
   * Reemplaza o agrega la reseña guardada y recalcula el promedio mostrado.
   * @param {import('@/types/domain').Review} saved
   */
  const handleSaved = (saved) => {
    const next = [saved, ...(reviews ?? []).filter((r) => r.id !== saved.id)];
    setData(next);
    onRatingChange({
      ratingAverage: next.reduce((sum, r) => sum + r.rating, 0) / next.length,
      ratingCount: next.length,
    });
  };

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <h2 id="reviews-title" className={styles.title}>
        Reseñas
      </h2>

      <ReviewForm
        key={mine?.id ?? 'new'}
        establishmentId={establishmentId}
        existing={mine}
        onSaved={handleSaved}
      />

      {loading && !reviews && <LoadingState label="Cargando reseñas..." />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {reviews && reviews.length === 0 && (
        <p className={styles.empty}>
          Todavía no hay reseñas. Si ya jugaste aquí, cuéntanos cómo te fue.
        </p>
      )}

      <div>
        {reviews?.map((review) => (
          <ReviewItem key={review.id} review={review} onReport={setReported} />
        ))}
      </div>

      <ReportDialog
        open={Boolean(reported)}
        onClose={() => setReported(null)}
        establishmentId={establishmentId}
        reviewId={reported?.id}
      />
    </section>
  );
}
