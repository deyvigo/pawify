import { SortIcon } from '@/components/icons/SortIcon'
import { EditIcon } from '@/components/icons/EditIcon'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ComboBox } from '@/components/ui/ComboBox'
import { Pagination } from '@/components/ui/Pagination'
import { Table } from '@/components/ui/Table'
import { useDebounce } from '@/hooks/useDebounce'
import { useOrder } from '@/hooks/useOrder'
import { formatDate } from '@/utils/date'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const SHIPPING_OPTIONS = ['IN_TRANSIT', 'DELIVERED']

const titles = [
  {
    name: 'ID',
    center: false,
    key: 'id',
    sortable: true
  },
  {
    name: 'TRACKING CODE',
    center: false,
    key: 'trackingCode',
    sortable: true
  },
  {
    name: 'ESTADO DE ENVIO',
    center: false,
    key: 'shippingStatus',
    sortable: true
  },
  {
    name: 'FECHA DE COMPRA',
    center: false,
    key: 'orderAt',
    sortable: true
  },
  {
    name: 'PRECIO TOTAL',
    center: false,
    key: 'totalPrice',
    sortable: true
  },
  {
    name: 'ACCIONES',
    center: true,
    key: 'actions',
    sortable: false
  }
]

export const OrdersPage = () => {
  const [trackingCode, setTrackingCode] = useState('')
  const [sort, setSort] = useState<string>('id,asc')
  const [page, setPage] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<{ trackingCode: string, currentStatus: string } | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const debouncedSearch = useDebounce(trackingCode, 500)
  const queryClient = useQueryClient()

  const { page: dataPage, updateShippingStatusMutation } = useOrder({ trackingCode: debouncedSearch, sort, size: 15, page })

  const handlePageChangeToNext = () => {
    if (dataPage?.last) return
    setPage(page + 1)
  }

  const handlePageChangeToPrev = () => {
    if (dataPage?.first) return
    setPage(page - 1)
  }

  const handleSort = (key: string) => {
    const actualSort = sort.split(',')
    if (key === actualSort[0]) {
      setSort(`${key},${actualSort[1] === 'asc' ? 'desc' : 'asc'}`)
    } else {
      setSort(`${key},asc`)
    }
  }

  const handleOpenModal = (orderTrackingCode: string, currentStatus: string) => {
    setSelectedOrder({ trackingCode: orderTrackingCode, currentStatus })
    setNewStatus(currentStatus)
    setOpenModal(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.currentStatus) return
    updateShippingStatusMutation.mutate(
      { trackingCode: selectedOrder.trackingCode, shippingStatus: newStatus },
      {
        onSuccess: () => {
          toast.success('Estado de envío actualizado')
          setOpenModal(false)
          setSelectedOrder(null)
          queryClient.invalidateQueries({ queryKey: ['admin', 'order'] })
        },
        onError: (error) => {
          toast.error(error?.response?.data.message ?? 'Error al actualizar estado')
        }
      }
    )
  }

  return (
    <div className='w-full p-6 min-h-full flex flex-col gap-4 bg-secondary'>
      <h1 className='text-white text-2xl px-2'>Órdenes</h1>
      <div className='w-full flex gap-2'>
        <Input
          name='Buscar'
          type='text'
          placeholder='Buscar por código de tracking'
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          className='flex-1'
          labelStyle='hidden'
          inputStyle='h-10'
        />
      </div>
      <Table>
        <thead>
          <tr>
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
            dataPage?.content?.map((order) => (
              <tr
                key={order.id}
                className='border-primary-border border-b last:border-b-0 first:border-t text-left'
              >
                <td className='px-4 py-3'>{order.id}</td>
                <td className='px-4 py-3'>{order.tracking_code}</td>
                <td className='px-4 py-3'>{order.shipping_status === 'IN_TRANSIT' ? 'En tránsito' : 'Finalizado'}</td>
                <td className='px-4 py-3'>{formatDate(order.order_at)}</td>
                <td className='px-4 py-3'>{`S/. ${order.total_price.toFixed(2)}`}</td>
                <td className='px-4 py-2 text-center'>
                  <button
                    onClick={() => handleOpenModal(order.tracking_code, order.shipping_status)}
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
        totalPages={dataPage?.total_pages!}
        onNextPage={handlePageChangeToNext}
        onPrevPage={handlePageChangeToPrev}
      />
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title='Actualizar estado de envío'
        closeOnBackDrop={true}
        className='w-100 bg-primary rounded-lg border border-primary-border shadow-lg shadow-black/30'
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex flex-col gap-4 p-6'>
            <ComboBox
              name='Estado de envío'
              value={newStatus}
              onChange={(value) => setNewStatus(value)}
              options={SHIPPING_OPTIONS}
              placeholder='Selecciona un estado'
            />
          </div>
          <div className='flex items-center p-4 border-t border-primary-border'>
            <button
              type='button'
              onClick={() => setOpenModal(false)}
              className='w-full bg-secondary rounded-lg cursor-pointer py-2 mr-2 text-white'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={!newStatus || newStatus === selectedOrder?.currentStatus}
              className='w-full bg-linear-to-r from-start to-end rounded-lg cursor-pointer py-2 ml-2 text-white disabled:opacity-40'
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}