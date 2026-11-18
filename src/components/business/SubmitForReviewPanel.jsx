import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { api } from '@/services';
import { computeCompleteness } from '@/utils/completeness';
import { EstablishmentPreview } from './EstablishmentPreview';
import styles from './SubmitForReviewPanel.module.css';

/**
 * Revisión final del registro: vista previa del perfil, sugerencias de lo que falta
 * y botón para enviar a aprobación del administrador (SOP F-21, paso 6).
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a enviar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSubmitted Se llama tras enviarlo.
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional (por ejemplo, "Atrás").
 * @returns {import('react').JSX.Element}
 */
export function SubmitForReviewPanel({ establishment, onSubmitted, secondaryAction }) {
  const { percent, missing } = computeCompleteness(establishment);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const isResubmission = establishment.status === 'rejected';

  /** Envía el establecimiento a revisión. */
  const handleSubmit = async () => {
    setSending(true);
    setError(null);
    try {
      onSubmitted(await api.business.submitForReview(establishment.id));
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.progress}>
        <p className={styles.percent}>Tu perfil está completo al {percent} %</p>
        <ProgressBar value={percent} label={`Perfil completo al ${percent} %`} />
        {missing.length > 0 && (
          <ul className={styles.missing}>
            {missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <section aria-labelledby="preview-title" className={styles.preview}>
        <h3 id="preview-title" className={styles.previewTitle}>
          <Eye size={18} aria-hidden="true" /> Así lo verán los jugadores
        </h3>
        <EstablishmentPreview establishment={establishment} />
      </section>

      <Alert tone="info">
        El equipo revisará tu establecimiento antes de publicarlo. Mientras tanto puedes seguir
        editándolo.
      </Alert>
      {error && <Alert tone="danger">{error}</Alert>}

      <div className={styles.actions}>
        {secondaryAction}
        <Button onClick={handleSubmit} loading={sending}>
          {isResubmission ? 'Reenviar a revisión' : 'Enviar a revisión'}
        </Button>
      </div>
    </div>
  );
}
