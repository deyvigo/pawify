export interface IShipment {
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

export interface IGetShipmentParams {
  trackingCode: string;
  size?: number;
  cursor?: string;
}

export interface ICreateTrackingStatusParams {
  orderId: number;
  title: string;
  description: string;
}
