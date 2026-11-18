import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { RejectDialog } from '@/components/admin/RejectDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { INFO_REPORT_REASON_LABELS } from '@/constants/catalogs';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';
import { formatDate } from '@/utils/format';
import styles from './AdminModerationPage.module.css';

/**
 * Bandeja de moderación (SOP F-40 y F-41): establecimientos pendientes y reportes abiertos.
 * @returns {import('react').JSX.Element}
 */
export function AdminModerationPage() {
  useDocumentTitle('Moderación');
  const pending = useAsync(() => api.admin.listPending(), []);
  const reports = useAsync(() => api.admin.listOpenReports(), []);
  const [rejecting, setRejecting] = useState(null);
  const [actionError, setActionError] = useState(null);

  /**
   * Ejecuta una acción y recarga la lista afectada.
   * @param {() => Promise<void>} action
   * @param {() => Promise<void>} refresh
   */
  const run = async (action, refresh) => {
    setActionError(null);
    try {
      await action();
      await refresh();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title="Moderación"
        description="Revisa los establecimientos nuevos y los reportes de los usuarios."
      />
      {actionError && <Alert tone="danger">{actionError}</Alert>}

      <Panel title="Establecimientos por aprobar">
        {pending.loading && !pending.data && <LoadingState />}
        {pending.error && <ErrorState message={pending.error} onRetry={pending.reload} />}
        {pending.data?.length === 0 && (
          <p className={styles.empty}>No hay establecimientos esperando revisión.</p>
        )}
        {pending.data && pending.data.length > 0 && (
          <DataTable
            caption="Establecimientos por aprobar"
            rows={pending.data}
            rowKey={(r) => r.id}
            columns={[
              { key: 'name', header: 'Establecimiento', render: (r) => <strong>{r.name}</strong> },
              { key: 'owner', header: 'Responsable', render: (r) => r.ownerName },
              { key: 'place', header: 'Ubicación', render: (r) => `${r.canton}, ${r.province}` },
              { key: 'date', header: 'Enviado', render: (r) => formatDate(r.submittedAt) },
              {
                key: 'actions',
                header: 'Acciones',
                render: (r) => (
                  <div className={styles.actions}>
                    <Button
                      size="sm"
                      icon={Check}
                      onClick={() => run(() => api.admin.approve(r.id), pending.reload)}
                    >
                      Aprobar
                    </Button>
                    <Button size="sm" variant="danger" icon={X} onClick={() => setRejecting(r)}>
                      Rechazar
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Panel>

      <Panel title="Reportes abiertos">
        {reports.loading && !reports.data && <LoadingState />}
        {reports.error && <ErrorState message={reports.error} onRetry={reports.reload} />}
        {reports.data?.length === 0 && <p className={styles.empty}>No hay reportes pendientes.</p>}
        <div className={styles.reports}>
          {reports.data?.map((report) => (
            <article key={report.id} className={styles.report}>
              <header className={styles.reportHeader}>
                <Badge tone={report.kind === 'review' ? 'danger' : 'warning'}>
                  {report.kind === 'review' ? 'Reseña ofensiva' : 'Información incorrecta'}
                </Badge>
                <span className={styles.date}>{formatDate(report.createdAt)}</span>
              </header>
              <p className={styles.reportTitle}>
                {report.establishmentName}
                {report.kind === 'info' && `: ${INFO_REPORT_REASON_LABELS[report.reason]}`}
              </p>
              {report.reviewComment && (
                <blockquote className={styles.quote}>{report.reviewComment}</blockquote>
              )}
              {report.comment && <p className={styles.comment}>Comentario: {report.comment}</p>}
              <div className={styles.actions}>
                {report.kind === 'review' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      run(() => api.admin.resolveReport(report.id, 'hide-review'), reports.reload)
                    }
                  >
                    Ocultar reseña
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      run(
                        () => api.admin.resolveReport(report.id, 'notify-business'),
                        reports.reload,
                      )
                    }
                  >
                    Pedir corrección al negocio
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    run(() => api.admin.resolveReport(report.id, 'dismiss'), reports.reload)
                  }
                >
                  Descartar
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <RejectDialog
        target={rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={async (id, reason) => {
          await api.admin.reject(id, reason);
          await pending.reload();
        }}
      />
    </div>
  );
}
