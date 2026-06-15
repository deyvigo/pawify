import type { IBuyerSimple } from '@/models/buyer.model'
import type { IDetailOrder } from '@/models/order.modes'
import { formatDateCompact } from '@/utils/date'

interface ConversationProps {
  last_message: string
  last_modified: string
  buyer: IBuyerSimple
  detail: IDetailOrder
  onClick: () => void
  active: boolean
}

export const Inbox = ({ buyer, last_message, last_modified, detail, onClick, active }: ConversationProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex gap-2 w-full items-center text-left px-4 py-3 border-b border-primary-border cursor-pointer transition-colors ${
        active ? 'bg-primary-accent' : 'hover:bg-primary-accent/50'
      }`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={detail?.product_image} alt={`product-image${detail?.product_name}`} />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">{`${buyer.first_name} ${buyer.last_name}`}</span>
          <span className="text-subtitle text-xs">{formatDateCompact(last_modified)}</span>
        </div>
        <p className="text-subtitle text-xs mt-1 truncate">{last_message}</p>
      </div>
    </button>
  )
}
