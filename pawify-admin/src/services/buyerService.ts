import type { IGetBuyersParams, IBuyer } from '@/models/buyer.model'
import type { IPage } from '@/models/page.model'
import { axiosAuthenticated } from '@/services/api'

export const getBuyers = async (params?: IGetBuyersParams) => {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      )
    : undefined
  const response = await axiosAuthenticated.get<IPage<IBuyer>>(
    '/admin/buyers',
    { params: cleanParams }
  )
  return response.data
}
