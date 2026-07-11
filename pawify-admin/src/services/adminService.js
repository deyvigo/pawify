import { api } from './api';

/**
 * Creates a new admin user by sending registration data to the server.
 *
 * @param {Object} userData - The admin user data.
 * @param {string} userData.username - The username for the new admin.
 * @param {string} userData.password - The password for the new admin.
 * @param {string} userData.first_name - The admin's first name.
 * @param {string} userData.last_name - The admin's last name.
 * @param {string} userData.dni_number - The admin's national ID number.
 * @returns {Promise<Object>} The server response confirming admin creation.
 * @throws {Error} If the user already exists or the request fails.
 *
 * @example
 * const response = await createAdmin({
 *   username: 'admin2',
 *   password: 'securePass123',
 *   first_name: 'Maria',
 *   last_name: 'Garcia',
 *   dni_number: '12345678'
 * });
 */
export const createAdmin = async (userData) => {
  const response = await api.post('/auth/register/admin', userData);
  return response;
};

/**
 * Retrieves a paginated list of admin users.
 *
 * @param {number} [page=0] - The page number to retrieve (0-indexed).
 * @param {number} [size=5] - The number of admins per page.
 * @returns {Promise<Object>} A paginated response containing:
 * @returns {Object[]} returns.content - Array of admin user objects.
 * @returns {boolean} returns.first - Whether this is the first page.
 * @returns {boolean} returns.last - Whether this is the last page.
 * @throws {Error} If the request fails.
 *
 * @example
 * const data = await getAdmins(0, 10);
 * // Returns: { content: [...], first: true, last: false, ... }
 */
export const getAdmins = async (page = 0, size = 5) => {
  const response = await api.get(`/admin/admins?page=${page}&size=${size}`);
  return response;
};

/**
 * Changes the password of the currently authenticated admin user.
 *
 * @param {Object} payload - The password change data.
 * @param {string} payload.current_password - The current password for verification.
 * @param {string} payload.new_password - The new password to set.
 * @param {string} payload.confirm_new_password - Confirmation of the new password.
 * @returns {Promise<Object>} The server response confirming the password change.
 * @throws {Error} If the current password is incorrect or the request fails.
 *
 * @example
 * await changePassword({
 *   current_password: 'oldPass123',
 *   new_password: 'newPass456',
 *   confirm_new_password: 'newPass456'
 * });
 */
export const changePassword = async (payload) => {
  const response = await api.post('/user/password', payload);
  return response;
};
