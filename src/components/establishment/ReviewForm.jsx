import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextAreaField } from '@/components/ui/FormField';
import { StarInput } from '@/components/ui/StarRating';
import { REVIEW_COMMENT_MAX_LENGTH } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services';
import styles from './ReviewForm.module.css';

/**
 * Formulario para dejar o editar la reseña del jugador (SOP F-10).
 * Si no hay sesión de jugador, invita a iniciar sesión o crear cuenta.
 *
 * @param {object} props
 * @param {string} props.establishmentId Establecimiento reseñado.
 * @param {import('@/types/domain').Review | undefined} props.existing Reseña previa del jugador, si existe.
 * @param {(review: import('@/types/domain').Review) => void} props.onSaved Se llama al guardar.
 * @returns {import('react').JSX.Element | null}
 */
export function ReviewForm({ establishmentId, existing, onSaved }) {
  const { user } = useAuth();
  const location = useLocation();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className={styles.invite}>
        <p>Para dejar una reseña necesitas una cuenta de jugador. Es gratis.</p>
        <div className={styles.inviteActions}>
          <Button size="sm" to={ROUTES.login} state={{ from: location.pathname }}>
            Iniciar sesión
          </Button>
          <Link to={ROUTES.register}>Crear cuenta</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'player') return null;

  /**
   * Valida y guarda la reseña.
   * @param {import('react').FormEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating === 0) {
      setError('Elige de 1 a 5 estrellas.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const review = await api.reviews.upsert(establishmentId, { rating, comment });
      setSaved(true);
      onSaved(review);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>{existing ? 'Edita tu reseña' : 'Deja tu reseña'}</h3>
      <StarInput value={rating} onChange={setRating} />
      <TextAreaField
        label="Comentario"
        value={comment}
        maxLength={REVIEW_COMMENT_MAX_LENGTH}
        onChange={(e) => {
          setComment(e.target.value);
          setSaved(false);
        }}
        placeholder="¿Cómo estuvo la cancha, la iluminación, la atención?"
      />
      {error && <Alert tone="danger">{error}</Alert>}
      {saved && <Alert tone="success">Reseña guardada.</Alert>}
      <div>
        <Button type="submit" loading={saving}>
          {existing ? 'Guardar cambios' : 'Publicar reseña'}
        </Button>
      </div>
    </form>
  );
}
