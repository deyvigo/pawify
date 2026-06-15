import { Input } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { useOrder } from '@/hooks/useOrder'
import { useShipment } from '@/hooks/useShipment'
import { formatDateCompact, formatDateTime } from '@/utils/date'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const titles = [
  {
    name: 'PRODUCTO',
    center: false,
    key: 'product_name',
    sortable: false,
  },
  {
    name: 'CANTIDAD',
    center: false,
    key: 'quantity',
    sortable: false,
  },
  {
    name: 'PRECIO',
    center: false,
    key: 'price',
    sortable: false,
  },
  {
    name: 'TOTAL',
    center: true,
    key: 'total',
    sortable: false,
  },
]

export const ShippmentPage = () => {
  const [trackingCode, setTrackingCode] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { order } = useOrder(undefined, trackingCode)
  const { data, createTrackingStatusMutation } = useShipment({
    trackingCode,
    size: 10,
  })
  const queryClient = useQueryClient()

  const shipmentData = data?.pages.flatMap(page => page.content) ?? []

  const handleCreateStatus = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !description || !order?.id) return
    createTrackingStatusMutation.mutate(
      { orderId: order!.id, title, description },
      {
        onSuccess: () => {
          toast.success('Estado agregado exitosamente')
          setTitle('')
          setDescription('')
          setOpenCreateModal(false)
          queryClient.invalidateQueries({
            queryKey: ['admin', 'shipment', { trackingCode }],
          })
        },
        onError: error => {
          console.log(error.response)
          toast.error(error?.response?.data.message ?? 'Error al agregar estado')
        },
      },
    )
  }

  return (
    <div className="w-full p-6 min-h-full flex flex-col gap-4 bg-secondary">
      <h1 className="text-white text-2xl px-2">Entregas</h1>
      <div className="w-full flex gap-2">
        <Input
          name="Buscar"
          type="text"
          placeholder="Buscar por código de tracking"
          value={trackingCode}
          onChange={e => setTrackingCode(e.target.value)}
          className="flex-1"
          labelStyle="hidden"
          inputStyle="h-10"
        />
        {trackingCode && (
          <button
            onClick={() => setOpenCreateModal(true)}
            className="h-10 bg-linear-to-r from-start to-end rounded-lg px-4 cursor-pointer text-white text-sm whitespace-nowrap"
          >
            Agregar estado
          </button>
        )}
      </div>
      {order ? (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-xl px-2">Información de la orden</h1>
            <div className="max-w-150 bg-primary h-auto rounded-lg border-primary-border border">
              <table className="w-full text-sm text-white">
                <colgroup>
                  <col className="w-2/5" />
                  <col className="w-3/5" />
                </colgroup>
                <tbody className="">
                  <tr className="border-primary-border border-b">
                    <td className="px-6 py-3">Código de Tracking</td>
                    <td className="px-6 py-3">{order?.tracking_code}</td>
                  </tr>
                  <tr className="border-primary-border border-b">
                    <td className="px-6 py-3">Comprador</td>
                    <td className="px-6 py-3">
                      {order?.buyer.first_name} {order?.buyer.last_name}
                    </td>
                  </tr>
                  <tr className="border-primary-border border-b">
                    <td className="px-6 py-3">Estado de envío</td>
                    <td className="px-6 py-3">{order?.shipping_status}</td>
                  </tr>
                  <tr className="border-primary-border border-b">
                    <td className="px-6 py-3">Estado de pago</td>
                    <td className="px-6 py-3">{order?.order_status}</td>
                  </tr>
                  <tr className="border-primary-border border-b">
                    <td className="px-6 py-3">Fecha de compra</td>
                    <td className="px-6 py-3">{formatDateTime(order?.order_at)}</td>
                  </tr>
                  <tr className="">
                    <td className="px-6 py-3">Precio total</td>
                    <td className="px-6 py-3">{`S/. ${order?.total_price.toFixed(2)}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="max-w-150 flex flex-col gap-2">
            <h1 className="text-white text-xl px-2">Detalles</h1>
            <Table>
              <colgroup>
                <col />
                <col className="w-16" />
                <col className="w-24" />
                <col className="w-24" />
              </colgroup>
              <thead>
                <tr className="border-primary-border border-b text-left last:border-b-0">
                  {titles.map(({ center, name, key }) => (
                    <th key={key} className="px-4 py-3">
                      <div className={`flex items-center gap-2 ${center ? 'justify-center' : 'justify-start'}`}>
                        {name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order?.details.map(({ product_name, quantity, price, product_image }) => (
                  <tr
                    key={product_name}
                    className="border-primary-border border-b last:border-b-0 first:border-t text-left"
                  >
                    <td className="px-4 py-3 flex items-center justify-start gap-2">
                      <img src={product_image} alt={product_name} className="w-10 h-10 rounded-lg" />
                      <span>{product_name}</span>
                    </td>
                    <td className="px-4 py-3">{quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{`S/. ${price.toFixed(2)}`}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{`S/. ${(price * quantity).toFixed(2)}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="max-w-150 flex flex-col gap-2">
              <h1 className="text-white text-xl px-2">Seguimiento</h1>
              {shipmentData.length > 0 ? (
                <div className="relative pl-8 space-y-6">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-primary-border" />
                  {shipmentData.map(({ id, title, description, timestamp }) => (
                    <div key={id} className="relative">
                      <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-active border-2 border-primary" />
                      <span className="text-xs text-subtitle">{formatDateCompact(timestamp)}</span>
                      <div className="mt-1 bg-primary-accent rounded-lg p-4 border border-primary-border">
                        <h4 className="text-white text-sm font-medium">{title}</h4>
                        <p className="text-subtitle text-sm mt-1">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-subtitle text-sm px-2">No hay eventos de seguimiento registrados</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-white">Orden no encontrada</div>
      )}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title="Agregar estado de seguimiento"
        closeOnBackDrop={true}
        className="w-120 bg-primary rounded-lg border border-primary-border shadow-lg shadow-black/30"
      >
        <form onSubmit={handleCreateStatus} className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 p-6">
            <Input
              name="Título"
              type="text"
              placeholder="Ej: En tránsito"
              value={title}
              onChange={e => setTitle(e.target.value)}
              inputStyle="h-10"
            />
            <div className="flex flex-col gap-2 w-full">
              <label className="px-2 text-tiny text-white/60">Descripción</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ej: El paquete ha salido del almacén"
                className="w-full outline-none p-2 rounded-lg bg-primary-accent text-white text-sm resize-none h-24"
              />
            </div>
          </div>
          <div className="flex items-center p-4 border-t border-primary-border">
            <button
              type="button"
              onClick={() => setOpenCreateModal(false)}
              className="w-full bg-secondary rounded-lg cursor-pointer py-2 mr-2 text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-linear-to-r from-start to-end rounded-lg cursor-pointer py-2 ml-2 text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
