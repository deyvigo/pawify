import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ScrollView, 
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRegister } from '../hooks/useRegister';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EyeOffIcon } from '../components/icons/EyeOffIcon';

interface RegisterProps {
    onNavigateToLogin: () => void;
}

export const RegisterScreen = ({ onNavigateToLogin }: RegisterProps) => {
    // 1. Estados para capturar los datos del formulario
    const [username, setUsername] = useState<string>('');   
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>(''); 
    const [email, setEmail] = useState<string>('');
    const [dniNumber, setDniNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false); // Estado para el checkbox
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    
    //Estaddos de error visual para cada campo 
    const [firstNameError, setFirstNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [dniError, setDniError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');


    const { register, isLoading } = useRegister();

    // Función auxiliar para validar correo
    const isValidEmail = (emailText: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailText);
    };

    const handleRegister = () => {
        // Validamos que ningún campo obligatorio esté vacío y que no haya errores pendientes en rojo
        let hasEmptyFields = false;

            if (!firstName.trim()) { setFirstNameError('Obligatorio'); hasEmptyFields = true; }
            if (!lastName.trim()) { setLastNameError('Obligatorio'); hasEmptyFields = true; }
            if (!username.trim()) { setUsernameError('Obligatorio'); hasEmptyFields = true; }
            if (!dniNumber.trim()) { setDniError('Obligatorio'); hasEmptyFields = true; }
            if (!email.trim()) { setEmailError('Obligatorio'); hasEmptyFields = true; }
            if (!password.trim()) { setPasswordError('Obligatorio'); hasEmptyFields = true; }
            if (!confirmPassword.trim()) { setConfirmPasswordError('Obligatorio'); hasEmptyFields = true; }

            // Si encontramos alguno vacío, detenemos todo
            if (hasEmptyFields) {
                Alert.alert('Atención', 'Por favor, completa los campos obligatorios marcados en rojo.');
                return;
            }

            // 2. Validamos si hay errores de formato (ej. contraseña corta, correo mal escrito)
            if (firstNameError || lastNameError || usernameError || dniError || emailError || passwordError || confirmPasswordError) {
                Alert.alert('Atención', 'Por favor, corrige los errores marcados en rojo antes de continuar.');
                return;
            }

            if (!acceptTerms) {
                Alert.alert('Atención', 'Debes aceptar los términos y condiciones.');
                return;
            }
        
        const userData = {
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            dni_number: dniNumber,
            password
        };

        // Ejecutamos la función del hook
        register(userData, confirmPassword, acceptTerms, () => {

            onNavigateToLogin();
        });
    };


    return (
        <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
        >
            {/* Imagen de fondo con opacidad */}
            <View style={styles.imageWrapper}>
                <Image 
                    source={require('../../assets/fondoRegister.png')} 
                    style={styles.backgroundImage} 
                />
                <View style={styles.overlay} />
            </View>

            {/* Logo de la parte superior */}
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../assets/logopawify.png')} />
                <Text style={styles.logoTitle}>Pawify</Text>
            </View>
            
            {/* Tarjeta Blanca Principal */}
            <View style={styles.formContainer}>
                
                <Text style={styles.cardTitle}>Crear una cuenta</Text>
                <Text style={styles.cardSubtitle}>Comienza hoy mismo tu aventura con nosotros.</Text>

                {/* Input: Nombre Completo */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Nombre y Apellidos</Text>
                    <View style={styles.rowInputs} >
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <View style={[styles.fieldContainer,firstNameError ? styles.fieldErrorBorder : null]}>
                                <TextInput style={styles.input} placeholder="Nombres" placeholderTextColor="#A3A3A3" value={firstName} 
                                    onChangeText={(text) => {
                                        setFirstName(text);
                                        if (text.trim().length === 0) {
                                            setFirstNameError('Campo obligatorio');
                                        } else {
                                            setFirstNameError('');
                                        }
                                    }}
                                />
                            </View>
                            {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                        </View>
                        <View style={ { flex: 1, marginLeft: 5 }}>
                            <View style={[styles.fieldContainer,lastNameError ? styles.fieldErrorBorder : null]}>
                                <TextInput style={styles.input} placeholder="Apellidos" placeholderTextColor="#A3A3A3" value={lastName} 
                                    onChangeText={(text) => {
                                        setLastName(text);
                                        if (text.trim().length === 0) {
                                            setLastNameError('Campo obligatorio');
                                        } else {
                                            setLastNameError('');
                                        }
                                    }} 
                                />
                            </View>
                            {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                        </View>
                    </View>
                </View>

                {/* Input: Username */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Nombre de Usuario </Text>
                    <View style={[styles.fieldContainer, usernameError ? styles.fieldErrorBorder : null]}>
                        <Image style={styles.icon} source={require('../../assets/userIcon.png')} />
                        <TextInput style={styles.input} placeholder="Ej. juanperez123" placeholderTextColor="#A3A3A3" autoCapitalize="none" value={username}
                            onChangeText={(text) => {
                                    setUsername(text);
                                    if (text.length > 0 && text.length < 6) {
                                        setUsernameError('Mínimo 6 caracteres');
                                    } else {
                                        setUsernameError('');
                                    }
                            }}
                        />
                    </View>
                    {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                </View>


                {/* Input: DNI */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Documento de Identidad</Text>
                    <View style={[styles.fieldContainer, dniError ? styles.fieldErrorBorder : null]}>
                        <Image style={styles.icon} source={require('../../assets/identityIcon.png')} />
                        <TextInput style={styles.input} placeholder="12345678" placeholderTextColor="#A3A3A3" keyboardType="numeric" maxLength={8} value={dniNumber} 
                            onChangeText={(text) => {
                                // Solo permite números
                                const numericValue = text.replace(/[^0-9]/g, '');
                                setDniNumber(numericValue);
                                if (numericValue.length > 0 && numericValue.length < 8) {
                                    setDniError('Debe tener 8 dígitos exactos');
                                } else {
                                    setDniError('');
                                }
                            }} 
                        />
                    </View>
                    {dniError ? <Text style={styles.errorText}>{dniError}</Text> : null}
                </View>

                {/* Input: Correo Electrónico */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <View style={[styles.fieldContainer, emailError ? styles.fieldErrorBorder : null]}>
                        <Image style={styles.icon} source={require('../../assets/correoIcon.png')} />
                        <TextInput 
                            style={styles.input}
                            placeholder="hola@ejemplo.com"
                            placeholderTextColor="#A3A3A3" 
                            keyboardType="email-address"
                            autoCapitalize="none"  
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (text.length > 0 && !isValidEmail(text)) {
                                    setEmailError('Formato de correo inválido');
                                } else {
                                    setEmailError('');
                                }
                            }}
                        />
                    </View>
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                {/* Input: Contraseña */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={[styles.fieldContainer, passwordError ? styles.fieldErrorBorder : null]}>
                        <Image style={styles.icon} source={require('../../assets/passIcon.png')} />
                        <TextInput 
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#A3A3A3" 
                            secureTextEntry={!showPassword} 
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (text.length > 0 && text.length < 8) {
                                    setPasswordError('Mínimo 8 caracteres');
                                } else {
                                    setPasswordError('');
                                }
                                // Si cambia la contraseña, re-validamos la confirmación
                                if (confirmPassword.length > 0 && text !== confirmPassword) {
                                    setConfirmPasswordError('Las contraseñas no coinciden');
                                } else if (text === confirmPassword) {
                                    setConfirmPasswordError('');
                                }
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOffIcon color="#6B7280" size={22} /> : <EyeIcon color="#6B7280" size={22} />}
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                {/* Input: Confirmar Contraseña */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Confirmar Contraseña</Text>
                    <View style={[styles.fieldContainer, confirmPasswordError ? styles.fieldErrorBorder : null]}>
                        <Image style={styles.icon} source={require('../../assets/reloadIcon.png')} />
                        <TextInput 
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#A3A3A3" 
                            secureTextEntry={!showConfirmPassword} 
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (text.length > 0 && text !== password) {
                                    setConfirmPasswordError('Las contraseñas no coinciden');
                                } else {
                                    setConfirmPasswordError('');
                                }
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOffIcon color="#6B7280" size={22} /> : <EyeIcon color="#6B7280" size={22} />}
                        </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                </View>

                {/* Checkbox de Términos y Condiciones */}
                <TouchableOpacity 
                    style={styles.termsContainer} 
                    activeOpacity={0.8}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                >
                    <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                        {acceptTerms && <View style={styles.checkMark} />}
                    </View>
                    <Text style={styles.termsText}>
                        Acepto los <Text style={styles.linkText}>términos y condiciones</Text> y la <Text style={styles.linkText}>política de privacidad.</Text>
                    </Text>
                </TouchableOpacity>

                {/* Botón Principal */}
                <TouchableOpacity style={styles.registerButton}onPress={handleRegister} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                            <Image style={styles.arrowIcon} source={require('../../assets/arrowIcon.png')} />
                        </>
                    )}
                </TouchableOpacity>

                {/* Línea Separadora*/}
                <View style={styles.divider} />

                {/* Ir al Login */}
                <View style={styles.footerLogin}>
                    <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                    <TouchableOpacity style={styles.loginLinkContainer} onPress={onNavigateToLogin}>
                        <Text style={styles.loginText}>Iniciar Sesión</Text>
                        <Image style={styles.loginIcon} source={require('../../assets/loginIcon.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Copyright Footer */}
            <Text style={styles.copyrightText}>© 2026 Pawify. Todos los derechos reservados.</Text>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Usamos flexGrow en lugar de flex en ScrollViews
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingBottom: 40, // Espacio extra al final de la pantalla
    },

    // --- IMAGEN DE FONDO ABSOLUTA ---
    imageWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: "30%", 
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    // --- HEADER (LOGO) ---
    logoContainer: {
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 20,
    },
    logo: {
        tintColor: '#FF1A1A',
        width: 86,
        height: 78,
        resizeMode: 'contain',
    },
    logoTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 5,
    },

    // --- TARJETA PRINCIPAL ---
    formContainer: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        paddingVertical: 30,   
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 30,
        
        // Efecto de sombra (Shadow/Elevation)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },

    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 16,
        color: '#5E3F3C',
        marginBottom: 25,
    },

    // --- SECCIÓN DE INPUTS ---
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5E3F3C',
        marginBottom: 8,
    },

    rowInputs: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },

    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        height: 55,
        paddingHorizontal: 15,
    },
    icon: {
        tintColor: '#5E3F3C',
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
    },

    // --- CHECKBOX Y TÉRMINOS ---
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 25,
        marginTop: 5,
        paddingRight: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        marginRight: 10,
        marginTop: 2, // Ajuste sutil para alinear con el texto
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        borderColor: '#FF1A1A',
        backgroundColor: '#FFF',
    },
    checkMark: {
        width: 10,
        height: 10,
        backgroundColor: '#FF1A1A',
        borderRadius: 2,
    },
    termsText: {
        flex: 1,
        fontSize: 12,
        color: '#666666',
        lineHeight: 18,
    },
    linkText: {
        color: '#FF1A1A',
        fontWeight: '600',
    },

    // --- BOTÓN DE REGISTRO ---
    registerButton: {
        backgroundColor: '#FF1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        height: 55,
        marginBottom: 25,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    arrowIcon: {
        width: 16,
        height: 16,
        tintColor: '#FFFFFF',
    },

    // --- FOOTER DENTRO DE LA TARJETA ---
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
    },
    footerLogin: {
        alignItems: 'center',
    },
    footerText: {
        color: '#666666',
        fontSize: 13,
        marginBottom: 10,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        color: '#FF1A1A',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
    },
    loginIcon: {
        width: 18,
        height: 18,
        tintColor: '#FF1A1A',
    },

    // --- COPYRIGHT ---
    copyrightText: {
        marginTop: 20,
        fontSize: 11,
        color: '#999999',
    }
});