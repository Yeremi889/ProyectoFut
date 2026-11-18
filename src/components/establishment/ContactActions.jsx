import { MessageCircle, Navigation, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/constants/app';
import { api } from '@/services';
import {
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from '@/utils/links';
import styles from './ContactActions.module.css';

/**
 * Acciones principales del detalle: WhatsApp, Waze y Google Maps (SOP F-07 y F-08).
 * Cada toque se registra para las estadísticas del negocio (SOP F-29).
 * En celular se muestran fijas en la parte inferior de la pantalla.
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento.
 * @returns {import('react').JSX.Element}
 */
export function ContactActions({ establishment: e }) {
  const address = `${e.address}, ${e.canton}, ${e.province}, Costa Rica`;
  const whatsappUrl = e.whatsapp
    ? buildWhatsAppUrl(e.whatsapp, buildWhatsAppMessage(e.name, APP_NAME))
    : null;

  /**
   * Registra el evento sin bloquear la apertura del link.
   * @param {'whatsapp' | 'directions'} type Tipo de evento.
   */
  const track = (type) => {
    api.establishments.trackEvent(e.id, type);
  };

  return (
    <div className={styles.bar}>
      {whatsappUrl ? (
        <Button
          variant="whatsapp"
          href={whatsappUrl}
          icon={MessageCircle}
          onClick={() => track('whatsapp')}
          block
        >
          Escribir por WhatsApp
        </Button>
      ) : (
        e.phone && (
          <Button href={`tel:${e.phone}`} icon={Phone} block>
            Llamar
          </Button>
        )
      )}
      <div className={styles.maps}>
        <Button
          variant="secondary"
          href={buildWazeUrl(e.location, address)}
          icon={Navigation}
          onClick={() => track('directions')}
          block
        >
          Waze
        </Button>
        <Button
          variant="secondary"
          href={buildGoogleMapsUrl(e.location, address)}
          icon={Navigation}
          onClick={() => track('directions')}
          block
        >
          Google Maps
        </Button>
      </div>
    </div>
  );
}
