import type { IPageCursor } from "@/models/page.model";
import { axiosAuthenticated } from "@/services/api";
import type {
  IGetShipmentParams,
  ICreateTrackingStatusParams,
  IShipment,
} from "@/models/shipment.mode";

export const getShipment = async ({
  trackingCode,
  size,
  cursor,
}: IGetShipmentParams) => {
  const response = await axiosAuthenticated.get<IPageCursor<IShipment>>(
    `tracking-status/${trackingCode}`,
    { params: { size, cursor } },
  );
  return response.data;
};

export const createTrackingStatus = async ({
  orderId,
  title,
  description,
}: ICreateTrackingStatusParams) => {
  const response = await axiosAuthenticated.post<IShipment>(`tracking-status`, {
    order_id: orderId,
    title,
    description,
  });
  return response.data;
};
