import { DAY_NAMES, WEEK_ORDER } from '@/constants/catalogs';
import { getDaySchedule } from '@/utils/schedule';
import { formatTime12h, getZonedMoment } from '@/utils/time';
import styles from './ScheduleList.module.css';

/**
 * Horario de atención por día, resaltando el día de hoy (SOP F-26).
 *
 * @param {object} props
 * @param {import('@/types/domain').DaySchedule[]} props.schedule Horario semanal.
 * @returns {import('react').JSX.Element}
 */
export function ScheduleList({ schedule }) {
  const today = getZonedMoment().day;

  return (
    <dl className={styles.list}>
      {WEEK_ORDER.map((day) => {
        const d = getDaySchedule(schedule, day);
        const isToday = day === today;
        return (
          <div key={day} className={`${styles.row} ${isToday ? styles.today : ''}`}>
            <dt>
              {DAY_NAMES[day]}
              {isToday && <span className="visually-hidden"> (hoy)</span>}
            </dt>
            <dd>
              {!d || d.closed ? 'Cerrado' : `${formatTime12h(d.open)} a ${formatTime12h(d.close)}`}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
