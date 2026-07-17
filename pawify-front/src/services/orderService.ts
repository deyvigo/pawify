import { api } from './api';
import { SliceResponse, OrderResponseDTO, OrderCreateRequestDTO } from '../types/orders';


// Crea una nueva orden en el backend
export const createOrder = async (orderData: OrderCreateRequestDTO): Promise<OrderResponseDTO> => {
    // Hace un POST a /order enviando los detalles del carrito
    const response = await api.post('/order', orderData);
    return response as unknown as OrderResponseDTO;
};

export const getFilteredOrders = async (
    cursor?: string,
    size: number = 10,
    shippingStatus?: string,
    trackingCode?: string
): Promise<SliceResponse<OrderResponseDTO>> => {
    
    const params = new URLSearchParams();
    params.append('size', size.toString());
    
    if (cursor && cursor !== 'undefined') {
        params.append('cursor', cursor);
    }
    
    if (shippingStatus) {
        params.append('shippingStatus', shippingStatus);
    }
    
    if (trackingCode) {
        params.append('trackingCode', trackingCode);
    }

    const response = await api.get(`/order?${params.toString()}`);
    return response as unknown as SliceResponse<OrderResponseDTO>;
};

export const getOrdersByBuyer = async (page: number = 0, size: number = 10): Promise<SliceResponse<OrderResponseDTO>> => {
    const response = await api.get(`/order?page=${page}&size=${size}`);
    return response as unknown as SliceResponse<OrderResponseDTO>;
};

// Obtiene una orden por su codigo de seguimiento
export const getOrderByTrackingCode = async (trackingCode: string): Promise<OrderResponseDTO> => {
    const response = await api.get(`/order/${trackingCode}`);
    return response as unknown as OrderResponseDTO;
};


