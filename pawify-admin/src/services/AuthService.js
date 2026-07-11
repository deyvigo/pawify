import { api } from './api';

/**
 * Authenticates an admin user by sending credentials to the login endpoint.
 *
 * @param {string} username - The admin's username.
 * @param {string} password - The admin's password.
 * @returns {Promise<Object>} The authentication response containing a JWT token and user data.
 * @throws {Error} If the credentials are invalid or the request fails.
 *
 * @example
 * const data = await loginUser('admin1', 'secret123');
 * // Returns: { token: 'eyJhbG...', user: { ... } }
 */
export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response;
};
