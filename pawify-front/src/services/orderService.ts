import { api } from './api';
import { OrderCreateRequestDTO, OrderResponseDTO } from '../types';

export async function createOrder(data: OrderCreateRequestDTO): Promise<OrderResponseDTO> {
  return api.post<OrderResponseDTO>('/order', data);
}
