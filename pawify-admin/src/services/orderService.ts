import { type IGetOrdersParams, type IOrder, type IOrderComplete, type IUpdateShippingStatusParams } from '@/models/order.modes'
import type { IPage } from '@/models/page.model'
import { axiosAuthenticated } from '@/services/api'

export const getOrders = async (params?: IGetOrdersParams) => {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      )
    : undefined
  const response = await axiosAuthenticated.get<IPage<IOrder>>(
    'admin/order',
    { params: cleanParams }
  )
  return response.data
}

export const getOrderCompleteByTrackingCode = async (trackingCode: string) => {
  const response = await axiosAuthenticated.get<IOrderComplete>(`order/${trackingCode}`)
  return response.data
}

export const updateShippingStatus = async ({ trackingCode, shippingStatus }: IUpdateShippingStatusParams) => {
  const response = await axiosAuthenticated.patch<IOrder>(
    `admin/order/${trackingCode}/shipping-status`,
    { shipping_status: shippingStatus }
  )
  return response.data
}