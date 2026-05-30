import { api } from "./api";

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

export const getCards = async (): Promise<CardDTO[]> => {
  return api.get<CardDTO[]>('/card');
};

export const createCard = async (data: CardCreateRequest): Promise<CardDTO> => {
  return api.post<CardDTO>('/card', data);
};

export const updateCard = async (id: number, data: CardCreateRequest): Promise<CardDTO> => {
  return api.patch<CardDTO>(`/card/${id}`, data);
};
