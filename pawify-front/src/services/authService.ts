
import { api } from './api';

export const loginUser = async (username: string, password: string) => {

    const response = await api.post('/auth/login', { username, password });
    return response;
};


export const registerUser = async (userData: any) => {
    
    const response = await api.post('/auth/register/buyer', userData);
    return response;
};

// Solicitar código de recuperación
export const requestRecoveryCode = async (username: string) => {
    const response = await api.post('/auth/recovery/request-code', { username });
    return response;
};

//  Enviar nueva contraseña 
export const resetPassword = async (username: string, code: string, new_password: string) => {
    const response = await api.post('/auth/recovery/reset-password', { username, code, new_password });
    return response;
};