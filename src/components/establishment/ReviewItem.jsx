import { Flag } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/utils/format';
import styles from './ReviewItem.module.css';

/**
 * Una reseña con su respuesta del negocio, si la tiene.
 *
 * @param {object} props
 * @param {import('@/types/domain').Review} props.review Reseña.
 * @param {(review: import('@/types/domain').Review) => void} [props.onReport] Si se pasa, muestra "Reportar".
 * @param {import('react').ReactNode} [props.footer] Contenido extra al final (por ejemplo, el formulario de respuesta del negocio).
 * @returns {import('react').JSX.Element}
 */
export function ReviewItem({ review, onReport, footer }) {
  return (
    <article className={styles.review}>
      <header className={styles.header}>
        <div>
          <p className={styles.author}>{review.userName}</p>
          <p className={styles.date}>{formatDate(review.updatedAt)}</p>
        </div>
        <StarRating value={review.rating} />
      </header>

      {review.comment && <p className={styles.comment}>{review.comment}</p>}

      {review.reply && (
        <div className={styles.reply}>
          <p className={styles.replyLabel}>Respuesta del establecimiento</p>
          <p>{review.reply.text}</p>
        </div>
      )}

      {onReport && (
        <button type="button" className={styles.report} onClick={() => onReport(review)}>
          <Flag size={14} aria-hidden="true" /> Reportar reseña
        </button>
      )}

      {footer}
    </article>
  );
}
