import { Badge } from '@/components/ui/Badge';

/** Etiqueta y color de cada estado de aprobación. */
const STATUS_DISPLAY = {
  draft: { label: 'Borrador', tone: 'neutral' },
  pending: { label: 'En revisión', tone: 'warning' },
  approved: { label: 'Aprobado', tone: 'success' },
  rejected: { label: 'Rechazado', tone: 'danger' },
  suspended: { label: 'Suspendido', tone: 'danger' },
};

/**
 * Etiqueta del estado de un establecimiento. Si está aprobado indica si está visible u oculto.
 *
 * @param {object} props
 * @param {import('@/types/domain').EstablishmentStatus} props.status Estado.
 * @param {boolean} [props.published] Solo se usa si el estado es "approved".
 * @returns {import('react').JSX.Element}
 */
export function StatusBadge({ status, published }) {
  if (status === 'approved' && published === false)
    return <Badge tone="neutral">Aprobado, oculto</Badge>;
  const { label, tone } = STATUS_DISPLAY[status];
  return <Badge tone={tone}>{label}</Badge>;
}
