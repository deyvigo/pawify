import type { AxiosError } from 'axios'
import type { IErrorResponse } from '@/models/error.model'
import type { IGetOrdersParams, IUpdateShippingStatusParams, IOrder } from '@/models/order.modes'
import { getOrderCompleteByTrackingCode, getOrders, updateShippingStatus } from '@/services/orderService'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useOrder = (params?: IGetOrdersParams, trackingCode?: string) => {
  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['admin', 'order', params],
    queryFn: () => getOrders(params),
    staleTime: 30_000,
    enabled: !!params
  })

  const { data: order } = useQuery({
    queryKey: ['admin', 'order', trackingCode],
    queryFn: () => getOrderCompleteByTrackingCode(trackingCode!),
    staleTime: 30_000,
    enabled: !!trackingCode
  }) 

  const updateShippingStatusMutation = useMutation<
    IOrder,
    AxiosError<IErrorResponse>,
    IUpdateShippingStatusParams
  >({
    mutationFn: updateShippingStatus,
  })

  return {
    page,
    isLoading,
    isError,
    order,
    updateShippingStatusMutation
  }
}