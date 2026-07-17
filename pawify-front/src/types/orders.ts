// Payload para un item individual de una orden
export interface DetailCreateRequestDTO {
    // Identificador del producto a ordenar
    product_id: number;
    // Cantidad de unidades a ordenar
    quantity: number;
}

// Payload para crear una nueva orden
export interface OrderCreateRequestDTO {
    // Lista de items de la orden
    details: DetailCreateRequestDTO[];
}

// DTO de un item de orden devuelto por la API
export interface DetailResponseDTO {
    // Identificador unico del item
    id: number;
    // Nombre del producto en esta linea
    product_name: string;
    // Cantidad ordenada
    quantity: number;
    // Precio unitario del producto
    price: number;
    // Costo total de esta linea (precio * cantidad)
    total: number;
    // URL de la imagen del producto
    product_image: string; 
    reviewed: boolean;
}

// DTO de una orden devuelto por la API
export interface OrderResponseDTO {
    // Identificador unico de la orden
    id: number;
    // Precio total de la orden
    total_price: number;
    // Fecha de la orden en formato ISO 8601
    order_at: string;
    // Codigo de seguimiento unico
    tracking_code: string;
    // Estado actual del envio
    shipping_status: string;
    order_status: string;
    // Items de la orden
    details: DetailResponseDTO[];
}
export interface SliceResponse<T> {
    // Lista de elementos de la pagina actual
    content: T[];
    // Es la ultima pagina
    last: boolean;
    // Es la primera pagina
    first: boolean;
    // No hay resultados
    empty: boolean;
    // Numero de pagina actual (desde 0)
    number: number;
    // Cantidad de elementos por pagina
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