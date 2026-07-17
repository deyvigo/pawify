import { api } from "./api";
import { CardResponseDTO, CardCreateRequestDTO } from '../types';

// DTO local de tarjeta de pago
export interface CardDTO {
  // Identificador unico de la tarjeta
  id: number;
  // Nombre del titular
  name: string;
  // Numero de la tarjeta
  number: string;
  // Fecha de vencimiento
  due_date: string;
}

// Payload para crear o actualizar una tarjeta
export interface CardCreateRequest {
  // Nombre del titular
  name: string;
  // Numero de la tarjeta
  number: string;
  // Fecha de vencimiento
  due_date: string;
}

// Actualiza los datos de una tarjeta existente
export const updateCard = async (id: number, data: CardCreateRequest): Promise<CardDTO> => {
  return api.patch<CardDTO>(`/card/${id}`, data);
};

// Obtiene todas las tarjetas del usuario autenticado
export async function getCards(): Promise<CardResponseDTO[]> {
  return api.get<CardResponseDTO[]>('/card');
}

// Crea una nueva tarjeta para el usuario autenticado
export async function createCard(data: CardCreateRequestDTO): Promise<CardResponseDTO> {
  return api.post<CardResponseDTO>('/card', data);
}

// Desactiva (elimina logicamente) una tarjeta por su ID
export async function deactivateCard(id: number): Promise<void> {
  await api.patch(`/card/${id}/deactivate`);
}
