import { Input } from '@/components/ui/Input'
import { useProductStore } from '@/store/productStore'
import { useState } from 'react'
import { ComboBox } from '@/components/ui/ComboBox'
import { handleNumberInput } from '@/utils/input'
import { useMetaData } from '@/hooks/useMetaData'
import { useProduct } from '@/hooks/useProduct'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export const FormUpdateProduct = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient()
  const product = useProductStore((state) => state.product)
  
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price ?? '')
  const [stock, setStock] = useState(product?.stock ?? '')
  const [brand, setBrand] = useState(product?.brand.name ?? '')
  const [category, setCategory] = useState(product?.category.name ?? '')
  const [subCategory, setSubCategory] = useState(product?.sub_category.name ?? '')
  
  const { brands, categories, subCategories } = useMetaData(category ?? '')

  const { patchProductMutation } = useProduct()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (name === '' || description === '' || price === '' || stock === '' || brand === '' || category === '' || subCategory === '' || product?.id === undefined) return
    patchProductMutation.mutate({
      id: product?.id,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      brand,
      category,
      sub_category: subCategory
    },
    {
      onSuccess: () => {
        toast.success('Producto actualizado exitosamente')
        queryClient.invalidateQueries({ queryKey: ['admin', 'product'] })
        onClose()
      },
      onError: (error) => {
        toast.error(error?.response?.data.message ?? 'Error al actualizar producto')
      }
    })
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full'
        />
        <Input
          name='Descripción'
          type='text'
          placeholder='Descripción'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='w-full'
        />
        <ComboBox
          name='Marca'
          value={brand}
          onChange={(e) => setBrand(e)}
          options={brands?.map((brand) => brand.name) ?? []}
          placeholder='Selecciona una marca'
          className='w-full'
        />
        <ComboBox
          name='Categoria'
          value={category}
          onChange={(e) => setCategory(e)}
          options={categories?.map((category) => category.name) ?? []}
          placeholder='Selecciona una categoria'
          className='w-full'
        />
        <ComboBox
          name='Sub Categoria'
          value={subCategory}
          onChange={(e) => setSubCategory(e)}
          options={subCategories?.map((subCategory) => subCategory.name) ?? []}
          placeholder='Selecciona una subcategoria'
          className='w-full'
        />
        <div className='flex items-center'>
          <Input
            name='Precio'
            type='text'
            placeholder='Precio'
            value={price}
            onChange={(e) => handleNumberInput(e, setPrice, true)}
            className='w-full pr-2'
          />
          <Input
            name='Stock'
            type='text'
            placeholder='Stock'
            value={stock}
            onChange={(e) => handleNumberInput(e, setStock, false)}
            className='w-full pl-2'
          />
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