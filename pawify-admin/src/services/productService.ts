import type { IPatchProductRequest, IGetProductsParams, IProduct, ICreatProductRequest } from '@/models/product.model'
import type { IPage } from '@/models/page.model'
import { axiosAuthenticated } from '@/services/api'

export const getProducts = async (params: IGetProductsParams) => {
  const response = await axiosAuthenticated.get<IPage<IProduct>>(
    "admin/product",
    { params }
  )

  return response.data
}

export const changeStatusProduct = async ({ shareCode, currentStatus }: { shareCode: string, currentStatus: boolean }) => {
  const response = await axiosAuthenticated.patch(
    `/product/${shareCode}/${currentStatus ? 'deactivate' : 'activate'}`
  )
  return response.data
}

export const patchProduct = async ({
  id,
  name,
  description,
  price,
  stock,
  brand,
  category,
  sub_category
}: IPatchProductRequest) => {
  const response = await axiosAuthenticated.patch<IProduct>(
    `/product/${id}`,
    { name, description, price, stock, brand, category, sub_category }
  )

  return response.data
}

export const createProduct = async ({
  name,
  description,
  price,
  stock,
  brand,
  category,
  sub_category,
  images
}: ICreatProductRequest) => {
  const formData = new FormData()
  formData.append("data", new Blob([JSON.stringify({
    name, description, price, stock, brand, category, sub_category
  })], { type: "application/json" }))

  images.forEach(img => formData.append("images", img))
  const response = await axiosAuthenticated.post<IProduct>(
    "/product",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )
  return response.data
}