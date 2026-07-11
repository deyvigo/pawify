import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAuthToken, clearAuthToken, loadAuthToken } from '../config';

// Contexto de autenticacion para el admin
const AuthContext = createContext(null);

// Proveedor de autenticacion que maneja sesion y estado del admin
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = loadAuthToken();
    if (token) {
      const payload = decodeJwt(token);
      if (payload) setUser(payload);
    }
    setIsLoading(false);
  }, []);

  // Cierra sesion limpiando estado y token
  const logout = useCallback(() => {
    setUser(null);
    clearAuthToken();
  }, []);

  // Guarda token y decodifica payload para establecer sesion
  const setSession = useCallback((token) => {
    setAuthToken(token);
    const payload = decodeJwt(token);
    if (payload) setUser(payload);
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout, setSession, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Decodifica el payload de un token JWT
function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Hook para acceder al contexto de autenticacion del admin
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
