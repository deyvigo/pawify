/**
 * Represents the decoded JWT payload for the currently authenticated user.
 */
export interface UserPayload {
  /** Unique identifier of the user */
  id: number;
  /** Login username */
  username: string;
  /** Role assigned to the user (e.g. "buyer") */
  role: string;
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** Token expiration timestamp (Unix seconds) */
  exp: number;
  /** Optional raw JWT token string */
  token?: string;
}

/**
 * Lightweight product representation used in cart items and local views.
 */
export interface Product {
  /** Unique product identifier (string-encoded) */
  id: string;
  /** Display name of the product */
  name: string;
  /** Optional product description */
  description?: string;
  /** Product price */
  price: number;
  /** Primary product image URL */
  image: string;
  /** Average rating value */
  rating: number;
  /** Number of units sold */
  sold_count: number;
  /** Optional brand name */
  brand?: string;
  /** Optional category name */
  category?: string;
  /** Optional sub-category name */
  subCategory?: string;
  /** Available stock quantity */
  stock?: number;
  /** Number of reviews for this product */
  review_count?: number;
}

/**
 * Data transfer object for a product brand.
 */
export interface BrandDTO {
  /** Unique brand identifier */
  id: number;
  /** Brand display name */
  name: string;
}

/**
 * Simplified category data transfer object without sub-categories.
 */
export interface CategorySimpleDTO {
  /** Unique category identifier */
  id: number;
  /** Category display name */
  name: string;
}

/**
 * Data transfer object for a product sub-category.
 */
export interface SubCategoryDTO {
  /** Unique sub-category identifier */
  id: number;
  /** Sub-category display name */
  name: string;
}

/**
 * Data transfer object for a product image returned by the API.
 */
export interface ImageResponseDTO {
  /** Unique image identifier */
  id: number;
  /** Full URL to the image resource */
  url: string;
}

/**
 * Full product data transfer object returned by the product API endpoints.
 */
export interface ProductResponseDTO {
  /** Unique product identifier */
  id: number;
  /** Product display name */
  name: string;
  /** Detailed product description */
  description: string;
  /** Product price */
  price: number;
  /** Associated brand */
  brand: BrandDTO;
  /** Top-level category */
  category: CategorySimpleDTO;
  /** Sub-category within the parent category */
  sub_category: SubCategoryDTO;
  /** Total units sold */
  sold_count: number;
  /** Available stock quantity */
  stock: number;
  /** Unique code used for sharing the product link */
  share_code: string;
  /** Whether the product is currently active/listed */
  active: boolean;
  /** Total number of customer reviews */
  review_count: number;
  /** Average customer rating */
  rating: number;
  /** ISO 8601 timestamp of when the product was created */
  created_at: string;
  /** Collection of product images */
  images: ImageResponseDTO[];
}

/**
 * Sub-category data transfer object as returned in category listings.
 */
export interface SubCategoryResponseDTO {
  /** Unique sub-category identifier */
  id: number;
  /** Sub-category display name */
  name: string;
}

/**
 * Full category data transfer object including its sub-categories.
 */
export interface CategoryResponseDTO {
  /** Unique category identifier */
  id: number;
  /** Category display name */
  name: string;
  /** List of sub-categories belonging to this category */
  sub_categories: SubCategoryResponseDTO[];
}

/**
 * Brand data transfer object as returned in brand listings.
 */
export interface BrandResponseDTO {
  /** Unique brand identifier */
  id: number;
  /** Brand display name */
  name: string;
}

/**
 * Paginated response wrapper for product listings.
 */
export interface ProductsResponse {
  /** Array of products for the current page */
  content: ProductResponseDTO[];
  /** Pagination metadata */
  pageable: {
    /** Current page number (zero-indexed) */
    page: number;
    /** Number of items per page */
    size: number;
    /** Active sort descriptor */
    sort: string;
  };
  /** Total number of products across all pages */
  totalElements: number;
  /** Total number of available pages */
  totalPages: number;
  /** Whether this is the last page of results */
  last: boolean;
}

/**
 * Represents a single item in the shopping cart, including product details and quantity.
 */
export interface CartItem {
  /** Snapshot of product information at the time the item was added */
  product: {
    /** Unique product identifier */
    productId: number;
    /** Product display name */
    name: string;
    /** Primary product image URL */
    image: string;
    /** All product image URLs */
    images: string[];
    /** Product price at time of cart addition */
    price: number;
    /** Product rating at time of cart addition */
    rating: number;
    /** Units sold count at time of cart addition */
    sold: number;
    /** Product description */
    description: string;
    /** Available stock at time of cart addition */
    stock: number;
    /** Share code for the product */
    share_code: string;
    /** Whether the product is currently active */
    active: boolean;
    /** Optional brand name */
    brand?: string;
    /** Optional category name */
    category?: string;
    /** Optional sub-category name */
    sub_category?: string;
    /** Optional pet type filter */
    pet?: string;
  };
  /** Number of units of this product in the cart */
  quantity: number;
}

/**
 * Request payload for creating a new delivery address.
 */
export interface AddressCreateRequestDTO {
  /** User-defined label for the address (e.g. "Home", "Office") */
  name: string;
  /** Additional reference or directions for locating the address */
  reference: string;
  /** Geographic latitude coordinate */
  latitude: number;
  /** Geographic longitude coordinate */
  longitude: number;
}

/**
 * Address data transfer object returned by the API.
 */
export interface AddressResponseDTO {
  /** Unique address identifier */
  id: number;
  /** User-defined label for the address */
  name: string;
  /** Additional reference or directions */
  reference: string;
  /** Geographic latitude coordinate */
  latitude: number;
  /** Geographic longitude coordinate */
  longitude: number;
}

/**
 * Request payload for creating a new payment card.
 */
export interface CardCreateRequestDTO {
  /** Cardholder name */
  name: string;
  /** Card number (as string) */
  number: string;
  /** Card expiration date */
  due_date: string;
}

/**
 * Payment card data transfer object returned by the API.
 */
export interface CardResponseDTO {
  /** Unique card identifier */
  id: number;
  /** Cardholder name */
  name: string;
  /** Masked or full card number */
  number: string;
  /** Card expiration date */
  due_date: string;
}

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
 * Filter parameters for querying the product catalog.
 */
export interface ProductFilters {
  /** Free-text search query */
  search?: string;
  /** Filter by brand name */
  brand?: string;
  /** Filter by category name */
  category?: string;
  /** Filter by sub-category name */
  sub_category?: string;
  /** Minimum price boundary */
  min_price?: number;
  /** Maximum price boundary */
  max_price?: number;
  /** Sort descriptor (e.g. "price-asc", "name-az") */
  sort?: string;
}

/**
 * Buyer profile data transfer object returned by the API.
 */
export interface BuyerProfileDTO {
  /** Buyer's login username */
  username: string;
  /** Buyer's first name */
  first_name: string;
  /** Buyer's last name */
  last_name: string;
  /** National identification number */
  dni_number: string;
  /** Number of payment cards registered by the buyer */
  count_cards: number;
  /** Number of delivery addresses registered by the buyer */
  count_addresses: number;
  /** URL of the buyer's profile image, or null if not set */
  profile: string | null;
}
