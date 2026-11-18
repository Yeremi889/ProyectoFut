import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextAreaField } from '@/components/ui/FormField';
import { api } from '@/services';
import styles from './ReviewReplyForm.module.css';

/** Longitud máxima de una respuesta del negocio. */
const REPLY_MAX_LENGTH = 400;

/**
 * Respuesta pública del negocio a una reseña (SOP F-31). Una por reseña, editable.
 * El negocio no puede borrar reseñas; solo el administrador puede ocultarlas.
 *
 * @param {object} props
 * @param {import('@/types/domain').Review} props.review Reseña a responder.
 * @param {(review: import('@/types/domain').Review) => void} props.onSaved Recibe la reseña actualizada.
 * @returns {import('react').JSX.Element}
 */
export function ReviewReplyForm({ review, onSaved }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(review.reply?.text ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!open) {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          {review.reply ? 'Editar respuesta' : 'Responder'}
        </Button>
      </div>
    );
  }

  /** @param {import('react').FormEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setError('Escribe una respuesta.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      onSaved(await api.business.replyToReview(review.id, text));
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TextAreaField
        label="Tu respuesta pública"
        value={text}
        maxLength={REPLY_MAX_LENGTH}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <Alert tone="danger">{error}</Alert>}
      <div className={styles.actions}>
        <Button type="submit" size="sm" loading={saving}>
          Publicar respuesta
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
