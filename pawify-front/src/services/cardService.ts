import { api } from "./api";
import { CardResponseDTO, CardCreateRequestDTO } from '../types';

/**
 * Local card data transfer object used within the card service.
 */
export interface CardDTO {
  /** Unique card identifier */
  id: number;
  /** Cardholder name */
  name: string;
  /** Card number */
  number: string;
  /** Card expiration date */
  due_date: string;
}

/**
 * Request payload for creating or updating a payment card.
 */
export interface CardCreateRequest {
  /** Cardholder name */
  name: string;
  /** Card number */
  number: string;
  /** Card expiration date */
  due_date: string;
}

/**
 * Updates an existing payment card's details.
 *
 * @param id - The unique identifier of the card to update.
 * @param data - The updated card fields.
 * @returns A promise that resolves to the updated card DTO.
 */
export const updateCard = async (id: number, data: CardCreateRequest): Promise<CardDTO> => {
  return api.patch<CardDTO>(`/card/${id}`, data);
};

/**
 * Retrieves all payment cards for the authenticated user.
 *
 * @returns A promise that resolves to an array of card response DTOs.
 */
export async function getCards(): Promise<CardResponseDTO[]> {
  return api.get<CardResponseDTO[]>('/card');
}

/**
 * Creates a new payment card for the authenticated user.
 *
 * @param data - The card creation payload.
 * @returns A promise that resolves to the newly created card response DTO.
 */
export async function createCard(data: CardCreateRequestDTO): Promise<CardResponseDTO> {
  return api.post<CardResponseDTO>('/card', data);
}

/**
 * Deactivates (soft-deletes) a payment card by its identifier.
 *
 * @param id - The unique identifier of the card to deactivate.
 * @returns A promise that resolves when the deactivation is complete.
 */
export async function deactivateCard(id: number): Promise<void> {
  await api.patch(`/card/${id}/deactivate`);
}
