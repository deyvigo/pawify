import { useState, useEffect, useCallback } from 'react';
import { createAdmin, getAdmins, changePassword } from '../services/adminService';

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

export function useChangeAdminPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = useCallback(async (username) => {
    setMessage(null);
    setError(null);

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
      await changePassword(username, newPassword);
      setMessage(`Contraseña actualizada para "${username}"`);
      setNewPassword('');
      setConfirmPassword('');
      return true;
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  }, [newPassword, confirmPassword]);

  const reset = useCallback(() => {
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
    setError(null);
  }, []);

  return { newPassword, setNewPassword, confirmPassword, setConfirmPassword, message, error, saving, submit, reset };
}
