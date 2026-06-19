import { useMutation, useQuery } from "@tanstack/react-query";
import { getAddresses, createAddress } from "../services/addressService";
import { AddressCreateRequestDTO, AddressResponseDTO } from "../types";

export const useAddress = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["address"],
    queryFn: () => getAddresses(),
    staleTime: 30_000,
  });

  const addressMutation = useMutation<
    AddressResponseDTO,
    unknown,
    AddressCreateRequestDTO
  >({
    mutationKey: ["address"],
    mutationFn: createAddress,
  });

  return { data, isLoading, addressMutation };
};
