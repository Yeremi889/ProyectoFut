/** Generación de slugs para los links propios (SOP F-28). */

/**
 * Convierte un texto en un slug para URL: minúsculas, sin tildes, palabras separadas por guion.
 * @param {string} text Texto de origen, por ejemplo "La Bombonera Sintética".
 * @returns {string} Slug, por ejemplo "la-bombonera-sintetica".
 */
export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Genera un slug que no esté en uso agregando un número si hace falta.
 * @param {string} text Texto de origen.
 * @param {Set<string>} taken Slugs ya usados.
 * @returns {string} Slug único, por ejemplo "gol-center-2".
 */
export function uniqueSlug(text, taken) {
  const base = slugify(text) || 'establecimiento';
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
