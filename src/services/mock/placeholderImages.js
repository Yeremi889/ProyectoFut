/**
 * Genera imágenes de ejemplo (una cancha dibujada en SVG) para los datos de prueba,
 * así el proyecto no depende de imágenes externas.
 */

/**
 * Crea una imagen SVG de una cancha vista desde arriba.
 * @param {number} hue Tono del césped en grados HSL (por ejemplo 140 = verde).
 * @param {string} [label] Texto pequeño en la parte inferior.
 * @returns {string} Data URL de la imagen SVG.
 */
export function pitchImage(hue, label = '') {
  const stripes = Array.from(
    { length: 8 },
    (_, i) => `<rect x="${i * 100}" width="50" height="500" fill="#fff" opacity=".05"/>`,
  ).join('');

  const caption = label
    ? `<text x="400" y="488" font-family="Inter, sans-serif" font-size="18" fill="#fff" opacity=".85" text-anchor="middle">${label}</text>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},52%,36%)"/><stop offset="1" stop-color="hsl(${hue},58%,24%)"/>
    </linearGradient></defs>
    <rect width="800" height="500" fill="url(#g)"/>${stripes}
    <g fill="none" stroke="#fff" stroke-width="4" opacity=".85">
      <rect x="40" y="40" width="720" height="420"/><line x1="400" y1="40" x2="400" y2="460"/>
      <circle cx="400" cy="250" r="62"/>
      <rect x="40" y="160" width="90" height="180"/><rect x="670" y="160" width="90" height="180"/>
    </g>
    <circle cx="400" cy="250" r="6" fill="#fff"/>${caption}
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
