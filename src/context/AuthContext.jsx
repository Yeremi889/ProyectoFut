import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/services';
import { clearToken } from '@/services/tokenStorage';

/** @typedef {import('@/types/domain').User} User */
/** @typedef {import('@/types/api').RegisterInput} RegisterInput */

/**
 * Valor que comparte el contexto de autenticación.
 * @typedef {object} AuthContextValue
 * @property {User | null} user Usuario actual, o null si es visitante.
 * @property {boolean} initializing true mientras se revisa si hay una sesión guardada.
 * @property {(email: string, password: string) => Promise<User>} login Inicia sesión.
 * @property {(input: RegisterInput) => Promise<User>} register Crea una cuenta e inicia sesión.
 * @property {() => void} logout Cierra la sesión.
 */

const AuthContext = createContext(/** @type {AuthContextValue | null} */ (null));

/**
 * Proveedor de la sesión del usuario para toda la aplicación.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {import('react').JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    api.auth
      .getCurrentUser()
      .then(setUser)
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedIn = await api.auth.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (input) => {
    const created = await api.auth.register(input);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Acceso a la sesión desde cualquier componente.
 * @returns {AuthContextValue}
 * @throws {Error} Si se usa fuera de <AuthProvider>.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return context;
}
