import type { IErrorResponse } from '@/models/error.model'
import type { ICreatProductRequest, IGetProductsParams, IPatchProductRequest, IProduct } from '@/models/product.model'
import { changeStatusProduct, createProduct, getProducts, patchProduct } from '@/services/productService'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export const useProduct = (params?: IGetProductsParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'product', params],
    queryFn: () => getProducts(params!),
    staleTime: 30_000
  })

  const changeStatusProductMutation = useMutation<
    void,
    AxiosError<IErrorResponse>,
    { shareCode: string, currentStatus: boolean }
  >({
    mutationFn: changeStatusProduct,
  })

  const patchProductMutation = useMutation<
    IProduct,
    AxiosError<IErrorResponse>,
    IPatchProductRequest
  >({
    mutationFn: patchProduct,
  })

  const createProductMutation = useMutation<
    IProduct,
    AxiosError<IErrorResponse>,
    ICreatProductRequest
  >({
    mutationFn: createProduct,
  })

  return {
    data,
    isLoading,
    isError,
    changeStatusProductMutation,
    patchProductMutation,
    createProductMutation
  }
}