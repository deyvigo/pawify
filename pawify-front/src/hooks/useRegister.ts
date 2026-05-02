
import { useState } from 'react';
import { Alert } from 'react-native';
import { registerUser } from '../services/authService';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);

    const register = async (
        userData: any, 
        confirmPassword: string, 
        acceptTerms: boolean,
        onSuccess: () => void 
    ) => {
        // Validaciones básicas
        if (!acceptTerms) {
            Alert.alert('Atención', 'Debes aceptar los términos y condiciones.');
            return;
        }
        if (userData.password !== confirmPassword) {
            Alert.alert('Atención', 'Las contraseñas no coinciden.');
            return;
        }
        if (!userData.username || !userData.first_name || !userData.last_name || !userData.email || !userData.dni_number) {
            Alert.alert('Atención', 'Por favor, llena todos los campos obligatorios.');
            return;
        }

        setIsLoading(true);
        try {
            // 2. Enviamos el paquete al backend
            await registerUser(userData);
            
            
            Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.');
            
            onSuccess();
            
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo registrar la cuenta. Verifica que el DNI sea de 8 dígitos y el usuario sea único.');
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading };
};