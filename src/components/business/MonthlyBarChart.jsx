import { useState } from 'react';
import styles from './MonthlyBarChart.module.css';

/** Medidas internas del gráfico (unidades del viewBox del SVG). */
const WIDTH = 960;
const HEIGHT = 200;
const PADDING = { top: 28, right: 8, bottom: 30, left: 8 };
/** Ancho máximo de cada barra: barras delgadas, el espacio sobrante queda entre ellas. */
const MAX_BAR_WIDTH = 56;

/**
 * Gráfico de barras de una sola serie (un valor por mes), dibujado en SVG sin librerías.
 * Muestra el valor al pasar el mouse o enfocar una barra, y siempre el del último mes.
 *
 * @param {object} props
 * @param {string} props.title Qué mide el gráfico (también es el nombre accesible).
 * @param {{ label: string, value: number }[]} props.data Un elemento por mes, en orden.
 * @returns {import('react').JSX.Element}
 */
export function MonthlyBarChart({ title, data }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const slotWidth = plotWidth / data.length;
  const barWidth = Math.min(MAX_BAR_WIDTH, slotWidth * 0.6);
  const baseline = PADDING.top + plotHeight;

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.title}>{title}</figcaption>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.chart}
        role="img"
        aria-label={`${title}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}
      >
        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={baseline}
          y2={baseline}
          className={styles.axis}
        />
        {data.map((d, i) => {
          const h = (d.value / max) * plotHeight;
          const slotX = PADDING.left + i * slotWidth;
          const x = slotX + (slotWidth - barWidth) / 2;
          const y = baseline - h;
          const isLast = i === data.length - 1;
          const showValue = isLast || hovered === i;
          // Barra con esquinas superiores redondeadas (4 px) y base recta sobre el eje.
          const r = Math.min(4, h, barWidth / 2);
          const path = `M${x} ${baseline}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + barWidth - r}Q${x + barWidth} ${y} ${x + barWidth} ${y + r}V${baseline}Z`;
          return (
            <g
              key={d.label}
              tabIndex={0}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={styles.group}
            >
              {/* Zona sensible más grande que la barra, para facilitar el hover. */}
              <rect
                x={slotX}
                y={PADDING.top}
                width={slotWidth}
                height={plotHeight}
                fill="transparent"
              />
              {h > 0 && <path d={path} className={isLast ? styles.barCurrent : styles.bar} />}
              {showValue && (
                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className={styles.value}>
                  {d.value}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 8}
                textAnchor="middle"
                className={styles.label}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
