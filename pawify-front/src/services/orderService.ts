import { api } from './api';
import { SliceResponse, OrderResponseDTO, OrderCreateRequestDTO } from '../types/orders';


// Crea una nueva orden en el backend
export const createOrder = async (orderData: OrderCreateRequestDTO): Promise<OrderResponseDTO> => {
    // Hace un POST a /order enviando los detalles del carrito
    const response = await api.post('/order', orderData);
    return response as unknown as OrderResponseDTO;
};

// Obtiene el historial de ordenes del comprador autenticado
export const getOrdersByBuyer = async (page: number = 0, size: number = 10): Promise<SliceResponse<OrderResponseDTO>> => {
    const response = await api.get(`/order?page=${page}&size=${size}`);
    return response as unknown as SliceResponse<OrderResponseDTO>;
};

// Obtiene una orden por su codigo de seguimiento
export const getOrderByTrackingCode = async (trackingCode: string): Promise<OrderResponseDTO> => {
    const response = await api.get(`/order/${trackingCode}`);
    return response as unknown as OrderResponseDTO;
};


