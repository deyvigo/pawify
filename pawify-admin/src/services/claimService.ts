import type { IPageCursor } from '@/models/page.model'
import { axiosAuthenticated } from '@/services/api'
import type { IClaim } from '@/models/claim.model'

interface IGetClaimsParams {
  cursor?: string
  size?: number
}

export const getClaims = async ({ cursor, size }: IGetClaimsParams) => {
  const response = await axiosAuthenticated.get<IPageCursor<IClaim>>(`/claim/mine`, { params: { cursor, size } })
  return response.data
}
