import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity ,Image, ActivityIndicator,Alert} from 'react-native';

import { useAuthentication } from '../hooks/useAuthentication';
import { requestRecoveryCode } from '../services/authService';

interface LoginProps {
    onLoginSuccess: (userData: any) => void;
    onNavigateToRegister: () => void;
    onNavigateToForgotPassword: (username: string) => void;
}

export const LoginScreen = ({ onLoginSuccess, onNavigateToRegister, onNavigateToForgotPassword }: LoginProps) => {

    

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { login, isLoading } = useAuthentication(onLoginSuccess);



    const handleForgotPassword = async () => {
        // Validamos que el usuario haya escrito su nombre de usuario
        if (!username.trim()) {
            Alert.alert('Atención', 'Por favor, ingresa su Nombre de Usuario');
            return;
        }

        try {
            // Disparamos la petición al back
            await requestRecoveryCode(username); 
            
            Alert.alert('¡Código enviado!', 'Revisa tu correo electrónico para continuar.');
            
            // 3. solo si la petición fue exitosa, navegamos a la pantalla de recuperación y le pasamos el username
            onNavigateToForgotPassword(username);
            
        } catch (error) {
            console.log("ERROR REAL DEL BACKEND:", error);
            console.error(error);
            Alert.alert('Error', 'No encontramos una cuenta con ese usuario o hubo un problema de conexión.');
        }
    };

    return (

        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image 
                    source={require('../../assets/fondoLogin.png')} 
                    style={styles.backgroundImage} 
                />
                <View style={styles.overlay} />
            </View>


            <View style={styles.titleContainer}>
                <Image  style={styles.logo} source={require('../../assets/logopawify.png') } />
                <Text style={styles.title}>Pawify</Text>
                <Text style={styles.subtitle}>Tu mejor amigo merece lo mejor</Text>
            </View>
            <View style={styles.formcontainer}>
                <View style={styles.inputcontainer}>
                    <Text style={styles.label1}>Nombre de Usuario</Text>
                    <View style={styles.fieldContainer}>
                        <Image  source={require('../../assets/userIcon.png') } />
                        <TextInput 
                            style={styles.input}
                            placeholder="Tu nombre de usuario"
                            placeholderTextColor="#6B7280" 
                            autoCapitalize="none"  
                            value={username}
                            onChangeText={setUsername}
                        />                 
                    </View>
                </View>
                <View style={styles.inputcontainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.label2}>Contraseña</Text>
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Image  source={require('../../assets/passIcon.png') } />
                        <TextInput 
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#6B7280" 
                            secureTextEntry={!showPassword} // para ocultar texto con asteriscos
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Image style={styles.eyeIcon} source={require('../../assets/eyeIcon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={() => login(username, password)} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#ffffff" /> 
                    ) : (
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footeText}> 
                <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
                <TouchableOpacity onPress={onNavigateToRegister}>
                    <Text style={styles.registerText}>Regístrate gratis</Text>
                </TouchableOpacity>
            </View>

        </View>



    );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',       
    },

    imageWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '43%', 
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    titleContainer: {
        alignItems: 'center',
        marginTop: 100,

    },

    logo: {
        tintColor: '#FF1A1A',
        width: 86,
        height: 78,
    },
    
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 15,
        color: '#FFECED',
        textAlign: 'center',
        fontWeight: 'medium',
        marginTop: 5,
    },
    formcontainer: {
        backgroundColor: '#fff',
        width: '90%',
        height: 435,
        marginTop: 32,
        marginBottom: 24,
        paddingVertical: 24,   
        paddingHorizontal: 12,
        borderRadius: 12,
        elevation: 8, 
            
    },

    inputcontainer: {
        marginBottom: 24,
        padding: 10,
    },

    fieldContainer: {
        height: 55,
        backgroundColor: '#F3F3F3',
        borderRadius: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    label1:{
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    label2:{
        fontSize: 15,
        fontWeight: 'bold',
    },

    input: {
        flex: 1,
        marginLeft: 10,

    },

    eyeIcon: {
        tintColor: '#9CA3AF',
        padding: 5,
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        marginBottom: 8,
    },

    forgotPasswordText: {
        color: '#FF1A1A',
        fontWeight:'bold',
        fontSize: 12,
    },

    loginButton: {
        backgroundColor: '#FF1A1A',
        paddingVertical: 16,
        marginHorizontal: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        height: 55,
    },

    loginButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'semibold',
    },

    footeText: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',    
    },

    footerText: { 
        color: '#5E3F3C',
        fontSize: 16,
    },

    registerText: {
        color: '#FF1A1A',
        fontWeight: 'bold',
        fontSize: 14,
    },





    
})