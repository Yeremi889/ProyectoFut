import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EDITOR_SECTIONS } from '@/components/business/sections';
import { StatusBadge } from '@/components/business/StatusBadge';
import { SubmitForReviewPanel } from '@/components/business/SubmitForReviewPanel';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { Switch } from '@/components/ui/Switch';
import { Tabs } from '@/components/ui/Tabs';
import { ROUTES } from '@/constants/routes';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import styles from './EstablishmentEditPage.module.css';

const TABS = EDITOR_SECTIONS.map(({ id, label }) => ({ id, label }));

/**
 * Edición de un establecimiento ya registrado, por pestañas (SOP F-23 a F-27).
 * Incluye publicar/ocultar para los aprobados y reenviar a revisión para los rechazados.
 * @returns {import('react').JSX.Element}
 */
export function EstablishmentEditPage() {
  const { id = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const {
    data: est,
    loading,
    error,
    reload,
    setData,
  } = useAsync(() => api.business.getMine(id), [id]);
  const [publishError, setPublishError] = useState(null);
  useDocumentTitle(est ? `Editar ${est.name}` : 'Editar');

  const activeId = TABS.some((t) => t.id === params.get('seccion'))
    ? params.get('seccion')
    : TABS[0].id;
  const section = EDITOR_SECTIONS.find((s) => s.id === activeId) ?? EDITOR_SECTIONS[0];

  if (loading && !est) return <LoadingState />;
  if (error || !est)
    return <ErrorState message={error ?? 'No encontramos el establecimiento.'} onRetry={reload} />;

  /**
   * Publica u oculta el establecimiento (SOP F-27).
   * @param {boolean} published
   */
  const togglePublished = async (published) => {
    setPublishError(null);
    try {
      setData(await api.business.setPublished(est.id, published));
    } catch (err) {
      setPublishError(err.message);
    }
  };

  const { Editor } = section;

  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title={est.name}
        back={
          <Link to={ROUTES.businessDashboard} className={styles.back}>
            Mis establecimientos
          </Link>
        }
        description={<StatusBadge status={est.status} published={est.published} />}
        actions={
          est.status === 'approved' &&
          est.published && (
            <Button variant="secondary" icon={ExternalLink} to={ROUTES.establishment(est.slug)}>
              Ver perfil público
            </Button>
          )
        }
      />

      {est.status === 'approved' && (
        <Panel as="div">
          <Switch
            label={
              est.published
                ? 'Publicado: visible en las búsquedas'
                : 'Oculto: no aparece en las búsquedas'
            }
            checked={est.published}
            onChange={togglePublished}
          />
          {publishError && <Alert tone="danger">{publishError}</Alert>}
        </Panel>
      )}

      {est.status === 'pending' && (
        <Alert tone="warning">
          Tu establecimiento está en revisión. Puedes seguir editándolo mientras tanto.
        </Alert>
      )}
      {est.status === 'suspended' && (
        <Alert tone="danger">
          Este establecimiento fue suspendido por la administración y no aparece en las búsquedas.
        </Alert>
      )}

      {est.status === 'rejected' && (
        <Panel title="Corrige y reenvía">
          <Alert tone="danger" title="Motivo del rechazo">
            {est.rejectionReason}
          </Alert>
          <div className={styles.resubmit}>
            <SubmitForReviewPanel establishment={est} onSubmitted={setData} />
          </div>
        </Panel>
      )}

      <Tabs
        tabs={TABS}
        activeId={section.id}
        onChange={(tab) => setParams({ seccion: tab }, { replace: true })}
        label="Secciones"
      />

      <Panel>
        <p className={styles.description}>{section.description}</p>
        <Editor
          key={section.id}
          establishment={est}
          onSaved={setData}
          submitLabel="Guardar cambios"
        />
      </Panel>
    </div>
  );
}
