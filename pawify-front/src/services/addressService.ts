import { api } from "./api";

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

export const getAddresses = async (): Promise<AddressDTO[]> => {
  return api.get<AddressDTO[]>('/address');
};

export const createAddress = async (data: AddressCreateRequest): Promise<AddressDTO> => {
  return api.post<AddressDTO>('/address', data);
};

export const updateAddress = async (id: number, data: AddressCreateRequest): Promise<AddressDTO> => {
  return api.patch<AddressDTO>(`/address/${id}`, data);
};
