import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EDITOR_SECTIONS } from '@/components/business/sections';
import { SubmitForReviewPanel } from '@/components/business/SubmitForReviewPanel';
import { WizardStepper } from '@/components/business/WizardStepper';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import styles from './EstablishmentWizardPage.module.css';

const STEP_LABELS = EDITOR_SECTIONS.map((s) => s.label);
const LAST_STEP = EDITOR_SECTIONS.length - 1;

/**
 * Asistente de registro de seis pasos (SOP F-21 y sección 4).
 * Cada paso guarda al continuar; el paso actual queda en la URL (?paso=) para poder volver.
 * Al terminar el último paso se muestra la revisión final con el envío a aprobación.
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentWizardPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const {
    data: est,
    loading,
    error,
    reload,
    setData,
  } = useAsync(() => api.business.getMine(id), [id]);
  const [reviewing, setReviewing] = useState(false);
  useDocumentTitle(est ? `Registro de ${est.name}` : 'Registro');

  const step = Math.min(Math.max(Number(params.get('paso') ?? 1) - 1, 0), LAST_STEP);

  if (loading && !est) return <LoadingState />;
  if (error || !est)
    return <ErrorState message={error ?? 'No encontramos el establecimiento.'} onRetry={reload} />;

  /**
   * Cambia de paso y lo guarda en la URL.
   * @param {number} index
   */
  const goTo = (index) => {
    setReviewing(false);
    setParams({ paso: String(index + 1) });
  };

  /**
   * Guarda el resultado del paso y avanza (o abre la revisión final).
   * @param {import('@/types/domain').Establishment} updated
   */
  const handleSaved = (updated) => {
    setData(updated);
    if (step === LAST_STEP) setReviewing(true);
    else goTo(step + 1);
  };

  const section = EDITOR_SECTIONS[step];
  const { Editor } = section;
  const back = step > 0 && (
    <Button variant="ghost" onClick={() => goTo(step - 1)}>
      Atrás
    </Button>
  );

  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title={est.name}
        description="Completa los seis pasos y envía tu establecimiento a revisión."
        back={
          <Link to={ROUTES.businessDashboard} className={styles.exit}>
            Guardar y salir
          </Link>
        }
      />

      {est.status === 'rejected' && est.rejectionReason && (
        <Alert tone="danger" title="Tu establecimiento fue rechazado">
          {est.rejectionReason} Corrige lo indicado y vuelve a enviarlo.
        </Alert>
      )}

      <WizardStepper steps={STEP_LABELS} current={step} onSelect={goTo} />

      <Panel title={reviewing ? 'Revisión final' : section.label}>
        {reviewing ? (
          <SubmitForReviewPanel
            establishment={est}
            onSubmitted={() => navigate(ROUTES.businessDashboard, { replace: true })}
            secondaryAction={
              <Button variant="ghost" onClick={() => setReviewing(false)}>
                Atrás
              </Button>
            }
          />
        ) : (
          <>
            <p className={styles.description}>{section.description}</p>
            <Editor
              key={section.id}
              establishment={est}
              onSaved={handleSaved}
              submitLabel={step === LAST_STEP ? 'Guardar y revisar' : 'Guardar y continuar'}
              requireOne
              secondaryAction={back}
            />
          </>
        )}
      </Panel>
    </div>
  );
}
