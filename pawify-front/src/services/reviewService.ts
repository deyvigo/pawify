import { API_URL, authToken } from "../config";
import { api } from "./api";

const log = (label: string, data: unknown) => {
  console.log(`[ReviewService] ${label}:`, JSON.stringify(data, null, 2));
};

// DTO de una resena devuelto por la API
export interface ReviewDTO {
  // Identificador unico de la resena
  id: number;
  // Texto de la resena
  content: string;
  // Valor numerico del rating
  rating: number;
  // Fecha de creacion en formato ISO 8601
  created_at: string;
  // Datos del comprador que escribio la resena
  buyer: {
    // Nombre de usuario del comprador
    username: string;
    // Nombre del comprador
    first_name: string;
    // Apellido del comprador
    last_name: string;
    // Foto de perfil del comprador
    profile: {
      // Identificador de la imagen
      id: number;
      // URL de la imagen
      url: string;
    };
  };
}

// Payload para crear una resena de producto
export interface ReviewCreateRequest {
  // Texto de la resena
  content: string;
  // Valor numerico del rating
  rating: number;
  // Identificador del detalle de orden que se esta reseñando
  detail_id: number;
}

// Respuesta paginada de resenas de producto
export interface SliceReviewResponse {
  // Lista de resenas de la pagina actual
  content: ReviewDTO[];
  // Es la primera pagina
  first: boolean;
  // Es la ultima pagina
  last: boolean;
  // Cantidad de elementos en la pagina
  number_of_elements: number;
  // No hay resultados
  empty: boolean;
}

// Obtiene las resenas paginadas de un producto
export const getReviews = async (productId: number, page: number = 0, size: number = 10): Promise<SliceReviewResponse> => {
  const data = await api.get<SliceReviewResponse>(`/review/product/${productId}?page=${page}&size=${size}&sort=createdAt,desc`);
  log('GET /review/product', data);
  return data;
};

// Crea una nueva resena para un producto
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
