import { api } from './api';
import { ClaimResponseDTO, MessageResponseDTO, CursorPage } from '../types/orders';

export const createClaim = async (detailId: number): Promise<ClaimResponseDTO> => {
  const response = await api.post('/claim', { detail_id: detailId });
  return response as unknown as ClaimResponseDTO;
};

export const getClaims = async (): Promise<CursorPage<ClaimResponseDTO>> => {
  const response = await api.get('/claim/mine');
  return response as unknown as CursorPage<ClaimResponseDTO>;
};

export const getMessages = async (claimId: number, cursor?: string): Promise<CursorPage<MessageResponseDTO>> => {
  let endpoint = `/message/${claimId}`;
  if (cursor) endpoint += `?cursor=${encodeURIComponent(cursor)}`;
  const response = await api.get(endpoint);
  return response as unknown as CursorPage<MessageResponseDTO>;
};