export interface DetailCreateRequestDTO {
    product_id: number;
    quantity: number;
}

export interface OrderCreateRequestDTO {
    details: DetailCreateRequestDTO[];
}

// --- DTOs de Respuesta (GET) ---
export interface DetailResponseDTO {
    id: number;
    product_name: string; 
    quantity: number;
    price: number;
    total: number;
    product_image: string; 
}

export interface OrderResponseDTO {
    id: number;
    total_price: number; 
    order_at: string; 
    tracking_code: string;
    shipping_status: string; 
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