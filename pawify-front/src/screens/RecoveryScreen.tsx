import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export const RecoveryScreen = () => {
    // Estado: Un arreglo de 6 espacios vacíos para guardar cada dígito
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);

    // Función de Acción: Actualiza solo la cajita en la que el usuario está escribiendo
    const handleChangeText = (text: string, index: number) => {
        // Creamos una copia del arreglo actual para no modificar el estado directamente (Regla de oro de React)
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* --- HEADER --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Image style={styles.backIcon} source={require('../../assets/arrowLeftIcon.png')} />
                    <Text style={styles.headerTitle}>Recuperar cuenta</Text>
                </TouchableOpacity>
                <Text style={styles.headerLogo}>Pawify</Text>
            </View>

            <View style={styles.content}>
                
                {/* --- ÍCONO CENTRAL CON BADGE --- */}
                <View style={styles.iconWrapper}>
                    <View style={styles.mainIconContainer}>
                        <Image style={styles.emailIcon} source={require('../../assets/emailIcon.png')} />
                    </View>
                    <View style={styles.badgeIconContainer}>
                        <Image style={styles.badgeIcon} source={require('../../assets/verifyIcon.png')} />
                    </View>
                </View>

                {/* --- TEXTOS INFORMATIVOS --- */}
                <Text style={styles.title}>Verifica tu código</Text>
                <Text style={styles.subtitle}>
                    Hemos enviado un código de seguridad de 6 dígitos a su correo electrónico asociado.
                </Text>
                <Text style={styles.emailMask}>h****o@gmail.com</Text>

                <View style={styles.otpContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            placeholder="•"
                            placeholderTextColor="#9CA3AF"
                            value={digit}
                            onChangeText={(text) => handleChangeText(text, index)}
                        />
                    ))}
                </View>

                {/* --- BOTÓN VERIFICAR --- */}
                <TouchableOpacity style={styles.verifyButton}>
                    <Text style={styles.verifyButtonText}>Verificar</Text>
                </TouchableOpacity>

                {/* --- SECCIÓN REENVIAR CÓDIGO --- */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>¿No recibiste el código?</Text>
                    
                    <TouchableOpacity style={styles.resendAction}>
                        <Image style={styles.refreshIcon} source={require('../../assets/refreshIcon.png')} />
                        <Text style={styles.resendActionText}>Reenviar código</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.timerText}>
                        Disponible en <Text style={styles.timerBold}>00:59</Text>
                    </Text>
                </View>

                {/* --- TARJETA DE SEGURIDAD --- */}
                <View style={styles.securityCard}>
                    <View style={styles.shieldIconContainer}>
                        <Image style={styles.shieldIcon} source={require('../../assets/shieldIcon.png')} />
                    </View>
                    <View style={styles.securityTextContainer}>
                        <Text style={styles.securityTitle}>Tu seguridad es nuestra prioridad</Text>
                        <Text style={styles.securitySubtitle}>Nunca compartas este código con nadie.</Text>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0', 
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#FF1A1A', 
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerLogo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF1A1A',
    },

    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    // icono principal estilos
    iconWrapper: {
        position: 'relative', // Para que el badge se posicione respecto a este contenedor
        marginBottom: 30,
    },
    mainIconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45, 
        backgroundColor: '#FDEAEB', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailIcon: {
        width: 40,
        height: 40,
        tintColor: '#FF1A1A',
        resizeMode: 'contain',
    },

    badgeIconContainer: {
        borderRadius:'50%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        backgroundColor: '#FFFFFF',
        elevation: 3, 
        position: 'absolute',
        bottom: -30,
        right: -15,
    },
    badgeIcon: {
        width: 25,
        height: 25,
    },

    // estilo de texto
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    emailMask: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF1A1A',
        marginBottom: 30,
    },

    // inputs de OTP estilos
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10, // Separación entre cajitas
        width: '100%',
        marginBottom: 30,
        
    },
    otpInput: {
        width: 45,
        height: 45,
        backgroundColor: '#F9FAFB', 
        borderRadius: 8,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',        
    },

    // --- BOTÓN VERIFICAR ---
    verifyButton: {
        backgroundColor: '#FF1A1A',
        width: '85%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 30,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // estilo de apartado de reeenviado
    resendContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    resendText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 10,
    },
    resendAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    refreshIcon: {
        width: 16,
        height: 16,
        tintColor: '#FF1A1A',
        marginRight: 6,
    },
    resendActionText: {
        color: '#FF1A1A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    timerText: {
        fontSize: 12,
        color: '#999999',
    },
    timerBold: {
        fontWeight: 'bold',
        color: '#666666',
    },

    //Estilo de tarjeta de seguridad
    securityCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: '85%',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0', // Borde sutil gris
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    shieldIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    shieldIcon: {
        tintColor: '#666666',
    },
    securityTextContainer: {
        flex: 1, 
    },
    securityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 7,
    },
    securitySubtitle: {
        fontSize: 13,
        color: '#5E3F3C',
        lineHeight: 18,
    }
});