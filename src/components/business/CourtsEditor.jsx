import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { COURT_TYPE_LABELS } from '@/constants/catalogs';
import { useSectionSave } from '@/hooks/useSectionSave';
import { api } from '@/services';
import { formatCurrency } from '@/utils/format';
import { CourtForm } from './CourtForm';
import { EditorForm } from './EditorForm';
import styles from './CourtsEditor.module.css';

/**
 * Paso 3 del asistente / pestaña "Canchas": agregar, editar y eliminar canchas (SOP F-24).
 * Cada cambio se guarda de inmediato; el botón final solo continúa.
 *
 * @param {object} props
 * @param {import('@/types/domain').Establishment} props.establishment Establecimiento a editar.
 * @param {(est: import('@/types/domain').Establishment) => void} props.onSaved Recibe el establecimiento actualizado.
 * @param {string} props.submitLabel Texto del botón final.
 * @param {boolean} [props.requireOne] Exige al menos una cancha para continuar (asistente).
 * @param {import('react').ReactNode} [props.secondaryAction] Botón adicional.
 * @returns {import('react').JSX.Element}
 */
export function CourtsEditor({
  establishment,
  onSaved,
  submitLabel,
  requireOne = false,
  secondaryAction,
}) {
  const [courts, setCourts] = useState(establishment.courts);
  const [editing, setEditing] = useState(null); // null = cerrado, 'new' = nueva, Court = edición
  const [listError, setListError] = useState(null);

  const { submit, saving, error } = useSectionSave(async () => {
    if (requireOne && courts.length === 0)
      throw new Error('Agrega al menos una cancha para continuar.');
    return api.business.getMine(establishment.id);
  }, onSaved);

  /**
   * Crea o actualiza la cancha del formulario y cierra la ventana.
   * @param {import('@/types/api').CourtInput} input
   */
  const handleSave = async (input) => {
    if (editing === 'new') {
      const created = await api.business.addCourt(establishment.id, input);
      setCourts((prev) => [...prev, created]);
    } else {
      const updated = await api.business.updateCourt(establishment.id, editing.id, input);
      setCourts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
    setEditing(null);
  };

  /**
   * Elimina una cancha después de confirmar.
   * @param {import('@/types/domain').Court} court
   */
  const handleDelete = async (court) => {
    if (!window.confirm(`¿Eliminar ${court.name}?`)) return;
    setListError(null);
    try {
      await api.business.deleteCourt(establishment.id, court.id);
      setCourts((prev) => prev.filter((c) => c.id !== court.id));
    } catch (err) {
      setListError(err.message);
    }
  };

  return (
    <>
      <EditorForm
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        submitLabel={submitLabel}
        saving={saving}
        error={error ?? listError}
        secondaryAction={secondaryAction}
      >
        {courts.length === 0 ? (
          <p className={styles.empty}>
            Todavía no hay canchas. Agrega la primera con su tipo y precios.
          </p>
        ) : (
          <ul className={styles.list}>
            {courts.map((court) => (
              <li key={court.id} className={styles.item}>
                <div className={styles.info}>
                  <p className={styles.name}>{court.name}</p>
                  <div className={styles.tags}>
                    <Badge tone="info">{COURT_TYPE_LABELS[court.type]}</Badge>
                    {court.roofed && <Badge>Techada</Badge>}
                  </div>
                  <p className={styles.prices}>
                    Día {formatCurrency(court.dayPrice)}, noche {formatCurrency(court.nightPrice)}
                  </p>
                </div>
                <div className={styles.actions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Pencil}
                    onClick={() => setEditing(court)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(court)}
                  >
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div>
          <Button variant="secondary" icon={Plus} onClick={() => setEditing('new')}>
            Agregar cancha
          </Button>
        </div>
      </EditorForm>

      {/* La ventana va fuera del formulario principal: HTML no permite formularios anidados. */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nueva cancha' : 'Editar cancha'}
      >
        <CourtForm
          initial={editing === 'new' ? undefined : editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      </Modal>
    </>
  );
}
