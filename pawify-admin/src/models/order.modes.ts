export interface IOrder {
  id: number
  tracking_code: string
  shipping_status: string
  total_price: number
  order_at: string
}

export interface IGetOrdersParams {
  sort?: string
  trackingCode?: string
  page?: number
  size?: number
}

export interface IDetailOrder {
  id: number
  product_name: string
  quantity: number
  price: number
  total: number
  product_image: string
}

export interface IBuyer {
  id: number
  username: string
  first_name: string
  last_name: string
  profile: string
}

export interface IOrderComplete extends IOrder {
  order_status: string
  buyer: IBuyer
  details: IDetailOrder[]
}

export interface IUpdateShippingStatusParams {
  trackingCode: string
  shippingStatus: string
}
