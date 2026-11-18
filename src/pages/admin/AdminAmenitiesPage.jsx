import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { AmenityForm } from '@/components/admin/AmenityForm';
import { AMENITY_ICONS } from '@/components/establishment/amenityIcons';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { ErrorState, LoadingState } from '@/components/ui/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import { invalidateAmenitiesCache } from '@/hooks/useAmenities';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/services';

/**
 * Catálogo de servicios que los negocios pueden marcar (SOP F-43).
 * Desactivar un servicio lo oculta del formulario y de los perfiles sin borrar datos.
 * @returns {import('react').JSX.Element}
 */
export function AdminAmenitiesPage() {
  useDocumentTitle('Servicios');
  const { data, loading, error, reload } = useAsync(() => api.admin.listAmenities(), []);
  const [editing, setEditing] = useState(null); // null = cerrada, 'new' = nuevo, Amenity = edición

  /**
   * Guarda el servicio, limpia el catálogo en memoria y recarga.
   * @param {Omit<import('@/types/domain').Amenity, 'id'> & { id?: string }} amenity
   */
  const handleSave = async (amenity) => {
    await api.admin.saveAmenity(amenity);
    invalidateAmenitiesCache();
    setEditing(null);
    await reload();
  };

  return (
    <div className="container page-stack">
      <PageHeader
        title="Servicios"
        description="Los servicios que los negocios marcan en su perfil, con su ícono."
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            Agregar servicio
          </Button>
        }
      />
      <Panel>
        {loading && !data && <LoadingState />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && (
          <DataTable
            caption="Catálogo de servicios"
            rows={data}
            rowKey={(a) => a.id}
            columns={[
              {
                key: 'icon',
                header: 'Ícono',
                render: (a) => {
                  const Icon = AMENITY_ICONS[a.icon];
                  return <Icon size={22} aria-hidden="true" />;
                },
              },
              { key: 'name', header: 'Nombre', render: (a) => a.name },
              {
                key: 'status',
                header: 'Estado',
                render: (a) =>
                  a.active ? <Badge tone="success">Activo</Badge> : <Badge>Inactivo</Badge>,
              },
              {
                key: 'actions',
                header: 'Acciones',
                render: (a) => (
                  <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setEditing(a)}>
                    Editar
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Panel>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo servicio' : 'Editar servicio'}
      >
        <AmenityForm
          initial={editing === 'new' ? undefined : editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      </Modal>
    </div>
  );
}
