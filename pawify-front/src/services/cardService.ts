import { api } from './api';
import { CardResponseDTO, CardCreateRequestDTO } from '../types';

export async function getCards(): Promise<CardResponseDTO[]> {
  return api.get<CardResponseDTO[]>('/card');
}

export async function createCard(data: CardCreateRequestDTO): Promise<CardResponseDTO> {
  return api.post<CardResponseDTO>('/card', data);
}

export async function deactivateCard(id: number): Promise<void> {
  await api.patch(`/card/${id}/deactivate`);
}
