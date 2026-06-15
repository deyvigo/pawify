export interface IBrand {
  id: number
  name: string
}

export interface ICategory {
  id: number
  name: string
}

export interface ISubCategory {
  id: number
  name: string
}

export interface IProduct {
  id: number
  name: string
  brand: IBrand
  price: number
  share_code: string
  stock: number
  active: boolean
  description: string
  category: ICategory
  sub_category: ISubCategory
}

export interface IGetProductsParams {
  sort?: string
  search?: string
  page?: number
  size?: number
}

export interface IPatchProductRequest extends Pick<IProduct, 'name' | 'description' | 'price' | 'stock' | 'id'> {
  brand: string,
  category: string,
  sub_category: string
}

export interface ICreatProductRequest extends Omit<IPatchProductRequest, 'id'> {
  images: File[]
}
