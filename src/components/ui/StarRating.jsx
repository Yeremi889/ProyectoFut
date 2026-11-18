import { Star } from 'lucide-react';
import { formatRating } from '@/utils/format';
import styles from './StarRating.module.css';

const STARS = [1, 2, 3, 4, 5];

/**
 * Muestra una calificación con estrellas (solo lectura).
 *
 * @param {object} props
 * @param {number} props.value Promedio de 0 a 5.
 * @param {number} [props.count] Cantidad de reseñas; si se pasa, se muestra entre paréntesis.
 * @param {'sm' | 'md'} [props.size] Tamaño de las estrellas.
 * @returns {import('react').JSX.Element}
 */
export function StarRating({ value, count, size = 'sm' }) {
  const px = size === 'sm' ? 14 : 18;
  if (count === 0) return <span className={styles.empty}>Sin reseñas todavía</span>;

  return (
    <span className={styles.rating} aria-label={`${formatRating(value)} de 5 estrellas`}>
      <span className={styles.stars} aria-hidden="true">
        {STARS.map((n) => (
          <Star key={n} size={px} className={n <= Math.round(value) ? styles.on : styles.off} />
        ))}
      </span>
      <span className={styles.value}>{formatRating(value)}</span>
      {count !== undefined && <span className={styles.count}>({count})</span>}
    </span>
  );
}

/**
 * Selector de calificación de 1 a 5 estrellas para formularios.
 * Usa botones de opción para que funcione con teclado y lector de pantalla.
 *
 * @param {object} props
 * @param {number} props.value Calificación elegida (0 = ninguna).
 * @param {(value: number) => void} props.onChange Se llama al elegir una calificación.
 * @returns {import('react').JSX.Element}
 */
export function StarInput({ value, onChange }) {
  return (
    <div className={styles.input} role="radiogroup" aria-label="Calificación">
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          className={styles.inputStar}
          onClick={() => onChange(n)}
        >
          <Star size={28} className={n <= value ? styles.on : styles.off} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
