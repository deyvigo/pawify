import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderResponseDTO, ClaimResponseDTO } from '../types/orders';
import { createClaim } from '../services/claimService';

interface OrderDetailProps {
    order: OrderResponseDTO;
    onBack: () => void;
    onNavigateToClaim: (claim: ClaimResponseDTO) => void;
}

export const OrderDetailScreen = ({ order, onBack, onNavigateToClaim }: OrderDetailProps) => {
    const [claims, setClaims] = useState<Record<number, ClaimResponseDTO>>({});

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const translateStatus = (status: string) => {
        const safeStatus = status || 'PAID';
        switch (safeStatus.toUpperCase()) {
            case 'PAID':
                return 'Pagado';
            case 'PROCESSING':
                return 'Procesando';
            case 'IN_TRANSIT':
                return 'En tránsito'; 
            case 'DELIVERED':
                return 'Entregado';
            case 'CANCELLED':
                return 'Cancelado';
            default:
                return safeStatus;
        }
    };


    const getStatusWeight = (status: string) => {
        const safeStatus = status || 'PAID';
        switch (safeStatus.toUpperCase()) {
            case 'DELIVERED':   return 3; 
            case 'IN_TRANSIT':  return 2;
            case 'PROCESSING': return 1; 
            case 'PAID': 
            default:            return 0; 
        }
    };

    const currentProgressWeight = getStatusWeight(order.shipping_status);
    const timelineSteps = ['Pedido Recibido', 'Procesando', 'Enviado', 'Entregado'];

    const handleClaim = async (detailId: number, productName: string) => {
      try {
        const claim = await createClaim(detailId);
        setClaims(prev => ({ ...prev, [detailId]: claim }));
        onNavigateToClaim(claim);
      } catch (error) {
        Alert.alert('Error', 'No se pudo crear el reclamo. Intenta de nuevo.');
      }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Image source={require('../../assets/arrowLeftIcon.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle del Pedido</Text>
                <Image source={require('../../assets/cartIcon.png')} style={styles.headerCart} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Tarjeta 1: Info Básica */}
                <View style={styles.card}>
                    <Text style={styles.cardSubtitle}>ID DEL PEDIDO</Text>
                    <Text style={styles.orderId}>#{order.tracking_code}</Text>
                    <Text style={styles.orderDate}>📅 Realizado el {formatDate(order.order_at)}</Text>
                </View>

                {/* Tarjeta 2: Banner de Estado */}
                <View style={styles.statusBanner}>
                    <Image source={require('../../assets/boxIcon.png')} style={styles.statusIcon} />
                    <Text style={styles.statusBannerSubtitle}>ESTADO</Text>
                    <Text style={styles.statusBannerTitle}>{translateStatus(order.shipping_status)}</Text>
                </View>

                {/* Tarjeta 3: Seguimiento  */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>SEGUIMIENTO DEL ENVÍO</Text>
                    <View style={styles.timelineContainer}>
                        {timelineSteps.map((step, index) => {
                            // Un paso está completado si su índice es menor o igual al progreso actual
                            const isStepDone = index <= currentProgressWeight;
                            // La línea se pinta si el progreso actual ya superó este paso
                            const isLineDone = index < currentProgressWeight;

                            return (
                                <View key={index} style={styles.timelineRow}>
                                    <View style={styles.timelineDotContainer}>
                                        <View style={[
                                            styles.timelineDot, 
                                            isStepDone ? styles.timelineDotActive : styles.timelineDotInactive
                                        ]} />
                                        {index < 3 && (
                                            <View style={[
                                                styles.timelineLine, 
                                                isLineDone ? styles.timelineLineActive : styles.timelineLineInactive
                                            ]} />
                                        )}
                                    </View>
                                    <View style={styles.timelineTextContainer}>
                                        <Text style={[
                                            styles.timelineStepText, 
                                            !isStepDone && { color: '#9CA3AF' }
                                        ]}>
                                            {step}
                                        </Text>
                                        <Text style={styles.timelineTimeText}>
                                            {index === 0 && order.order_at ? formatDate(order.order_at) : isStepDone ? 'Completado' : 'Pendiente'}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Tarjeta 4: Artículos */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>ARTÍCULOS EN ESTE PEDIDO</Text>
                    {order.details.map((item) => (
                        <View key={item.id}>
                            <View style={styles.itemRow}>
                                <Image source={{ uri: item.product_image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.product_name}</Text>
                                    <Text style={styles.itemSubText}>Cantidad: {item.quantity}</Text>
                                </View>
                                <View style={styles.itemPriceContainer}>
                                    <Text style={styles.itemTotal}>S/{item.total.toFixed(2)}</Text>
                                    <Text style={styles.itemUnit}>S/{item.price.toFixed(2)} c/u</Text>
                                </View>
                            </View>
                            {order.shipping_status === 'DELIVERED' && (
                                claims[item.id] ? (
                                    <TouchableOpacity
                                        style={styles.claimButton}
                                        onPress={() => onNavigateToClaim(claims[item.id])}
                                    >
                                        <Text style={styles.claimButtonText}>Ver reclamo</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.claimButton}
                                        onPress={() => handleClaim(item.id, item.product_name)}
                                    >
                                        <Text style={styles.claimButtonText}>Reclamar</Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    ))}
                </View>

                {/* Tarjeta 5: Resumen de Pago (Cuadro Rojo) */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryText}>Subtotal</Text>
                        <Text style={styles.summaryText}>${order.total_price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryText}>Envío</Text>
                        <Text style={styles.summaryText}>GRATIS</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotalText}>Total</Text>
                        <Text style={styles.summaryTotalText}>S/{order.total_price.toFixed(2)}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF' },
    backButton: { padding: 5 },
    backIcon: { width: 20, height: 20, tintColor: '#B91C1C' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#B91C1C' },
    headerCart: { width: 24, height: 24, tintColor: '#B91C1C' },
    scrollContent: { padding: 20, paddingBottom: 50 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    cardSubtitle: { fontSize: 12, color: '#6B7280', fontWeight: 'bold', marginBottom: 5 },
    orderId: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
    orderDate: { fontSize: 13, color: '#4B5563' },
    statusBanner: { backgroundColor: '#B91C1C', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 15 },
    statusIcon: { width: 20, height: 20, tintColor: '#FFFFFF', marginBottom: 10 },
    statusBannerSubtitle: { color: '#FECACA', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
    statusBannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    sectionTitle: { fontSize: 12, color: '#6B7280', fontWeight: 'bold', marginBottom: 20, letterSpacing: 1 },
    timelineContainer: { marginLeft: 10 },
    timelineRow: { flexDirection: 'row', marginBottom: 0 },
    timelineDotContainer: { alignItems: 'center', width: 20, marginRight: 15 },
    timelineDot: { width: 18, height: 18, borderRadius: 9, zIndex: 2 },
    timelineDotActive: { backgroundColor: '#B91C1C' },
    timelineDotInactive: { backgroundColor: '#E5E7EB' },
    timelineLine: { 
        width: 2, 
        height: 42, 
        position: 'absolute', 
        top: 16, 
        zIndex: 1 
    },
    timelineLineActive: { 
        backgroundColor: '#B91C1C' // Rojo oscuro cuando el paso ya se completó
    },
    timelineLineInactive: { 
        backgroundColor: '#E5E7EB' // Gris claro si el paso sigue pendiente
    },
    timelineTextContainer: { paddingBottom: 25 },
    timelineStepText: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
    timelineTimeText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 15 },
    itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F3F4F6', marginRight: 15 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
    itemSubText: { fontSize: 12, color: '#6B7280' },
    itemPriceContainer: { alignItems: 'flex-end' },
    itemTotal: { fontSize: 14, fontWeight: 'bold', color: '#B91C1C', marginBottom: 4 },
    itemUnit: { fontSize: 12, color: '#6B7280' },
    claimButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DC2626',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
        marginBottom: 15,
        marginHorizontal: 0,
    },
    claimButtonText: {
        color: '#DC2626',
        fontWeight: 'bold',
        fontSize: 13,
    },
    summaryCard: { backgroundColor: '#B91C1C', borderRadius: 16, padding: 20, marginBottom: 30 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryText: { color: '#FECACA', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#991B1B', marginVertical: 10 },
    summaryTotalText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});