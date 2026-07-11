import { api } from "./api";

/**
 * Review data transfer object returned by the API.
 */
export interface ReviewDTO {
  /** Unique review identifier */
  id: number;
  /** Review text content */
  content: string;
  /** Numeric rating value */
  rating: number;
  /** ISO 8601 timestamp of when the review was created */
  created_at: string;
  /** Information about the buyer who wrote the review */
  buyer: {
    /** Buyer's username */
    username: string;
    /** Buyer's first name */
    first_name: string;
    /** Buyer's last name */
    last_name: string;
    /** Buyer's profile image information */
    profile: {
      /** Profile image identifier */
      id: number;
      /** Profile image URL */
      url: string;
    };
  };
}

/**
 * Request payload for creating a new product review.
 */
export interface ReviewCreateRequest {
  /** Review text content */
  content: string;
  /** Numeric rating value */
  rating: number;
  /** Identifier of the order detail line item being reviewed */
  detail_id: number;
}

/**
 * Paginated response wrapper for product reviews.
 */
export interface SliceReviewResponse {
  /** Array of reviews for the current page */
  content: ReviewDTO[];
  /** Whether this is the first page of results */
  first: boolean;
  /** Whether this is the last page of results */
  last: boolean;
  /** Number of reviews on this page */
  number_of_elements: number;
  /** Whether the result set is empty */
  empty: boolean;
}

/**
 * Retrieves a paginated list of reviews for a specific product.
 *
 * @param productId - The unique identifier of the product to fetch reviews for.
 * @param page - Zero-based page number. Defaults to 0.
 * @param size - Number of reviews per page. Defaults to 10.
 * @returns A promise that resolves to a paginated slice of review responses.
 */
export const getReviews = async (productId: number, page: number = 0, size: number = 10): Promise<SliceReviewResponse> => {
  return api.get<SliceReviewResponse>(`/review/product/${productId}?page=${page}&size=${size}`);
};

/**
 * Creates a new review for a product.
 *
 * @param data - The review creation payload containing content, rating, and detail ID.
 * @returns A promise that resolves to the newly created review DTO.
 */
export const createReview = async (data: ReviewCreateRequest): Promise<ReviewDTO> => {
  return api.post<ReviewDTO>('/review', { data });
};
