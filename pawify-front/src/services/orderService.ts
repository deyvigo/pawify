import { api } from './api';
import { SliceResponse, OrderResponseDTO, OrderCreateRequestDTO } from '../types/orders';


export const createOrder = async (orderData: OrderCreateRequestDTO): Promise<OrderResponseDTO> => {
    // Hace un POST a /order enviando los detalles del carrito
    const response = await api.post('/order', orderData);
    return response as unknown as OrderResponseDTO;
};

export const getOrdersByBuyer = async (page: number = 0, size: number = 10): Promise<SliceResponse<OrderResponseDTO>> => {
    const response = await api.get(`/order?page=${page}&size=${size}`);
    return response as unknown as SliceResponse<OrderResponseDTO>;
};

export const getOrderByTrackingCode = async (trackingCode: string): Promise<OrderResponseDTO> => {
    const response = await api.get(`/order/${trackingCode}`);
    return response as unknown as OrderResponseDTO;
};