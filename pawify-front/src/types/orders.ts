/**
 * Request payload for a single order line item.
 */
export interface DetailCreateRequestDTO {
    /** Identifier of the product being ordered */
    product_id: number;
    /** Number of units to order */
    quantity: number;
}

/**
 * Request payload for creating a new order.
 */
export interface OrderCreateRequestDTO {
    /** Array of line items to include in the order */
    details: DetailCreateRequestDTO[];
}

/**
 * Order line item data transfer object returned by the API.
 */
export interface DetailResponseDTO {
    /** Unique detail identifier */
    id: number;
    /** Name of the product in this line item */
    product_name: string;
    /** Number of units ordered */
    quantity: number;
    /** Unit price of the product */
    price: number;
    /** Total cost for this line item (price * quantity) */
    total: number;
    /** URL of the product image */
    product_image: string;
}

/**
 * Order data transfer object returned by the API.
 */
export interface OrderResponseDTO {
    /** Unique order identifier */
    id: number;
    /** Total order price */
    total_price: number;
    /** ISO 8601 timestamp of when the order was placed */
    order_at: string;
    /** Unique tracking code for the order */
    tracking_code: string;
    /** Current shipping status (e.g. "PROCESSING", "SHIPPED", "DELIVERED") */
    shipping_status: string;
    /** Line items in this order */
    details: DetailResponseDTO[];
}

/**
 * Generic paginated response wrapper matching Spring Boot's slice format.
 * @template T - The type of items contained in the response.
 */
export interface SliceResponse<T> {
    /** Array of items for the current page */
    content: T[];
    /** Whether this is the last page of results */
    last: boolean;
    /** Whether this is the first page of results */
    first: boolean;
    /** Whether the result set is empty */
    empty: boolean;
    /** Current page number (zero-indexed) */
    number: number;
    /** Number of items per page */
    size: number;
}