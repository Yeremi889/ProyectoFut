import { Badge } from '@/components/ui/Badge';
import { isOpenNow } from '@/utils/schedule';

/**
 * Etiqueta "Abierto ahora" o "Cerrado ahora", calculada con el horario y la hora de Costa Rica
 * (SOP F-05). No requiere ninguna acción del negocio.
 *
 * @param {object} props
 * @param {import('@/types/domain').DaySchedule[]} props.schedule Horario semanal.
 * @returns {import('react').JSX.Element}
 */
export function OpenNowBadge({ schedule }) {
  return isOpenNow(schedule) ? (
    <Badge tone="success">Abierto ahora</Badge>
  ) : (
    <Badge tone="neutral">Cerrado ahora</Badge>
  );
}
