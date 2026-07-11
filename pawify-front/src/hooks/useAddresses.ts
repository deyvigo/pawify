import { useState, useEffect, useCallback } from "react";
import { getAddresses, AddressDTO, AddressCreateRequest, createAddress, updateAddress } from "../services/addressService";

/**
 * Return type for the {@link useAddresses} hook.
 */
interface UseAddressesReturn {
  /** Array of delivery addresses for the authenticated user */
  addresses: AddressDTO[];
  /** Whether the addresses are currently being fetched */
  loading: boolean;
  /** Error message from the last failed request, or null */
  error: string | null;
  /** Function to manually re-fetch the address list */
  refetch: () => Promise<void>;
  /** Function to create a new address and refresh the list */
  addAddress: (data: AddressCreateRequest) => Promise<void>;
  /** Function to update an existing address and refresh the list */
  editAddress: (id: number, data: AddressCreateRequest) => Promise<void>;
}

/**
 * Hook that manages the user's delivery addresses with CRUD operations.
 *
 * Fetches the address list on mount and provides functions to add, edit,
 * and re-fetch addresses. All mutations automatically refresh the list.
 *
 * @param token - Optional authentication token; addresses load only when this is provided.
 * @returns The {@link UseAddressesReturn} object with address data and control functions.
 *
 * @example
 * ```tsx
 * const { addresses, loading, addAddress } = useAddresses(token);
 * addAddress({ name: "Home", reference: "Apt 1", latitude: -12.0, longitude: -77.0 });
 * ```
 */
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
