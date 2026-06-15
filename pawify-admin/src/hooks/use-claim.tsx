import { getClaims } from '@/services/claimService'
import { useInfiniteQuery } from '@tanstack/react-query'

interface IGetClaimsParams {
  size?: number
}

export const useClaim = ({ size }: IGetClaimsParams) => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['admin', 'claim'],
    queryFn: ({ pageParam }: { pageParam: string | null }) => getClaims({ cursor: pageParam!, size }),
    getNextPageParam: lastPage => (lastPage.has_next ? lastPage.cursor : undefined),
    initialPageParam: null,
    staleTime: 30_000,
  })

  return { data, isFetchingNextPage, hasNextPage, fetchNextPage }
}
