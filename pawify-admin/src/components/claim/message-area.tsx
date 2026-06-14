import { useStomp } from '@/context/stomp-context'
import { ScrollTriggerWrapper, type ScrollTriggerRef } from '../ui/scroll-trigger-wrapper'
import { MessageBubble } from './message-bubble'
import { Submit } from './submit'
import { useEffect, useRef } from 'react'
import type { IMessageResponse } from '@/models/message.model'
import { useMessage } from '@/hooks/use-message'
import { useAuthContext } from '@/context/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import type { IClaim } from '@/models/claim.model'
import type { IPageCursor } from '@/models/page.model'
import type { InfiniteData } from '@tanstack/react-query'

interface MessageAreaProps {
  conversationId: number
  image: string
  name: string
}

export const MessageArea = ({ conversationId, image, name }: MessageAreaProps) => {
  const { subscribe } = useStomp()
  const { user } = useAuthContext()
  const { data: pagedMessages, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessage(conversationId, 15)
  const queryClient = useQueryClient()
  const messageAreaRef = useRef<ScrollTriggerRef>(null)

  const handleReachBottom = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleSubmitScroll = () => {
    messageAreaRef.current?.scrollToTop()
  }

  useEffect(() => {
    const subscription = subscribe('/user/queue/claim', message => {
      const newMessage = JSON.parse(message.body) as IMessageResponse
      queryClient.setQueryData(['admin', 'claim', newMessage.claim_id], (old: typeof pagedMessages) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0 ? { ...page, content: [newMessage, ...page.content] } : page,
          ),
        }
      })

      queryClient.setQueryData(['admin', 'claim'], (old: InfiniteData<IPageCursor<IClaim>>) => {
        if (!old) return old
        let claimFound = false

        const updatedPages = old.pages.map(page => {
          const exists = page.content.some(c => c.id === newMessage.claim_id)
          if (!exists) return page

          claimFound = true

          const updated: IClaim[] = page.content
            .map(c =>
              c.id === newMessage.claim_id
                ? { ...c, last_message: newMessage.content, last_modified: newMessage.send_at }
                : c,
            )
            .sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime())
          return { ...page, content: updated }
        })

        if (!claimFound) {
          const newClaim: IClaim = {
            id: newMessage.claim_id,
            last_message: newMessage.content,
            last_modified: newMessage.send_at,
            last_message_sender: newMessage.sender.id === user?.id ? 'ADMIN' : 'BUYER',
            buyer: newMessage.buyer,
            detail: newMessage.detail,
          }

          updatedPages[0] = {
            ...updatedPages[0],
            content: [newClaim, ...updatedPages[0].content],
          }
        }

        return { ...old, pages: updatedPages }
      })
    })

    return () => subscription?.unsubscribe()
  }, [conversationId])

  const flatMessages = pagedMessages?.pages.flatMap(page => page.content) ?? []

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="h-15 px-6 border-b border-primary-border flex items-center bg-primary gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={image} alt="product-image" />
        </div>
        <span className="text-white text-sm font-medium">{name}</span>
      </div>

      {/* Messages */}
      <ScrollTriggerWrapper
        ref={messageAreaRef}
        topThreshold={10}
        onReachBottom={handleReachBottom}
        reversed={true}
        className="flex-1 overflow-y-auto p-6 bg-secondary flex flex-col-reverse gap-4"
      >
        {flatMessages.map(({ id, content, send_at, sender }) => (
          <MessageBubble
            key={id}
            message={content}
            side={sender.username === user?.username ? 'right' : 'left'}
            name={sender.username}
            time={send_at}
          />
        ))}
      </ScrollTriggerWrapper>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-primary-border bg-primary">
        <Submit conversationId={conversationId} onSend={handleSubmitScroll} />
      </div>
    </div>
  )
}
