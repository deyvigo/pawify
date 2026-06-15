import type { IUser } from '@/models/user.model'
import type { IDetailOrder } from '@/models/order.modes'
import type { IBuyerSimple } from '@/models/buyer.model'

export interface IClaim {
  id: number
  last_message: string
  last_modified: string
  last_message_sender: 'BUYER' | 'ADMIN'
  admin?: IUser
  buyer: IBuyerSimple
  detail: IDetailOrder
}
