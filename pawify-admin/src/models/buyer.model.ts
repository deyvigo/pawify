export interface IBuyer {
  id: number
  username: string
  first_name: string
  last_name: string
  dni_number: string
  email: string
}

export interface IBuyerProfile {
  id: number
  url: string
}

export interface IBuyerSimple {
  id: number
  username: string
  first_name: string
  last_name: string
  profile: IBuyerProfile
}

export interface IGetBuyersParams {
  search?: string
  page?: number
  size?: number
  sort?: string
}
