import { MessageArea } from '@/components/claim/message-area'
import { Inbox } from '@/components/claim/inbox'
import { ClaimIcon } from '@/components/icons/ClaimIcon'
import { ScrollTriggerWrapper } from '@/components/ui/scroll-trigger-wrapper'
import { useClaim } from '@/hooks/use-claim'
import { useState } from 'react'

interface SelectedConversation {
  conversationId: number
  image: string
  name: string
}

export const ClaimsPage = () => {
  const [activeConversation, setActiveConversation] = useState<SelectedConversation | null>(null)
  const { data: conversations, fetchNextPage, hasNextPage, isFetchingNextPage } = useClaim({ size: 15 })

  const flatConversations = conversations?.pages.flatMap(page => page.content) ?? []

  const handleReachBottom = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-secondary">
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation list */}
        <div className="w-80 min-w-80 bg-primary border-r border-primary-border flex flex-col">
          <div className="h-15 px-4 border-b border-primary-border flex items-center">
            <h2 className="text-white text-lg font-medium">Conversaciones</h2>
          </div>
          <ScrollTriggerWrapper
            onReachBottom={handleReachBottom}
            bottomThreshold={10}
            className="flex-1 overflow-y-auto"
          >
            {flatConversations?.map(({ id, buyer, detail, last_message, last_modified }) => (
              <Inbox
                key={id}
                buyer={buyer}
                last_message={last_message ?? ''}
                last_modified={last_modified}
                detail={detail}
                onClick={() =>
                  setActiveConversation({
                    conversationId: id,
                    image: detail.product_image,
                    name: `${buyer.first_name} ${buyer.last_name}`,
                  })
                }
                active={activeConversation?.conversationId === id}
              />
            ))}
          </ScrollTriggerWrapper>
        </div>

        {/* Chat area */}
        {activeConversation ? (
          <MessageArea {...activeConversation} />
        ) : (
          <div className="w-full h-full bg-secondary flex justify-center items-center flex-col">
            <ClaimIcon className="w-20 h-20 text-white/20" />
            <h2 className="text-white/20">Empieza a conversar</h2>
          </div>
        )}
      </div>
    </div>
  )
}
