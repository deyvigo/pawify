import { useState, useEffect, useCallback } from "react";
import { getAddresses, AddressDTO, AddressCreateRequest, createAddress, updateAddress } from "../services/addressService";

// Tipo de retorno del hook useAddresses
interface UseAddressesReturn {
  // Lista de direcciones del usuario
  addresses: AddressDTO[];
  // Cargando direcciones
  loading: boolean;
  // Mensaje de error, o null
  error: string | null;
  // Recarga manualmente la lista de direcciones
  refetch: () => Promise<void>;
  // Crea una direccion nueva y recarga la lista
  addAddress: (data: AddressCreateRequest) => Promise<void>;
  // Actualiza una direccion existente y recarga la lista
  editAddress: (id: number, data: AddressCreateRequest) => Promise<void>;
}

// Maneja las direcciones de envio del usuario con operaciones CRUD
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
