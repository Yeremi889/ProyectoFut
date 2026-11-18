import { useId } from 'react';
import styles from './FormField.module.css';

/**
 * Envoltura común de un campo de formulario: etiqueta, ayuda y mensaje de error.
 * Conecta automáticamente la etiqueta y los mensajes con el control (accesibilidad).
 *
 * @param {object} props
 * @param {string} props.label Etiqueta visible.
 * @param {string | null} [props.error] Mensaje de error; si existe, el campo se marca como inválido.
 * @param {string} [props.hint] Texto de ayuda debajo del campo.
 * @param {(ids: { id: string, describedBy: string | undefined, invalid: boolean }) => import('react').ReactNode} props.children
 *   Función que recibe los ids y devuelve el control (input, select, textarea).
 * @returns {import('react').JSX.Element}
 */
export function FormField({ label, error, hint, children }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Campo de texto (input) con etiqueta y validación.
 * @param {object} props Props de FormField (label, error, hint) más las de <input>.
 * @returns {import('react').JSX.Element}
 */
export function TextField({ label, error, hint, ...inputProps }) {
  return (
    <FormField label={label} error={error} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          className={styles.control}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          {...inputProps}
        />
      )}
    </FormField>
  );
}

/**
 * Área de texto con etiqueta, validación y contador opcional de caracteres.
 * @param {object} props Props de FormField más las de <textarea>.
 * @returns {import('react').JSX.Element}
 */
export function TextAreaField({ label, error, hint, maxLength, value, ...rest }) {
  const counter = maxLength ? `${String(value ?? '').length}/${maxLength}` : undefined;
  return (
    <FormField label={label} error={error} hint={hint ?? counter}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          className={`${styles.control} ${styles.textarea}`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          maxLength={maxLength}
          value={value}
          {...rest}
        />
      )}
    </FormField>
  );
}

/**
 * Selector desplegable con etiqueta.
 * @param {object} props Props de FormField más las de <select>.
 * @param {{ value: string, label: string }[]} props.options Opciones.
 * @param {string} [props.placeholder] Texto de la opción vacía inicial.
 * @returns {import('react').JSX.Element}
 */
export function SelectField({ label, error, hint, options, placeholder, ...rest }) {
  return (
    <FormField label={label} error={error} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          className={styles.control}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
