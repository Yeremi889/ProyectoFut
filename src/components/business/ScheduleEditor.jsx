import { useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { DAY_NAMES, WEEK_ORDER } from '@/constants/catalogs';
import { useSectionSave } from '@/hooks/useSectionSave';
import { api } from '@/services';
import { validateSchedule } from '@/utils/schedule';
import { EditorForm } from './EditorForm';
import styles from './ScheduleEditor.module.css';

/**
 * Paso 5 del asistente / pestaña "Horario": horario por día y hora de tarifa nocturna (SOP F-26).
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a editar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSaved Recibe el establecimiento guardado.
 * @param {string} props.submitLabel Texto del botón de guardar.
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional.
 * @returns {import('react').JSX.Element}
 */
export function ScheduleEditor({ establishment, onSaved, submitLabel, secondaryAction }) {
  const [schedule, setSchedule] = useState(() =>
    WEEK_ORDER.map(
      (day) =>
        establishment.schedule.find((d) => d.day === day) ?? {
          day,
          closed: true,
          open: '08:00',
          close: '22:00',
        },
    ),
  );
  const [nightStart, setNightStart] = useState(establishment.nightRateStartsAt);
  const [validationError, setValidationError] = useState(null);

  const { submit, saving, error, saved, reset } = useSectionSave(
    () => api.business.update(establishment.id, { schedule, nightRateStartsAt: nightStart }),
    onSaved,
  );

  /**
   * Cambia un campo del horario de un día.
   * @param {import('@/types/domain').DayOfWeek} day
   * @param {Partial<import('@/types/domain').DaySchedule>} changes
   */
  const updateDay = (day, changes) => {
    reset();
    setSchedule((prev) => prev.map((d) => (d.day === day ? { ...d, ...changes } : d)));
  };

  /** Copia el horario del lunes a los demás días abiertos. */
  const copyMondayToAll = () => {
    const monday = schedule.find((d) => d.day === 1);
    if (!monday) return;
    reset();
    setSchedule((prev) =>
      prev.map((d) => ({ ...d, closed: monday.closed, open: monday.open, close: monday.close })),
    );
  };

  /** @param {import('react').FormEvent} event */
  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateSchedule(schedule);
    setValidationError(errors[0] ?? null);
    if (errors.length === 0) submit();
  };

  return (
    <EditorForm
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      saving={saving}
      error={validationError ?? error}
      saved={saved}
      secondaryAction={secondaryAction}
    >
      <div className={styles.header}>
        <p className={styles.help}>
          Si cierras después de medianoche, pon la hora de cierre normalmente (por ejemplo, 01:00).
        </p>
        <button type="button" className={styles.copy} onClick={copyMondayToAll}>
          Copiar el lunes a todos los días
        </button>
      </div>

      <div className={styles.table}>
        {schedule.map((d) => (
          <div key={d.day} className={styles.row}>
            <span className={styles.day}>{DAY_NAMES[d.day]}</span>
            <Switch
              label={d.closed ? 'Cerrado' : 'Abierto'}
              checked={!d.closed}
              onChange={(open) => updateDay(d.day, { closed: !open })}
            />
            <div className={styles.times}>
              <label className="visually-hidden" htmlFor={`open-${d.day}`}>
                Apertura del {DAY_NAMES[d.day]}
              </label>
              <input
                id={`open-${d.day}`}
                type="time"
                className={styles.time}
                value={d.open}
                disabled={d.closed}
                onChange={(e) => updateDay(d.day, { open: e.target.value })}
              />
              <span aria-hidden="true">a</span>
              <label className="visually-hidden" htmlFor={`close-${d.day}`}>
                Cierre del {DAY_NAMES[d.day]}
              </label>
              <input
                id={`close-${d.day}`}
                type="time"
                className={styles.time}
                value={d.close}
                disabled={d.closed}
                onChange={(e) => updateDay(d.day, { close: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.night}>
        <label htmlFor="night-start" className={styles.nightLabel}>
          La tarifa nocturna empieza a las
        </label>
        <input
          id="night-start"
          type="time"
          className={styles.time}
          value={nightStart}
          onChange={(e) => {
            reset();
            setNightStart(e.target.value);
          }}
        />
      </div>
    </EditorForm>
  );
}
