import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services';
import styles from './FavoriteButton.module.css';

/**
 * Ícono de corazón relleno, para cuando el establecimiento ya es favorito.
 * @param {{ size?: number }} props
 * @returns {import('react').JSX.Element}
 */
function FilledHeart({ size }) {
  return <Heart size={size} className={styles.filled} aria-hidden="true" />;
}

/**
 * Botón para guardar o quitar un establecimiento de favoritos (SOP F-11).
 * Solo se muestra a visitantes (invita a crear cuenta) y a jugadores.
 *
 * @param {object} props
 * @param {string} props.establishmentId Id del establecimiento.
 * @returns {import('react').JSX.Element | null}
 */
export function FavoriteButton({ establishmentId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [busy, setBusy] = useState(false);
  const isPlayer = user?.role === 'player';

  useEffect(() => {
    if (!isPlayer) return;
    api.favorites.list().then((list) => setIsFavorite(list.some((f) => f.id === establishmentId)));
  }, [isPlayer, establishmentId]);

  if (user && !isPlayer) return null;

  /** Cambia el estado de favorito o envía a iniciar sesión. */
  const toggle = async () => {
    if (!user) {
      navigate(ROUTES.login, { state: { from: window.location.pathname } });
      return;
    }
    setBusy(true);
    try {
      if (isFavorite) await api.favorites.remove(establishmentId);
      else await api.favorites.add(establishmentId);
      setIsFavorite(!isFavorite);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={isFavorite ? FilledHeart : Heart}
      onClick={toggle}
      loading={busy}
      aria-pressed={isFavorite}
    >
      {isFavorite ? 'Guardado en favoritos' : 'Guardar en favoritos'}
    </Button>
  );
}
