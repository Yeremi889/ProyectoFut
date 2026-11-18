/** Procesamiento de imágenes en el navegador antes de subirlas (SOP, sección 7: rendimiento). */
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_SIZE_MB } from '@/constants/app';

/**
 * Valida tipo y peso de un archivo de imagen.
 * @param {File} file Archivo seleccionado por el usuario.
 * @returns {string | null} Mensaje de error o null si es válido.
 */
export function validateImageFile(file) {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return 'Solo se aceptan fotos JPG, PNG o WebP.';
  if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    return `Cada foto debe pesar menos de ${MAX_PHOTO_SIZE_MB} MB.`;
  }
  return null;
}

/**
 * Reduce una imagen a un ancho máximo y la comprime como JPEG.
 * @param {File} file Imagen original.
 * @param {number} maxWidth Ancho máximo en píxeles.
 * @param quality Calidad JPEG de 0 a 1.
 * @returns {Promise<string>} Imagen comprimida como data URL.
 * @throws Error si el navegador no puede leer la imagen.
 */
export function resizeImageToDataUrl(file, maxWidth, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen.'));
    };

    img.src = objectUrl;
  });
}
