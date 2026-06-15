import type { IUserMessage } from '@/models/user.model'
import type { IBuyerSimple } from './buyer.model'
import type { IDetailOrder } from './order.modes'

export interface IMessageResponse {
  id: number
  claim_id: number
  content: string
  send_at: string
  sender: IUserMessage
  buyer: IBuyerSimple
  detail: IDetailOrder
}
