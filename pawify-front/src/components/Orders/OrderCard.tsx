import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { OrderResponseDTO } from '../../types/orders';

interface OrderCardProps {
    order: OrderResponseDTO;
    onPressDetail: (order: OrderResponseDTO) => void;
}

export const OrderCard = ({ order, onPressDetail }: OrderCardProps) => {
    

    const getShippingStyle = (status: string) => {
        const safeStatus = status || 'IN_TRANSIT'; 
        
        switch(safeStatus.toUpperCase()) {
            case 'DELIVERED': 
                return { bg: '#E5E7EB', text: '#4B5563', label: 'Entregado' };
            case 'IN_TRANSIT':
            default: 
                return { bg: '#FF1A1A', text: '#FFFFFF', label: 'En camino' };
        }
    };

    const getOrderStyle = (status: string) => {
        const safeStatus = status || 'PENDING';

        switch(safeStatus.toUpperCase()) {
            case 'PAID':
                return { bg: '#D1FAE5', text: '#059669', label: 'Pagado' }; // Verde
            case 'FAILED':
                return { bg: '#FEE2E2', text: '#B91C1C', label: 'Pago Fallido' }; // Rojo claro
            case 'CANCELED':
                return { bg: '#F3F4F6', text: '#374151', label: 'Cancelado' }; // Gris
            case 'PENDING':
            default:
                return { bg: '#FEF3C7', text: '#D97706', label: 'Pendiente' }; // Amarillo/Naranja
        }
    };

    const formatDate = (dateString: string) => {
            if (!dateString) return 'Fecha desconocida';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const shippingConfig = getShippingStyle(order.shipping_status);
    const orderConfig = getOrderStyle(order.order_status);

    return (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.orderId}>ID: #{order.tracking_code}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.order_at)}</Text>
                </View>
                <View style={styles.badgesContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: orderConfig.bg, marginBottom: 5 }]}>
                        <Text style={[styles.statusText, { color: orderConfig.text }]}>• {orderConfig.label}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: shippingConfig.bg }]}>
                        <Text style={[styles.statusText, { color: shippingConfig.text }]}>• {shippingConfig.label}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.imagesContainer}>
                    {order.details.slice(0, 2).map((detail, index) => (
                        <Image 
                            key={index} 
                            source={{ uri: detail.product_image || 'https://via.placeholder.com/150' }} 
                            style={[styles.productThumbnail, index > 0 && { marginLeft: -15 }]} 
                        />
                    ))}
                    {order.details.length > 2 && (
                        <View style={styles.extraProductsBadge}>
                            <Text style={styles.extraProductsText}>+{order.details.length - 2}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.productCount}>{order.details.length} productos</Text>
                    <Text style={styles.totalPrice}>S/ {order.total_price.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <TouchableOpacity 
                    style={styles.detailButton} 
                    onPress={() => onPressDetail(order)}
                >
                    <Text style={styles.detailButtonText}>Ver Detalle del Pedido</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    orderId: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
    orderDate: { fontSize: 15, fontWeight: 'bold', color: '#111827' },

    badgesContainer: { alignItems: 'flex-end' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    imagesContainer: { flexDirection: 'row', alignItems: 'center' },
    productThumbnail: { width: 50, height: 50, borderRadius: 8, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#F3F4F6' },
    extraProductsBadge: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginLeft: -15, borderWidth: 2, borderColor: '#FFFFFF' },
    extraProductsText: { color: '#4B5563', fontWeight: 'bold', fontSize: 12 },
    priceContainer: { alignItems: 'flex-end' },
    productCount: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
    totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#B91C1C' },
    cardFooter: { 
        marginTop: 5,
    },
    detailButton: { 
        backgroundColor: '#FFFFFF', 
        paddingVertical: 14, 
        borderRadius: 10, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#B91C1C', // Borde rojo oscuro
    },
    detailButtonText: { 
        color: '#B91C1C', // Texto rojo oscuro
        fontWeight: 'bold', 
        fontSize: 14 
    }
});