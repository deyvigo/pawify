import { api } from './api';
import { AddressResponseDTO, AddressCreateRequestDTO } from '../types';

export async function getAddresses(): Promise<AddressResponseDTO[]> {
  return api.get<AddressResponseDTO[]>('/address');
}

export async function createAddress(data: AddressCreateRequestDTO): Promise<AddressResponseDTO> {
  return api.post<AddressResponseDTO>('/address', data);
}

export async function deactivateAddress(id: number): Promise<void> {
  await api.patch(`/address/${id}/deactivate`);
}
