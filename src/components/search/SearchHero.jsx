import { Search } from 'lucide-react';
import { useState } from 'react';
import { PitchLines } from './PitchLines';
import styles from './SearchHero.module.css';

/**
 * Portada de la página de inicio con el buscador principal (SOP F-02).
 * El texto se aplica al enviar el formulario, no en cada tecla, para no saturar el servidor.
 *
 * @param {object} props
 * @param {string} props.query Texto buscado actualmente.
 * @param {(query: string) => void} props.onSearch Se llama con el texto al buscar.
 * @returns {import('react').JSX.Element}
 */
export function SearchHero({ query, onSearch }) {
  // El campo arranca con la búsqueda actual. Si la búsqueda cambia desde la URL,
  // la página vuelve a montar este componente con key={query}.
  const [value, setValue] = useState(query);

  /**
   * @param {import('react').FormEvent} event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <section className={styles.hero}>
      <PitchLines />
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>Encuentra cancha para la mejenga de hoy</h1>
        <p className={styles.subtitle}>
          Fotos, precios y horarios de canchas sintéticas en todo el país. Escribe directo al
          establecimiento por WhatsApp.
        </p>

        <form className={styles.form} role="search" onSubmit={handleSubmit}>
          <label htmlFor="search-query" className="visually-hidden">
            Buscar por nombre, provincia o cantón
          </label>
          <Search size={20} className={styles.icon} aria-hidden="true" />
          <input
            id="search-query"
            type="search"
            className={styles.input}
            placeholder="Nombre, provincia o cantón"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className={styles.submit}>
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
