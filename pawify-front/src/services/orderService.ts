import { api } from './api';
import { SliceResponse, OrderResponseDTO, OrderCreateRequestDTO } from '../types/orders';


/**
 * Creates a new order by sending the cart details to the backend.
 *
 * @param orderData - The order creation payload containing line item details.
 * @returns A promise that resolves to the created order response.
 */
export const createOrder = async (orderData: OrderCreateRequestDTO): Promise<OrderResponseDTO> => {
    // Hace un POST a /order enviando los detalles del carrito
    const response = await api.post('/order', orderData);
    return response as unknown as OrderResponseDTO;
};

/**
 * Retrieves a paginated list of orders for the authenticated buyer.
 *
 * @param page - Zero-based page number. Defaults to 0.
 * @param size - Number of orders per page. Defaults to 10.
 * @returns A promise that resolves to a paginated slice of order responses.
 */
export const getOrdersByBuyer = async (page: number = 0, size: number = 10): Promise<SliceResponse<OrderResponseDTO>> => {
    const response = await api.get(`/order?page=${page}&size=${size}`);
    return response as unknown as SliceResponse<OrderResponseDTO>;
};

/**
 * Retrieves a single order by its unique tracking code.
 *
 * @param trackingCode - The unique tracking code of the order to retrieve.
 * @returns A promise that resolves to the order response for the given tracking code.
 */
export const getOrderByTrackingCode = async (trackingCode: string): Promise<OrderResponseDTO> => {
    const response = await api.get(`/order/${trackingCode}`);
    return response as unknown as OrderResponseDTO;
};


