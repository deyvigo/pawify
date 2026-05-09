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

    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const { login, isLoading } = useAuthentication(onLoginSuccess);



    const handleForgotPassword = async () => {
        // Validamos que el usuario haya escrito su nombre de usuario
        const cleanUsername = username.trim();

        if (!cleanUsername) {
            Alert.alert('Atención', 'Por favor, ingrese su Nombre de Usuario');
            return;
        }

        if (cleanUsername.length < 6) {
            Alert.alert('Atención', 'El Nombre de Usuario debe tener al menos 6 caracteres');
            return;
        }

        try {
            // Disparamos la petición al back
            await requestRecoveryCode(cleanUsername); 
            
            Alert.alert(
                'Solicitud recibida', 
                'Si el usuario existe en nuestro sistema, hemos enviado un código de seguridad a su correo asociado.'
            );
            
            // 3. solo si la petición fue exitosa, navegamos a la pantalla de recuperación y le pasamos el username
            onNavigateToForgotPassword(cleanUsername);
            
        } catch (error) {
            console.log("ERROR REAL DEL BACKEND:", error);
            console.error(error);
            Alert.alert('Error', 'No encontramos una cuenta con ese usuario o hubo un problema de conexión.');
        }
    };

    const handleLogin = () => {
        if (username.length < 6 || password.length < 8) {
            Alert.alert('Atención', 'Por favor, corrige los errores en rojo antes de continuar.');
            return;
        }
        login(username, password);
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
                    <View style={[styles.fieldContainer, usernameError ? styles.fieldErrorBorder : null]}>
                        <Image  source={require('../../assets/userIcon.png') } />
                        <TextInput 
                            style={styles.input}
                            placeholder="Tu nombre de usuario"
                            placeholderTextColor="#6B7280" 
                            autoCapitalize="none"  
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (text.length > 0 && text.length < 6) {
                                    setUsernameError('El usuario debe tener al menos 6 caracteres');
                                } else {
                                    setUsernameError(''); 
                                }
                            }}
                        />                 
                    </View>
                    {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                </View>
                <View style={styles.inputcontainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.label2}>Contraseña</Text>
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.fieldContainer, passwordError ? styles.fieldErrorBorder : null]}>
                        <Image  source={require('../../assets/passIcon.png') } />
                        <TextInput 
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#6B7280" 
                            secureTextEntry={!showPassword} // para ocultar texto con asteriscos
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (text.length > 0 && text.length < 8) {
                                    setPasswordError('La contraseña debe tener al menos 8 caracteres');
                                } else {
                                    setPasswordError('');
                                }
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Image style={styles.eyeIcon} source={require('../../assets/eyeIcon.png')} />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
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

    errorText: {
        color: '#FF1A1A',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: '500',
    },
    fieldErrorBorder: {
        borderWidth: 1,
        borderColor: '#FF1A1A',
        backgroundColor: '#FFF5F5', 
    }

    
})