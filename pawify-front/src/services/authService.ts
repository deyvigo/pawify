
import { api } from './api';

/**
 * Authenticates a user by sending credentials to the backend.
 *
 * @param username - The user's login username.
 * @param password - The user's login password.
 * @returns A promise that resolves to the authentication response containing a JWT token.
 */
export const loginUser = async (username: string, password: string) => {

    const response = await api.post('/auth/login', { username, password });
    return response;
};

/**
 * Registers a new buyer account on the platform.
 *
 * @param userData - Registration payload containing username, email, password, DNI, etc.
 * @returns A promise that resolves to the server registration response.
 */
export const registerUser = async (userData: any) => {
    
    const response = await api.post('/auth/register/buyer', userData);
    return response;
};

/**
 * Requests a password recovery code to be sent to the user.
 *
 * @param username - The username of the account requesting recovery.
 * @returns A promise that resolves to the server response for the recovery code request.
 */
export const requestRecoveryCode = async (username: string) => {
    const response = await api.post('/auth/recovery/request-code', { username });
    return response;
};

/**
 * Resets the user's password using a previously verified recovery code.
 *
 * @param username - The username of the account whose password is being reset.
 * @param code - The recovery code received by the user.
 * @param new_password - The new password to set for the account.
 * @returns A promise that resolves to the server response for the password reset.
 */
export const resetPassword = async (username: string, code: string, new_password: string) => {
    const response = await api.post('/auth/recovery/reset-password', { username, code, new_password });
    return response;
};

/**
 * Verifies that a recovery code is valid for the given username.
 *
 * @param username - The username associated with the recovery code.
 * @param code - The recovery code to verify.
 * @returns A promise that resolves to the server response for the code verification.
 */
export const verifyRecoveryCode = async (username: string, code: string) => {
    const response = await api.post('/auth/recovery/verify-code', { username, code });
    return response;
};