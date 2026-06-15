import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image ,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resetPassword } from '../services/authService';

interface NewPasswordProps {
    username: string;
    code: string;
    onBackToRecovery: () => void;
    onPasswordResetSuccess: () => void;
}

export const NewPasswordScreen = ({ username, code, onBackToRecovery, onPasswordResetSuccess }: NewPasswordProps) => {
    // Estados para las contraseñas
    const [new_password, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    

    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const RequirementItem = ({ text }: { text: string }) => (
        <View style={styles.requirementItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.requirementText}>{text}</Text>
        </View>
    );


    const handleUpdatePassword = async () => {
        if (new_password.length < 8) {
            Alert.alert('Atención', 'La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (new_password !== confirmPassword) {
            Alert.alert('Atención', 'Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            // Llamamos a Spring Boot con los 3 datos
            await resetPassword(username, code, new_password);
            
            Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada correctamente. Inicia sesión con tu nueva clave.');
            onPasswordResetSuccess(); // Volvemos al Login
            
        } catch (error) {
            Alert.alert('Error', 'No pudimos actualizar tu contraseña. Revisa si el código ha expirado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
             {/* header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBackToRecovery}>
                    <Image style={styles.backIcon} source={require('../../assets/arrowLeftIcon.png')} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recuperar cuenta</Text>
                <View style={{ width: 24 }} /> 
            </View>

            <View style={styles.content}>
                {/* Icono principal */}
                <View style={styles.iconWrapper}>
                    <View style={styles.glowCircle}>
                        <Image style={styles.mainIcon} source={require('../../assets/lockRefreshIcon.png')} />
                    </View>
                </View>

                {/* Texto central */}
                <Text style={styles.title}>Crea una nueva clave</Text>
                <Text style={styles.subtitle}>
                    Tu seguridad es nuestra prioridad. Elige una contraseña fuerte para proteger a tus peluditos.
                </Text>

                {/* Input de nueva contraseña */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Nueva contraseña</Text>
                    <View style={styles.fieldContainer}>
                        <Image style={styles.inputIcon} source={require('../../assets/lockIcon.png')} />
                        <TextInput 
                            style={styles.input}
                            placeholder="Mínimo 8 caracteres"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showNewPassword} 
                            value={new_password}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Image style={styles.eyeIcon} source={require('../../assets/eyeIcon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>

                
                {/* Input de confirmación de contraseña */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <View style={styles.fieldContainer}>
                        <Image style={styles.inputIcon} source={require('../../assets/lockReloadIcon.png')} />
                        <TextInput 
                            style={styles.input}
                            placeholder="Repite tu contraseña"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showConfirmPassword} 
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Image style={styles.eyeIcon} source={require('../../assets/eyeIcon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.requirementsContainer}>
                    <View style={styles.requirementsBox}>
                        <Text style={styles.requirementsTitle}>Tu contraseña debe incluir:</Text>
                        <View style={styles.requirementsGrid}>
                            <RequirementItem text="8+ Caracteres" />
                            <RequirementItem text="Mayúscula" />
                            <RequirementItem text="Número" />
                            <RequirementItem text="Símbolo" />
                        </View>
                    </View>
                </View>

                {/* Boton actualizar */}
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.updateButtonText}>Actualizar contraseña</Text>
                    )}
                </TouchableOpacity>

                {/* footer de soporte*/}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>¿Necesitas ayuda? </Text>
                    <TouchableOpacity>
                        <Text style={styles.supportLink}>Contactar soporte</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9', 
        flexGrow: 1,

        paddingBottom: 40,
    },



    //Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0', 
    },

    content: {
        paddingHorizontal: 30,
    },

    backButton: {
        padding: 5,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#FF1A1A',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF1A1A',
    },



    // Icono central
    iconWrapper: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    glowCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF1A1A',
        elevation: 8,
    },
    mainIcon: {
        width: 35,
        height: 35,
        tintColor: '#FF1A1A',
        resizeMode: 'contain',
    },


    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#5E3F3C',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
        marginBottom: 30,
    },

    // Inputs de contraseña
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5E3F3C', 
        marginBottom: 8,
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        height: 55,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputIcon: {
        tintColor: '#9CA3AF',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: '#333333', 
        fontSize: 15,
    },
    eyeIcon: {
        tintColor: '#9CA3AF',
        padding: 5,
    },

    //Tarjeta de requisitos de contraseña
    requirementsContainer: {
        alignItems: 'center',
    },


    requirementsBox: {
        width: '80%',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 20,
        marginTop: 10,
        marginBottom: 35,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5E3F3C',
        marginBottom: 15,
    },
    requirementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
    },
    requirementItem: {
        width: '50%', 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3, 
        backgroundColor: '#9CA3AF', 
        marginRight: 8,
    },
    requirementText: {
        fontSize: 13,
        color: '#6B7280',
    },

    // boton actualizar contraseña
    updateButton: {
        backgroundColor: '#FF1A1A',
        width: '100%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 40,
        shadowColor: '#FF1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 7,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    //footer
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto', 
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    supportLink: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF1A1A',
    }
});
