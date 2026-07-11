import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAuthToken, clearAuthToken, loadAuthToken } from '../config';

/**
 * React Context for admin authentication state.
 * Provides user data, session management, and authentication status to the component tree.
 *
 * @type {React.Context<Object|null>}
 */
const AuthContext = createContext(null);

/**
 * Authentication provider component that wraps the application and manages admin auth state.
 * Initializes by loading any persisted JWT token from storage and decoding its payload.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that will have access to the auth context.
 * @returns {JSX.Element} The AuthContext.Provider wrapping the children with auth state and actions.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * // Context value provided:
 * // { user, logout, setSession, isLoading, isAuthenticated }
 */
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

  /**
   * Logs out the current admin by clearing user state and removing the stored token.
   * Wrapped in useCallback for stable reference across renders.
   */
  const logout = useCallback(() => {
    setUser(null);
    clearAuthToken();
  }, []);

  /**
   * Sets a new session by storing the JWT token and decoding its payload into user state.
   * Wrapped in useCallback for stable reference across renders.
   *
   * @param {string} token - The JWT token to store and decode.
   */
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

/**
 * Decodes a JWT token and returns its payload as a JavaScript object.
 * Handles Base64URL decoding safely with error catching.
 *
 * @param {string} token - The JWT token string to decode.
 * @returns {Object|null} The decoded payload object, or null if decoding fails.
 *
 * @example
 * const payload = decodeJwt('eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluMSJ9.signature');
 * // Returns: { username: 'admin1' }
 */
function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Custom hook to access the admin authentication context.
 * Must be used within an AuthProvider component.
 *
 * @returns {Object} The authentication context value.
 * @returns {Object|null} returns.user - The decoded JWT payload (user data), or null if not authenticated.
 * @returns {function(): void} returns.logout - Logs out the current admin and clears stored token.
 * @returns {function(string): void} returns.setSession - Sets a new session from a JWT token.
 * @returns {boolean} returns.isLoading - Whether the initial token loading is still in progress.
 * @returns {boolean} returns.isAuthenticated - Whether an admin is currently authenticated (derived from user being non-null).
 * @throws {Error} If used outside of an AuthProvider.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 *
 * if (isAuthenticated) {
 *   console.log(`Welcome, ${user.username}`);
 * }
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
