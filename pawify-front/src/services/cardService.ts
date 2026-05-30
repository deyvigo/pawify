import { api } from "./api";
import { CardResponseDTO, CardCreateRequestDTO } from '../types';

export interface CardDTO {
  id: number;
  name: string;
  number: string;
  due_date: string;
}

export interface CardCreateRequest {
  name: string;
  number: string;
  due_date: string;
}


export const updateCard = async (id: number, data: CardCreateRequest): Promise<CardDTO> => {
  return api.patch<CardDTO>(`/card/${id}`, data);
};


export async function getCards(): Promise<CardResponseDTO[]> {
  return api.get<CardResponseDTO[]>('/card');
}

export async function createCard(data: CardCreateRequestDTO): Promise<CardResponseDTO> {
  return api.post<CardResponseDTO>('/card', data);
}

export async function deactivateCard(id: number): Promise<void> {
  await api.patch(`/card/${id}/deactivate`);
}
