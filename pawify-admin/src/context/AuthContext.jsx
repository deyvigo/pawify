import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAuthToken, clearAuthToken, loadAuthToken } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = loadAuthToken();
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        setUser(payload);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData) => {
    console.log('userData', userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearAuthToken();
  }, []);

  const setSession = useCallback((token, userData) => {
    setAuthToken(token);
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setSession, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
