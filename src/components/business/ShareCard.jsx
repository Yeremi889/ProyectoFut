import { Check, Copy, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PUBLIC_SITE_URL } from '@/config/env';
import { buildPublicUrl } from '@/utils/links';
import { slugify } from '@/utils/slug';
import styles from './ShareCard.module.css';

/** Tamaño del QR descargable, en píxeles (suficiente para imprimir en media carta). */
const QR_SIZE_PX = 1024;

/**
 * Link propio y código QR descargable del establecimiento (SOP F-28).
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento.
 * @returns {import('react').JSX.Element}
 */
export function ShareCard({ establishment }) {
  const url = buildPublicUrl(PUBLIC_SITE_URL, establishment.slug);
  const canvasWrapper = useRef(null);
  const [copied, setCopied] = useState(false);

  /** Copia el link al portapapeles y muestra la confirmación por dos segundos. */
  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /** Descarga el QR en PNG de alta resolución. */
  const downloadQr = () => {
    const canvas = canvasWrapper.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qr-${slugify(establishment.name)}.png`;
    link.click();
  };

  return (
    <div className={styles.card}>
      <div className={styles.qr}>
        <QRCodeCanvas value={url} size={168} marginSize={2} fgColor="#14221b" />
      </div>
      <div className={styles.body}>
        <p className={styles.text}>
          Imprime el código y pégalo en tu local, o comparte el link en tus redes. Lleva directo a
          tu perfil.
        </p>
        <p className={styles.url}>{url}</p>
        <div className={styles.actions}>
          <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={copyLink}>
            {copied ? 'Link copiado' : 'Copiar link'}
          </Button>
          <Button variant="secondary" size="sm" icon={Download} onClick={downloadQr}>
            Descargar QR
          </Button>
        </div>
      </div>
      {/* QR grande oculto: es el que se descarga, con calidad de impresión. */}
      <div ref={canvasWrapper} hidden>
        <QRCodeCanvas value={url} size={QR_SIZE_PX} marginSize={4} fgColor="#14221b" />
      </div>
    </div>
  );
}
