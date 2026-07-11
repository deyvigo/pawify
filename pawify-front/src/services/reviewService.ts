import { api } from "./api";

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
  return api.get<SliceReviewResponse>(`/review/product/${productId}?page=${page}&size=${size}`);
};

// Crea una nueva resena para un producto
export const createReview = async (data: ReviewCreateRequest): Promise<ReviewDTO> => {
  return api.post<ReviewDTO>('/review', { data });
};
