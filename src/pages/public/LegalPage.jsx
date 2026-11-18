import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { APP_NAME } from '@/constants/app';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import styles from './LegalPage.module.css';

/** Contenido provisional de cada documento legal. */
const DOCUMENTS = {
  terms: {
    title: 'Términos y condiciones',
    sections: [
      [
        'Uso de la plataforma',
        `${APP_NAME} es un directorio. Los precios, horarios y la disponibilidad los define y publica cada establecimiento.`,
      ],
      [
        'Cuentas',
        'Cada persona es responsable de la información que publica y de mantener segura su contraseña.',
      ],
      [
        'Reseñas',
        'Las reseñas deben basarse en experiencias reales. El equipo de moderación puede ocultar contenido ofensivo.',
      ],
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    sections: [
      [
        'Datos que recopilamos',
        'Nombre, correo y, para negocios, los datos del establecimiento que decidan publicar.',
      ],
      [
        'Para qué los usamos',
        'Para gestionar tu cuenta, mostrar los establecimientos y generar estadísticas de visitas.',
      ],
      [
        'Tus derechos',
        'Puedes solicitar acceso, corrección o eliminación de tus datos según la Ley 8968 de Costa Rica.',
      ],
    ],
  },
};

/**
 * Página legal (términos o privacidad). Texto provisional: pendiente de redacción oficial (SOP sección 10).
 * @param {{ document: 'terms' | 'privacy' }} props
 * @returns {import('react').JSX.Element}
 */
export function LegalPage({ document: key }) {
  const doc = DOCUMENTS[key];
  useDocumentTitle(doc.title);

  return (
    <div className={`container ${styles.page}`}>
      <PageHeader title={doc.title} />
      <Alert tone="warning" title="Texto provisional">
        Este contenido es un borrador y debe reemplazarse por el texto legal oficial antes de
        publicar el sitio.
      </Alert>
      {doc.sections.map(([heading, body]) => (
        <section key={heading} className={styles.section}>
          <h2 className={styles.heading}>{heading}</h2>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}
