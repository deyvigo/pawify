import type { ICreatProductRequest } from '@/models/product.model'
import { Input } from '@/components/ui/Input'
import ImageDropZone from '@/components/ui/ImageDropZone'
import { useState } from 'react'
import { handleNumberInput } from '@/utils/input'
import { useMetaData } from '@/hooks/useMetaData'
import { ComboBox } from '../ui/ComboBox'
import { useProduct } from '@/hooks/useProduct'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export const FormCreateProduct = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient()
  const [product, setProduct] = useState<ICreatProductRequest>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    brand: '',
    category: '',
    sub_category: '',
    images: []
  })
  
  const [price, setPrice] = useState<string | number>(0)
  const [stock, setStock] = useState<string | number>(0)

  const { brands, categories, subCategories } = useMetaData(product?.category ?? '')
  const { createProductMutation } = useProduct()
  
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    product.price = Number(price)
    product.stock = Number(stock)

    createProductMutation.mutate({
      ...product,
      images: product.images
    },
    {
      onSuccess: () => {
        toast.success('Producto creado exitosamente')
        setProduct({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          brand: '',
          category: '',
          sub_category: '',
          images: []
        })
        setPrice(0)
        setStock(0)
        queryClient.invalidateQueries({ queryKey: ['admin', 'product'] })
        onClose()
      },
      onError: (error) => {
        toast.error(error?.response?.data.message ?? 'Error al crear producto')
      }
    }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full flex flex-col gap-2'
    >
      <div className='w-full flex flex-col gap-2 p-4'>
        <Input
          name='Nombre'
          type='text'
          placeholder='Nombre'
          className='w-full'
          value={product?.name ?? ''}
          onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
        />
        <Input
          name='Descripción'
          type='text'
          placeholder='Descripción'
          className='w-full'
          value={product?.description ?? ''}
          onChange={(e) => setProduct((prev) => ({ ...prev, description: e.target.value }))}
        />
        <ComboBox
          name='Marca'
          placeholder='Marca'
          className='w-full'
          options={brands?.map((b) => b.name) ?? []}
          value={product?.brand ?? ''}
          onChange={(e) => setProduct((prev) => ({ ...prev, brand: e }))}
        />
        <ComboBox
          name='Categoria'
          placeholder='Categoria'
          className='w-full'
          options={categories?.map((c) => c.name) ?? []}
          value={product?.category ?? ''}
          onChange={(e) => setProduct((prev) => ({ ...prev, category: e }))}
        />
        <ComboBox
          name='Sub Categoria'
          placeholder='Sub Categoria'
          className='w-full'
          options={subCategories?.map((s) => s.name) ?? []}
          value={product?.sub_category ?? ''}
          onChange={(e) => setProduct((prev) => ({ ...prev, sub_category: e }))}
        />
        <div>
          <Input
            name='Precio'
            type='text'
            placeholder='Precio'
            className='w-full'
            value={price}
            onChange={(e) => handleNumberInput(e, setPrice, true)}
          />
          <Input
            name='Stock'
            type='text'
            placeholder='Stock'
            className='w-full'
            value={stock}
            onChange={(e) => handleNumberInput(e, setStock, false)}
          />
        </div>
        <div className='w-full flex gap-2 items-center justify-center bg-primary-accent rounded-lg p-2 overflow-hidden'>
          <ImageDropZone onChange={(files) => { setProduct((prev) => ({ ...prev, images: files })) }} />
        </div>
      </div>
      <div className='flex items-center p-4 border-t border-primary-border'>
        <button
          type='button'
          onClick={onClose}
          className='w-full bg-secondary rounded-lg cursor-pointer py-2 mr-2 text-white'
        >
          Cancelar
        </button>
        <button className='w-full bg-linear-to-r from-start to-end rounded-lg cursor-pointer py-2 ml-2 text-white'>
          Guardar
        </button>
      </div>
    </form>
  )
}