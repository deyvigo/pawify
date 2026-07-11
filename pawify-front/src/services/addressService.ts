import { api } from "./api";
import { AddressResponseDTO, AddressCreateRequestDTO } from '../types';

/**
 * Local address data transfer object used within the address service.
 */
export interface AddressDTO {
  /** Unique address identifier */
  id: number;
  /** User-defined label for the address (e.g. "Home") */
  name: string;
  /** Additional reference or directions */
  reference: string;
  /** Geographic latitude coordinate */
  latitude: number;
  /** Geographic longitude coordinate */
  longitude: number;
}

/**
 * Request payload for creating or updating a delivery address.
 */
export interface AddressCreateRequest {
  /** User-defined label for the address */
  name: string;
  /** Additional reference or directions */
  reference: string;
  /** Geographic latitude coordinate */
  latitude: number;
  /** Geographic longitude coordinate */
  longitude: number;
}

/**
 * Updates an existing delivery address's details.
 *
 * @param id - The unique identifier of the address to update.
 * @param data - The updated address fields.
 * @returns A promise that resolves to the updated address DTO.
 */
export const updateAddress = async (id: number, data: AddressCreateRequest): Promise<AddressDTO> => {
  return api.patch<AddressDTO>(`/address/${id}`, data);
};

/**
 * Retrieves all delivery addresses for the authenticated user.
 *
 * @returns A promise that resolves to an array of address response DTOs.
 */
export async function getAddresses(): Promise<AddressResponseDTO[]> {
  return api.get<AddressResponseDTO[]>('/address');
}

/**
 * Creates a new delivery address for the authenticated user.
 *
 * @param data - The address creation payload.
 * @returns A promise that resolves to the newly created address response DTO.
 */
export async function createAddress(data: AddressCreateRequestDTO): Promise<AddressResponseDTO> {
  return api.post<AddressResponseDTO>('/address', data);
}

/**
 * Deactivates (soft-deletes) a delivery address by its identifier.
 *
 * @param id - The unique identifier of the address to deactivate.
 * @returns A promise that resolves when the deactivation is complete.
 */
export async function deactivateAddress(id: number): Promise<void> {
  await api.patch(`/address/${id}/deactivate`);
}
