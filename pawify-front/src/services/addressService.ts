import { api } from "./api";
import { AddressResponseDTO, AddressCreateRequestDTO } from '../types';

export interface AddressDTO {
  id: number;
  name: string;
  reference: string;
  latitude: number;
  longitude: number;
}

export interface AddressCreateRequest {
  name: string;
  reference: string;
  latitude: number;
  longitude: number;
}

export const updateAddress = async (id: number, data: AddressCreateRequest): Promise<AddressDTO> => {
  return api.patch<AddressDTO>(`/address/${id}`, data);
};

export async function getAddresses(): Promise<AddressResponseDTO[]> {
  return api.get<AddressResponseDTO[]>('/address');
}

export async function createAddress(data: AddressCreateRequestDTO): Promise<AddressResponseDTO> {
  return api.post<AddressResponseDTO>('/address', data);
}

export async function deactivateAddress(id: number): Promise<void> {
  await api.patch(`/address/${id}/deactivate`);
}
