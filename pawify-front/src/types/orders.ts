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
    order_status: string;
    details: DetailResponseDTO[];
}

export interface SliceResponse<T> {
    content: T[];
    last: boolean;
    first: boolean;
    empty: boolean;
    number: number;
    size: number;
}

// --- Claims ---
export interface ClaimResponseDTO {
    id: number;
    last_message?: string;
    last_modified: string;
    last_message_sender?: string;
    detail: DetailResponseDTO;
}

export interface MessageResponseDTO {
    id: number;
    claim_id: number;
    content: string;
    send_at: string;
    sender: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
}

export type CursorPage<T> = {
    content: T[];
    cursor?: string;
    has_next: boolean;
};