import { api } from './api';

export const createAdmin = async (userData) => {
  const response = await api.post('/auth/register/admin', userData);
  return response;
};

export const getAdmins = async (page = 0, size = 5) => {
  const response = await api.get(`/admin/admins?page=${page}&size=${size}`);
  return response;
};

export const changePassword = async (payload) => {
  const response = await api.post('/user/password', payload);
  return response;
};
