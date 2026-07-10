import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderResponseDTO, ClaimResponseDTO } from '../types/orders';
import { createClaim } from '../services/claimService';
import { createReview } from '../services/reviewService';
import { ReviewForm } from '../components/ReviewForm';

interface OrderDetailProps {
    order: OrderResponseDTO;
    onBack: () => void;
    onNavigateToClaim: (claim: ClaimResponseDTO) => void;
}

export const OrderDetailScreen = ({ order, onBack, onNavigateToClaim }: OrderDetailProps) => {
    const [claims, setClaims] = useState<Record<number, ClaimResponseDTO>>({});
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
    const [reviewedSet, setReviewedSet] = useState<Set<number>>(
      useMemo(() => new Set(order.details.filter(d => d.reviewed).map(d => d.id)), [order])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const translateOrderStatus = (status: string) => {
        const safeStatus = status || 'PENDING';
        switch (safeStatus.toUpperCase()) {
            case 'PENDING': return 'Pendiente de Pago';
            case 'PAID': return 'Pagado';
            case 'FAILED': return 'Pago Fallido';
            case 'CANCELED': return 'Cancelado'; 
            default: return safeStatus;
        }
    };

    const translateShippingStatus = (status: string) => {
        const safeStatus = status || 'IN_TRANSIT';
        switch (safeStatus.toUpperCase()) {
            case 'DELIVERED': return 'Entregado';
            case 'IN_TRANSIT':
            default: 
                return 'En tránsito';
        }
    };


    const getCombinedStatusWeight = (orderStatus: string, shippingStatus: string) => {
        const oStatus = (orderStatus || 'PENDING').toUpperCase();
        const sStatus = (shippingStatus || 'IN_TRANSIT').toUpperCase();

        if (oStatus === 'CANCELED' || oStatus === 'FAILED') return -1; // Estado de cancelación
        if (sStatus === 'DELIVERED') return 3;                        // Entregado
        if (sStatus === 'IN_TRANSIT' && oStatus === 'PAID') return 2;  // Enviado / En camino
        if (oStatus === 'PAID') return 1;                             // Procesando
        return 0;                                                     // PENDING -> Pedido Recibido
    };

    const currentProgressWeight = getCombinedStatusWeight(order.order_status, order.shipping_status);
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

    const handleReviewSubmit = async (content: string, rating: number) => {
      if (selectedDetailId === null) return;
      try {
        await createReview({ content, rating, detail_id: selectedDetailId });
        setReviewedSet(prev => new Set(prev).add(selectedDetailId!));
        Alert.alert("Éxito", "Reseña creada exitosamente");
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        if (msg.includes('already exists')) {
          setReviewedSet(prev => new Set(prev).add(selectedDetailId!));
          Alert.alert("Info", "Ya has reseñado este producto");
        } else {
          Alert.alert("Error", msg || "Error al crear reseña");
        }
      }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Image source={require('../../assets/arrowLeftIcon.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle del Pedido</Text>
                {/* <Image source={require('../../assets/cartIcon.png')} style={styles.headerCart} /> */}
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
                    <View style={styles.statusRowContainer}>
                        <View style={styles.statusBlock}>
                            <Text style={styles.statusBannerSubtitle}>PAGO</Text>
                            <Text style={styles.statusBannerTitle}>{translateOrderStatus(order.order_status)}</Text>
                        </View>
                        <View style={styles.statusVerticalDivider} />
                        <View style={styles.statusBlock}>
                            <Text style={styles.statusBannerSubtitle}>ENVÍO</Text>
                            <Text style={styles.statusBannerTitle}>
                                {order.order_status?.toUpperCase() === 'CANCELED' ? 'N/A' : translateShippingStatus(order.shipping_status)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Tarjeta 3: Seguimiento  */}
                {currentProgressWeight === -1 ? (
                    <div style={[styles.card, { borderColor: '#EF4444', borderWidth: 1 }]}>
                        <Text style={[styles.sectionTitle, { color: '#DC2626' }]}>PEDIDO INTERRUMPIDO</Text>
                        <Text style={{ color: '#4B5563', fontSize: 14 }}>Este pedido no puede ser rastreado debido a que su estado transaccional actual es {translateOrderStatus(order.order_status)}.</Text>
                    </div>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>SEGUIMIENTO DEL ENVÍO</Text>
                        <View style={styles.timelineContainer}>
                            {timelineSteps.map((step, index) => {
                                const isStepDone = index <= currentProgressWeight;
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
                )}

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
                                <View style={styles.actionsRow}>
                                    {claims[item.id] ? (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => onNavigateToClaim(claims[item.id])}
                                        >
                                            <Text style={styles.actionButtonText}>Ver reclamo</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleClaim(item.id, item.product_name)}
                                        >
                                            <Text style={styles.actionButtonText}>Reclamar</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => { setSelectedDetailId(item.id); setReviewModalVisible(true); }}
                                    >
                                        <Text style={styles.actionButtonText}>Reseñar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Tarjeta 5: Resumen de Pago (Cuadro Rojo) */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryText}>Subtotal</Text>
                        <Text style={styles.summaryText}>S/{order.total_price.toFixed(2)}</Text>
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

            <ReviewForm
                visible={reviewModalVisible}
                onClose={() => { setReviewModalVisible(false); setSelectedDetailId(null); }}
                onSubmit={handleReviewSubmit}
                readOnly={selectedDetailId !== null && reviewedSet.has(selectedDetailId)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF' },
    backButton: { padding: 4 },
    backIcon: { width: 20, height: 20, tintColor: '#B91C1C' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#B91C1C', flex: 1, textAlign: 'center',marginRight: 24 },
    scrollContent: { padding: 20, paddingBottom: 50 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    cardSubtitle: { fontSize: 12, color: '#6B7280', fontWeight: 'bold', marginBottom: 5 },
    orderId: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
    orderDate: { fontSize: 13, color: '#4B5563' },
    
    // Estilos modificados para el banner de estado dual
    statusBanner: { backgroundColor: '#B91C1C', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 15 },
    statusIcon: { width: 20, height: 20, tintColor: '#FFFFFF', marginBottom: 12 },
    statusRowContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center' },
    statusBlock: { alignItems: 'center', flex: 1 },
    statusVerticalDivider: { width: 1, height: 30, backgroundColor: '#991B1B' },
    statusBannerSubtitle: { color: '#FECACA', fontSize: 11, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
    statusBannerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
    
    sectionTitle: { fontSize: 12, color: '#6B7280', fontWeight: 'bold', marginBottom: 20, letterSpacing: 1 },
    timelineContainer: { marginLeft: 10 },
    timelineRow: { flexDirection: 'row', marginBottom: 0 },
    timelineDotContainer: { alignItems: 'center', width: 20, marginRight: 15 },
    timelineDot: { width: 18, height: 18, borderRadius: 9, zIndex: 2 },
    timelineDotActive: { backgroundColor: '#B91C1C' },
    timelineDotInactive: { backgroundColor: '#E5E7EB' },
    timelineLine: { width: 2, height: 42, position: 'absolute', top: 16, zIndex: 1 },
    timelineLineActive: { backgroundColor: '#B91C1C' },
    timelineLineInactive: { backgroundColor: '#E5E7EB' },
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
    actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    actionButton: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DC2626', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
    actionButtonText: { color: '#DC2626', fontWeight: 'bold', fontSize: 13 },
    summaryCard: { backgroundColor: '#B91C1C', borderRadius: 16, padding: 20, marginBottom: 30 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryText: { color: '#FECACA', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#991B1B', marginVertical: 10 },
    summaryTotalText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});