
import { api } from './api';

// Login de usuario, retorna JWT
export const loginUser = async (username: string, password: string) => {

    const response = await api.post('/auth/login', { username, password });
    return response;
};

// Registra un nuevo comprador en la plataforma
export const registerUser = async (userData: any) => {
    
    const response = await api.post('/auth/register/buyer', userData);
    return response;
};

// Solicita un codigo de recuperacion de contrasena
export const requestRecoveryCode = async (username: string) => {
    const response = await api.post('/auth/recovery/request-code', { username });
    return response;
};

// Restablece la contrasena usando un codigo de recuperacion
export const resetPassword = async (username: string, code: string, new_password: string) => {
    const response = await api.post('/auth/recovery/reset-password', { username, code, new_password });
    return response;
};

// Verifica que un codigo de recuperacion sea valido
export const verifyRecoveryCode = async (username: string, code: string) => {
    const response = await api.post('/auth/recovery/verify-code', { username, code });
    return response;
};