import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity ,Image} from 'react-native';


export const LoginScreen = () => {

    const [email, setEmail] = useState<String>('');
    const [password, setPassword] = useState<String>('');

    const [showPassword, setShowPassword] = useState<boolean>(false);



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
                    <Text style={styles.label1}>Correo Electrónico</Text>
                    <View style={styles.fieldContainer}>
                        <Image  source={require('../../assets/correoIcon.png') } />
                        <TextInput 
                            style={styles.input}
                            placeholder="ejemplo@correo.com"
                            placeholderTextColor="#6B7280" 
                            keyboardType="email-address"
                            autoCapitalize="none"  
                            value={email}
                            onChangeText={setEmail}
                        />                 
                    </View>
                </View>
                <View style={styles.inputcontainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.label2}>Contraseña</Text>
                        <TouchableOpacity >
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

                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footeText}> 
                <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
                <TouchableOpacity>
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