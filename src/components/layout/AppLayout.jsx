import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

/**
 * Estructura común de todas las páginas: encabezado, contenido y pie.
 * Lleva el scroll arriba al cambiar de página.
 * @returns {import('react').JSX.Element}
 */
export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
