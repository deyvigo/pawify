import { api } from "./api";
import { AddressResponseDTO, AddressCreateRequestDTO } from '../types';

// DTO local de direccion de envio
export interface AddressDTO {
  // Identificador unico de la direccion
  id: number;
  // Nombre o etiqueta de la direccion
  name: string;
  // Referencia adicional
  reference: string;
  // Latitud geografica
  latitude: number;
  // Longitud geografica
  longitude: number;
}

// Payload para crear o actualizar una direccion
export interface AddressCreateRequest {
  // Nombre o etiqueta de la direccion
  name: string;
  // Referencia adicional
  reference: string;
  // Latitud geografica
  latitude: number;
  // Longitud geografica
  longitude: number;
}

// Actualiza los datos de una direccion existente
export const updateAddress = async (id: number, data: AddressCreateRequest): Promise<AddressDTO> => {
  return api.patch<AddressDTO>(`/address/${id}`, data);
};

// Obtiene todas las direcciones del usuario autenticado
export async function getAddresses(): Promise<AddressResponseDTO[]> {
  return api.get<AddressResponseDTO[]>('/address');
}

// Crea una nueva direccion para el usuario autenticado
export async function createAddress(data: AddressCreateRequestDTO): Promise<AddressResponseDTO> {
  return api.post<AddressResponseDTO>('/address', data);
}

// Desactiva (elimina logicamente) una direccion por su ID
export async function deactivateAddress(id: number): Promise<void> {
  await api.patch(`/address/${id}/deactivate`);
}
