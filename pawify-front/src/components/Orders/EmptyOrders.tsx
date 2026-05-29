import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const EmptyOrders = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Image source={require('../../../assets/boxIcon.png')} style={styles.icon} />
            </View>
            <Text style={styles.title}>Aún no tienes pedidos</Text>
            <Text style={styles.subtitle}>
                Explora nuestro catálogo y descubre los mejores productos para tu mascota. ¡Tus pedidos aparecerán aquí!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: 60,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FDEAEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        width: 50,
        height: 50,
        tintColor: '#B91C1C',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    }
});