import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { useProduct } from '@/hooks/useProduct'
import { Table } from '@/components/ui/Table'
import { useDebounce } from '@/hooks/useDebounce'
import { Pagination } from '@/components/ui/Pagination'
import { EditIcon } from '@/components/icons/EditIcon'
import { Toggle } from '@/components/ui/Toggle'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { SortIcon } from '@/components/icons/SortIcon'
import { Modal } from '@/components/ui/Modal'
import { FormUpdateProduct } from '@/components/product/FormUpdateProduct'
import { useProductStore } from '@/store/productStore'
import { FormCreateProduct } from '@/components/product/FormCreateProduct'

const titles = [
  {
    name: 'CÓDIGO',
    center: false,
    key: 'shareCode',
    sortable: true
  },
  {
    name: 'NOMBRE',
    center: false,
    key: 'name',
    sortable: true
  },
  {
    name: 'MARCA',
    center: false,
    key: 'brand.name',
    sortable: true
  },
  {
    name: 'PRECIO',
    center: false,
    key: 'price',
    sortable: true
  },
  {
    name: 'STOCK',
    center: false,
    key: 'stock',
    sortable: true
  },
  {
    name: 'ESTADO',
    center: true,
    key: 'active',
    sortable: true
  },
  {
    name: 'ACCIONES',
    center: true,
    key: 'actions',
    sortable: false
  }
]

export const ProductsPage = () => {
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<string>('name,asc')
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)

  const setProduct = useProductStore((state) => state.setProduct)
  const debouncedSearch = useDebounce(search, 300)
  const { data, changeStatusProductMutation } = useProduct({ size: 15, search: debouncedSearch, page, sort })
  const queryClient = useQueryClient()

  const handlePageChangeToNext = () => {
    if (data?.last) return
    setPage(page + 1)
  }

  const handlePageChangeToPrev = () => {
    if (data?.first) return
    setPage(page - 1)
  }

  const handleChangeStatus = (shareCode: string, currentStatus: boolean) => {
    changeStatusProductMutation.mutate(
      {
        shareCode,
        currentStatus
      },
      {
        onSuccess: () => {
          toast.success('Producto actualizado exitosamente')
          queryClient.invalidateQueries({ queryKey: ['admin', 'product'] })
        },
        onError: (error) => {
          toast.error(error?.response?.data.message ?? 'Error al actualizar producto')
        }
      }
    )
  }

  const handleSort = (key: string) => {
    const actualSort = sort.split(',')
    if (key === actualSort[0]) {
      setSort(`${key},${actualSort[1] === 'asc' ? 'desc' : 'asc'}`)
    } else {
      setSort(`${key},asc`)
    }
  }

  return (
    <>
      <div
        className='w-full p-6 min-h-full flex flex-col gap-4 bg-secondary'
      >
        <h1 className='text-white text-2xl px-2'>Productos</h1>
        <div className='w-full flex gap-2'>
          <Input
            name='Buscar'
            type='text'
            placeholder='Buscar por nombre'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1'
            labelStyle='hidden'
            inputStyle='h-10'
          />
          <button
            onClick={() => setOpenCreateModal(true)}
            className='w-fit bg-linear-to-r from-start to-end rounded-lg p-2 cursor-pointer text-white text-sm'
          >
            Crear Producto
          </button>
        </div>
        <Table>
          <thead>
            <tr className='border-primary-border border-b text-left last:border-b-0'>
              {
                titles.map(({ center, name, key, sortable }) => (
                  <th
                    key={key}
                    className='px-4 py-3'
                  >
                    <div className={`flex items-center gap-2 ${center ? 'justify-center' : 'justify-start'}`}>
                      {name}
                      {
                        sortable && <button
                          className='w-fit h-fit bg-transparent cursor-pointer'
                          onClick={() => handleSort(key)}
                        >
                          <SortIcon className='w-3 h-3 text-white' />
                        </button>
                      }

                    </div>
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              data?.content?.map((product) => (
                <tr
                  key={product.id}
                  className='border-primary-border border-b last:border-b-0 first:border-t text-left'
                >
                  <td className='px-4 py-3'>{product.share_code}</td>
                  <td className='px-4 py-3'>{product.name}</td>
                  <td className='px-4 py-3'>{product.brand.name}</td>
                  <td className='px-4 py-3'>{`S/. ${product.price.toFixed(2)}`}</td>
                  <td className='px-4 py-3'>{product.stock}</td>
                  <td className='px-4 py-2 text-center'>
                    {
                      <Toggle active={product.active} onChange={() => handleChangeStatus(product.share_code, product.active)} />
                    }
                  </td>
                  <td className='px-4 py-2 text-center'>
                    <button
                      onClick={() => {
                        setProduct(product)
                        setOpenUpdateModal(true)
                      }}
                      className='w-fit cursor-pointer'
                    >
                      <EditIcon className='w-5 h-5 text-white' />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        <Pagination
          currentPage={page}
          totalPages={data?.total_pages!}
          onNextPage={handlePageChangeToNext}
          onPrevPage={handlePageChangeToPrev}
        />
      </div>
      <Modal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title='Actualizar Producto'
        closeOnBackDrop={true}
        className='w-100 bg-primary rounded-lg border border-primary-border shadow-lg shadow-black/30'
      >
        <FormUpdateProduct onClose={() => setOpenUpdateModal(false)} />
      </Modal>
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title='Crear Producto'
        closeOnBackDrop={true}
        className='w-140 bg-primary rounded-lg border border-primary-border shadow-lg shadow-black/30'
      >
        <FormCreateProduct onClose={() => setOpenCreateModal(false)} />
      </Modal>
    </>
  )
}