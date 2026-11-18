import styles from './DataTable.module.css';

/**
 * Columna de una tabla.
 * @template T
 * @typedef {object} Column
 * @property {string} key Identificador único de la columna.
 * @property {string} header Encabezado visible.
 * @property {(row: T) => import('react').ReactNode} render Contenido de la celda.
 * @property {'left' | 'right'} [align] Alineación (números a la derecha).
 */

/**
 * Tabla de datos con desplazamiento horizontal en celular.
 *
 * @template T
 * @param {object} props
 * @param {Column<T>[]} props.columns Columnas.
 * @param {T[]} props.rows Filas.
 * @param {(row: T) => string} props.rowKey Devuelve un id único por fila.
 * @param {string} props.caption Descripción de la tabla (accesibilidad).
 * @returns {import('react').JSX.Element}
 */
export function DataTable({ columns, rows, rowKey, caption }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={col.align === 'right' ? styles.right : ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key} className={col.align === 'right' ? styles.right : ''}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
