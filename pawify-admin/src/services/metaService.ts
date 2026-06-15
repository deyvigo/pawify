import { type ISubCategory, type IBrand, type ICategory } from "@/models/product.model"
import { axiosAuthenticated } from "./api"

export const getBrands = async () => {
  const response = await axiosAuthenticated.get<IBrand[]>('/brand')
  return response.data
}

export const getCategories = async () => {
  const response = await axiosAuthenticated.get<ICategory[]>('/category')
  return response.data
}

export const getSubCategoriesByCategoryName = async (categoryName: string) => {
  const response = await axiosAuthenticated.get<ISubCategory[]>(
    `/category/${categoryName}/sub-category`
  )
  return response.data
}