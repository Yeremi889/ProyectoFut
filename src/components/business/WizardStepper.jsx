import { Check } from 'lucide-react';
import styles from './WizardStepper.module.css';

/**
 * Indicador de pasos del asistente de registro. Los pasos ya visitados se pueden tocar para volver.
 *
 * @param {object} props
 * @param {string[]} props.steps Nombres de los pasos, en orden.
 * @param {number} props.current Índice del paso actual (0 = primero).
 * @param {(index: number) => void} props.onSelect Se llama al tocar un paso anterior.
 * @returns {import('react').JSX.Element}
 */
export function WizardStepper({ steps, current, onSelect }) {
  return (
    <ol className={styles.stepper} aria-label="Pasos del registro">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            className={`${styles.step} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
          >
            <button
              type="button"
              className={styles.button}
              onClick={() => onSelect(index)}
              disabled={index > current}
              aria-current={active ? 'step' : undefined}
            >
              <span className={styles.marker} aria-hidden="true">
                {done ? <Check size={14} /> : index + 1}
              </span>
              <span className={styles.label}>{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
