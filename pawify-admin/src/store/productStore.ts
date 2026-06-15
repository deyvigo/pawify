import type { IProduct } from '@/models/product.model'
import { create } from 'zustand'

interface ProductStoreProps {
  product: IProduct | null
  setProduct: (product: IProduct) => void
}

export const useProductStore = create<ProductStoreProps>((set) => ({
  product: null,
  setProduct: (product: IProduct) => set({ product })
}))