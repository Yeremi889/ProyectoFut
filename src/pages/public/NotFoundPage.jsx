import { MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/StateMessage';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Página para rutas que no existen.
 * @returns {import('react').JSX.Element}
 */
export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');
  return (
    <div className="container">
      <EmptyState
        icon={MapPinOff}
        title="Esta página no existe"
        description="Puede que el enlace esté mal escrito o que el establecimiento ya no esté disponible."
        action={<Button to={ROUTES.home}>Ir a buscar canchas</Button>}
      />
    </div>
  );
}
