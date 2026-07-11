import { useState, useEffect, useCallback } from 'react';
import { createAdmin, getAdmins, changePassword } from '../services/adminService';

/**
 * Custom hook for creating a new admin user.
 * Manages form state, validation, submission, and success/error messaging.
 *
 * @returns {Object} The admin creation state and actions.
 * @returns {Object} returns.form - The current form data with fields: username, password, confirmPassword, firstName, lastName, dniNumber.
 * @returns {string|null} returns.message - Success message after admin creation, or null.
 * @returns {string|null} returns.error - Error message if creation failed, or null.
 * @returns {boolean} returns.loading - Whether the creation request is in progress.
 * @returns {function(Object): void} returns.handleChange - Event handler to update form fields.
 * @returns {function(): Promise<boolean>} returns.submit - Submits the form to create a new admin. Returns true on success, false on failure.
 * @returns {function(string|null): void} returns.setMessage - Manually sets the success message.
 * @returns {function(string|null): void} returns.setError - Manually sets the error message.
 *
 * @example
 * const { form, handleChange, submit, error, loading } = useCreateAdmin();
 *
 * // In a form:
 * <input name="username" value={form.username} onChange={handleChange} />
 * <button onClick={submit} disabled={loading}>Create Admin</button>
 */
export function useCreateAdmin() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', firstName: '', lastName: '', dniNumber: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name || e.target.id]: e.target.value }));
  }, []);

  const submit = useCallback(async () => {
    setMessage(null);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await createAdmin({
        username: form.username,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        dni_number: form.dniNumber,
      });
      setMessage(`Administrador "${form.username}" creado exitosamente`);
      setForm({ username: '', password: '', confirmPassword: '', firstName: '', lastName: '', dniNumber: '' });
      return true;
    } catch (err) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('already exists') || msg.includes('ya existe')) {
        setError(`El usuario "${form.username}" ya existe`);
      } else {
        setError(err.message || 'Error al crear administrador');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [form]);

  return { form, message, error, loading, handleChange, submit, setMessage, setError };
}

/**
 * Custom hook for fetching and managing a paginated list of admin users.
 * Automatically fetches data when the page changes.
 *
 * @returns {Object} The admin list state and pagination controls.
 * @returns {Object[]} returns.admins - Array of admin user objects for the current page.
 * @returns {boolean} returns.loading - Whether the admin list is currently being fetched.
 * @returns {number} returns.page - The current page number (0-indexed).
 * @returns {function(number): void} returns.setPage - Sets the current page and triggers a refetch.
 * @returns {boolean} returns.first - Whether the current page is the first page.
 * @returns {boolean} returns.last - Whether the current page is the last page.
 * @returns {string|null} returns.error - Error message if fetching failed, or null.
 * @returns {function(): void} returns.refresh - Manually triggers a refetch of the admin list.
 *
 * @example
 * const { admins, loading, page, setPage, first, last, refresh } = useAdminList();
 *
 * // Navigate pages:
 * {!first && <button onClick={() => setPage(page - 1)}>Previous</button>}
 * {!last && <button onClick={() => setPage(page + 1)}>Next</button>}
 */
export function useAdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdmins(page, 5);
      setAdmins(data.content || []);
      setFirst(data.first !== false);
      setLast(data.last !== false);
    } catch {
      setError('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  return { admins, loading, page, setPage, first, last, error, refresh: fetch };
}

/**
 * Custom hook for changing the currently authenticated admin's password.
 * Manages current password, new password, confirmation, validation, and submission.
 *
 * @returns {Object} The password change state and actions.
 * @returns {string} returns.currentPassword - The current password input value.
 * @returns {function(string): void} returns.setCurrentPassword - Updates the current password value.
 * @returns {string} returns.newPassword - The new password input value.
 * @returns {function(string): void} returns.setNewPassword - Updates the new password value.
 * @returns {string} returns.confirmPassword - The confirmation password input value.
 * @returns {function(string): void} returns.setConfirmPassword - Updates the confirmation password value.
 * @returns {string|null} returns.message - Success message after password change, or null.
 * @returns {string|null} returns.error - Error message if password change failed, or null.
 * @returns {boolean} returns.saving - Whether the password change request is in progress.
 * @returns {function(): Promise<boolean|undefined>} returns.submit - Validates and submits the password change. Returns true on success.
 * @returns {function(): void} returns.reset - Clears all form fields and messages.
 *
 * @example
 * const { currentPassword, setCurrentPassword, newPassword, setNewPassword,
 *         confirmPassword, setConfirmPassword, submit, saving, error } = useChangeAdminPassword();
 *
 * // In a form:
 * <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
 * <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
 * <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
 * <button onClick={submit} disabled={saving}>Change Password</button>
 */
export function useChangeAdminPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = useCallback(async () => {
    setMessage(null);
    setError(null);

    if (!currentPassword) {
      setError('La contraseña actual es obligatoria');
      return;
    }
    if (!newPassword) {
      setError('La nueva contraseña es obligatoria');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setSaving(true);
      await changePassword({ current_password: currentPassword, new_password: newPassword, confirm_new_password: confirmPassword });
      setMessage('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return true;
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const reset = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
    setError(null);
  }, []);

  return { currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, message, error, saving, submit, reset };
}
