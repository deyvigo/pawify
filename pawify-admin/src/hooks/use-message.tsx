import { getMessagesByConversationId } from '@/services/message-service'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useMessage = (conversationId: number, size: number) => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['admin', 'claim', conversationId],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getMessagesByConversationId({ conversationId, cursor: pageParam!, size }),
    getNextPageParam: lastPage => (lastPage.has_next ? lastPage.cursor : undefined),
    initialPageParam: null,
    staleTime: 30_000,
  })
  return { data, isFetchingNextPage, hasNextPage, fetchNextPage }
}
