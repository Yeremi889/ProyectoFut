import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import styles from './Modal.module.css';

/**
 * Ventana modal accesible basada en el elemento nativo <dialog>
 * (maneja foco, tecla Escape y fondo oscuro sin librerías).
 *
 * @param {object} props
 * @param {boolean} props.open Si la ventana está abierta.
 * @param {() => void} props.onClose Se llama al cerrar (botón, Escape o clic en el fondo).
 * @param {string} props.title Título de la ventana.
 * @param {import('react').ReactNode} props.children Contenido.
 * @returns {import('react').JSX.Element}
 */
export function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /**
   * Cierra al hacer clic fuera del contenido (sobre el fondo).
   * @param {import('react').MouseEvent<HTMLDialogElement>} event
   */
  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {open && children}
      </div>
    </dialog>
  );
}
