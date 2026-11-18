import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { INFO_REPORT_REASON_LABELS } from '@/constants/catalogs';
import { api } from '@/services';
import styles from './ReportDialog.module.css';

const REASON_OPTIONS = Object.entries(INFO_REPORT_REASON_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/**
 * Ventana para reportar información incorrecta o una reseña ofensiva (SOP F-12).
 * No requiere cuenta. El reporte llega a la bandeja del administrador.
 *
 * @param {object} props
 * @param {boolean} props.open Si la ventana está abierta.
 * @param {() => void} props.onClose Cierra la ventana.
 * @param {string} props.establishmentId Establecimiento reportado.
 * @param {string} [props.reviewId] Si se pasa, se reporta esa reseña como ofensiva.
 * @returns {import('react').JSX.Element}
 */
export function ReportDialog({ open, onClose, establishmentId, reviewId }) {
  const isReview = Boolean(reviewId);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  /** Limpia el formulario al cerrar. */
  const handleClose = () => {
    setReason('');
    setComment('');
    setSent(false);
    setError(null);
    onClose();
  };

  /**
   * Envía el reporte.
   * @param {import('react').FormEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isReview && !reason) {
      setError('Elige un motivo.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await api.reports.create({
        establishmentId,
        reviewId,
        reason: isReview ? 'offensive' : reason,
        comment,
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isReview ? 'Reportar reseña' : 'Reportar información incorrecta'}
    >
      {sent ? (
        <div className={styles.stack}>
          <Alert tone="success" title="Reporte enviado">
            Gracias. El equipo de moderación lo revisará.
          </Alert>
          <Button onClick={handleClose}>Cerrar</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.stack}>
          {isReview ? (
            <p>Cuéntanos por qué esta reseña es ofensiva o no corresponde.</p>
          ) : (
            <SelectField
              label="¿Qué está mal?"
              placeholder="Elige un motivo"
              options={REASON_OPTIONS}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error && !reason ? error : null}
            />
          )}
          <TextAreaField
            label="Comentario (opcional)"
            value={comment}
            maxLength={300}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && reason && <Alert tone="danger">{error}</Alert>}
          <Button type="submit" loading={sending}>
            Enviar reporte
          </Button>
        </form>
      )}
    </Modal>
  );
}
