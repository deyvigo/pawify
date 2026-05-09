
import { useState } from 'react';
import { Alert } from 'react-native';
import { loginUser } from '../services/authService';

export const useAuthentication = (onLoginSuccess: (userData: any) => void) => {
    const [isLoading, setIsLoading] = useState(false);

    const login = async (username: string, password: string) => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Atención', 'Por favor, ingresa tu nombre de usuario y contraseña.');
            return;
        }

        if (username.trim().length < 6) {
            Alert.alert('Atención', 'El Nombre de Usuario debe tener al menos 6 caracteres');
            return;
        }

        if (password.trim().length < 8) {
            Alert.alert('Atención', 'La Contraseña debe tener al menos 8 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            // Llamamos al servicio auth
            const data = await loginUser(username, password);
            
            Alert.alert('¡Bienvenido a Pawify!', 'Sesión iniciada correctamente.');
            console.log("JWT Token recibido:", data.token);

            onLoginSuccess({ 
                token: data.token,
                username: username
            });
            
            
            
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Nombre de usuario o contraseña incorrectos.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading
    };
};