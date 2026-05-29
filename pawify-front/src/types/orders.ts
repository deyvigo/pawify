export interface DetailCreateRequestDTO {
    productId: number;
    quantity: number;
}

export interface OrderCreateRequestDTO {
    details: DetailCreateRequestDTO[];
}

// --- DTOs de Respuesta (GET) ---
export interface DetailResponseDTO {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    productImage: string;
}

export interface OrderResponseDTO {
    id: number;
    totalPrice: number;
    orderAt: string; 
    trackingCode: string;
    shippingStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;
    details: DetailResponseDTO[];
}

// Paginación de Spring Boot
export interface SliceResponse<T> {
    content: T[];
    last: boolean;
    first: boolean;
    empty: boolean;
    number: number;
    size: number;
}