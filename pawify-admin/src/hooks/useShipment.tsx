import type { AxiosError } from "axios";
import type { IErrorResponse } from "@/models/error.model";
import type {
  IGetShipmentParams,
  ICreateTrackingStatusParams,
  IShipment,
} from "@/models/shipment.mode";
import { getShipment, createTrackingStatus } from "@/services/shipmentService";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useShipment = (params?: IGetShipmentParams) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["admin", "shipment", params],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
        getShipment({ ...params!, cursor: pageParam! }),
      staleTime: 30_000,
      getNextPageParam: (lastPage) =>
        lastPage.has_next ? lastPage.cursor : undefined,
      enabled: !!params?.trackingCode,
      initialPageParam: null,
    });

  const createTrackingStatusMutation = useMutation<
    IShipment,
    AxiosError<IErrorResponse>,
    ICreateTrackingStatusParams
  >({
    mutationFn: createTrackingStatus,
  });

  return {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    createTrackingStatusMutation,
  };
};
