import type { IGetBuyersParams } from '@/models/buyer.model'
import { getBuyers } from '@/services/buyerService'
import { useQuery } from '@tanstack/react-query'

export const useBuyer = (params?: IGetBuyersParams) => {
  const { data: buyersPage, isLoading, isError } = useQuery({
    queryKey: ['admin', 'buyers', params],
    queryFn: () => getBuyers(params!),
    staleTime: 30_000,
  })

  return {
    buyersPage, isLoading, isError
  }
}
