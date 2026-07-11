import { api } from './api';

// Crea un nuevo administrador enviando datos al servidor
export const createAdmin = async (userData) => {
  const response = await api.post('/auth/register/admin', userData);
  return response;
};

// Lista todos los administradores con paginacion
export const getAdmins = async (page = 0, size = 5) => {
  const response = await api.get(`/admin/admins?page=${page}&size=${size}`);
  return response;
};

// Cambia la contrasena del administrador autenticado
export const changePassword = async (payload) => {
  const response = await api.post('/user/password', payload);
  return response;
};
