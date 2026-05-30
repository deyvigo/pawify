import { useState, useEffect, useCallback } from "react";
import { getAddresses, AddressDTO, AddressCreateRequest, createAddress, updateAddress } from "../services/addressService";

interface UseAddressesReturn {
  addresses: AddressDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addAddress: (data: AddressCreateRequest) => Promise<void>;
  editAddress: (id: number, data: AddressCreateRequest) => Promise<void>;
}

export function useAddresses(token?: string): UseAddressesReturn {
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching addresses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = useCallback(async (data: AddressCreateRequest) => {
    try {
      await createAddress(data);
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
  }, [fetchAddresses]);

  const editAddress = useCallback(async (id: number, data: AddressCreateRequest) => {
    try {
      await updateAddress(id, data);
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    refetch: fetchAddresses,
    addAddress,
    editAddress,
  };
}
