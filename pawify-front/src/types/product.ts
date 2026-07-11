/**
 * Core product representation used throughout the cart and local views.
 */
export interface Product {
  /** Unique product identifier */
  productId: number;
  /** Product display name */
  name: string;
  /** Primary product image URL */
  image: string;
  /** All product image URLs */
  images: string[];
  /** Product price */
  price: number;
  /** Average customer rating */
  rating: number;
  /** Total units sold */
  sold: number;
  /** Detailed product description */
  description: string;
  /** Available stock quantity */
  stock: number;
  /** Unique code used for sharing the product link */
  share_code: string;
  /** Whether the product is currently active/listed */
  active: boolean;
  /** Optional brand name */
  brand?: string;
  /** Optional category name */
  category?: string;
  /** Optional sub-category name */
  sub_category?: string;
  /** Optional pet type filter */
  pet?: string;
}
