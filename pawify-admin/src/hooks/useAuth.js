import { useState } from "react";
import { loginUser } from "../services/authService";
import { setAuthToken } from "../config";

/**
 * Custom hook that manages admin login authentication state.
 * Handles credential submission, loading state, error handling, and token persistence.
 *
 * @returns {Object} The login state and actions.
 * @returns {function(string, string): Promise<Object>} returns.login - Initiates the login process with username and password.
 * @returns {boolean} returns.isLoading - Whether a login request is currently in progress.
 * @returns {string|null} returns.error - The error message if login failed, or null if no error.
 *
 * @example
 * const { login, isLoading, error } = useLogin();
 *
 * const handleLogin = async () => {
 *   try {
 *     const data = await login('admin1', 'password123');
 *     // Login successful, token is stored automatically
 *   } catch (err) {
 *     console.error(err.message);
 *   }
 * };
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(username, password);
      setAuthToken(data.token);
      return data;
    } catch (err) {
      console.log(err);
      setError(err.message || "Credenciales inválidas");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
