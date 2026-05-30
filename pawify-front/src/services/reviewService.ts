import { api } from "./api";

export interface ReviewDTO {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  buyer: {
    username: string;
    first_name: string;
    last_name: string;
    profile: {
      id: number;
      url: string;
    };
  };
}

export interface ReviewCreateRequest {
  content: string;
  rating: number;
  detail_id: number;
}

export interface SliceReviewResponse {
  content: ReviewDTO[];
  first: boolean;
  last: boolean;
  number_of_elements: number;
  empty: boolean;
}

export const getReviews = async (productId: number, page: number = 0, size: number = 10): Promise<SliceReviewResponse> => {
  return api.get<SliceReviewResponse>(`/review/product/${productId}?page=${page}&size=${size}`);
};

export const createReview = async (data: ReviewCreateRequest): Promise<ReviewDTO> => {
  return api.post<ReviewDTO>('/review', { data });
};
