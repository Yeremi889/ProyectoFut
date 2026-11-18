import { useState } from 'react';
import formStyles from '@/components/layout/Form.module.css';
import { Button } from '@/components/ui/Button';
import { TextAreaField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';

/**
 * Ventana para rechazar un establecimiento con un motivo que verá el negocio (SOP F-40).
 *
 * @param {object} props
 * @param {{ id: string, name: string } | null} props.target Establecimiento a rechazar; null = cerrada.
 * @param {() => void} props.onClose Cierra la ventana.
 * @param {(id: string, reason: string) => Promise<void>} props.onConfirm Rechaza.
 * @returns {import('react').JSX.Element}
 */
export function RejectDialog({ target, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  /** Limpia y cierra. */
  const close = () => {
    setReason('');
    setError(null);
    onClose();
  };

  /** @param {import('react').FormEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!reason.trim()) {
      setError('Escribe el motivo para que el negocio sepa qué corregir.');
      return;
    }
    setSending(true);
    try {
      await onConfirm(target.id, reason);
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={Boolean(target)} onClose={close} title={`Rechazar ${target?.name ?? ''}`}>
      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <TextAreaField
          label="Motivo del rechazo"
          hint="Ejemplo: Las fotos no corresponden a canchas de fútbol."
          value={reason}
          maxLength={400}
          onChange={(e) => setReason(e.target.value)}
          error={error}
        />
        <div className={formStyles.actions}>
          <Button type="submit" variant="danger" loading={sending}>
            Rechazar
          </Button>
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
