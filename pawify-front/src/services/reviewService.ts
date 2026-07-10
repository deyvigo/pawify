import { API_URL, authToken } from "../config";
import { api } from "./api";

const log = (label: string, data: unknown) => {
  console.log(`[ReviewService] ${label}:`, JSON.stringify(data, null, 2));
};

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
  const data = await api.get<SliceReviewResponse>(`/review/product/${productId}?page=${page}&size=${size}&sort=createdAt,desc`);
  log('GET /review/product', data);
  return data;
};

export const createReview = async (data: ReviewCreateRequest): Promise<ReviewDTO> => {
  const boundary = '----Boundary' + Math.random().toString(36).substring(2);
  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="data"\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${JSON.stringify(data)}\r\n` +
    `--${boundary}--\r\n`;

  log('POST /review request', data);

  const response = await fetch(`${API_URL}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body,
  });

  log('POST /review response status', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    log('POST /review error body', errorText);
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  const text = await response.text();
  log('POST /review success body', text);
  return JSON.parse(text) as ReviewDTO;
};
