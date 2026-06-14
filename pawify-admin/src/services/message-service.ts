import { type IMessageResponse } from '@/models/message.model'
import { axiosAuthenticated } from './api'
import type { IPageCursor } from '@/models/page.model'

interface IGetMessagesByConversationIdParams {
  conversationId: number
  cursor?: string
  size?: number
}

export const getMessagesByConversationId = async ({
  conversationId,
  cursor,
  size,
}: IGetMessagesByConversationIdParams) => {
  const response = await axiosAuthenticated.get<IPageCursor<IMessageResponse>>(`/message/${conversationId}`, {
    params: { cursor, size },
  })
  return response.data
}
