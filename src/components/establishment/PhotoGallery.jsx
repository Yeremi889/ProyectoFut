import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import styles from './PhotoGallery.module.css';

/**
 * Galería de fotos: una foto grande y miniaturas para cambiarla.
 * La primera foto mostrada es la portada.
 *
 * @param {object} props
 * @param {import('@/types/domain').Photo[]} props.photos Fotos en el orden elegido por el negocio.
 * @param {string} props.name Nombre del establecimiento (para los textos alternativos).
 * @returns {import('react').JSX.Element}
 */
export function PhotoGallery({ photos, name }) {
  const ordered = [...photos].sort((a, b) => Number(b.isCover) - Number(a.isCover));
  const [index, setIndex] = useState(0);

  if (ordered.length === 0) {
    return <div className={styles.placeholder}>Este establecimiento todavía no tiene fotos.</div>;
  }

  const current = ordered[index] ?? ordered[0];
  const hasMany = ordered.length > 1;

  /**
   * Avanza o retrocede una foto, dando la vuelta al llegar al final.
   * @param {-1 | 1} step Dirección.
   */
  const go = (step) => setIndex((i) => (i + step + ordered.length) % ordered.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <img
          src={current.url}
          alt={`${name}, foto ${index + 1} de ${ordered.length}`}
          className={styles.main}
        />
        {hasMany && (
          <>
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={() => go(-1)}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={() => go(1)}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {hasMany && (
        <div className={styles.thumbs}>
          {ordered.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
            >
              <img src={photo.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
