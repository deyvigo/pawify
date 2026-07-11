import { api } from './api';

// Hace login de admin enviando credenciales al endpoint de login
export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response;
};
