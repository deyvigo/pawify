import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { BuyerProfileDTO } from "../types";

// Tipo de retorno del hook useBuyerProfile
interface UseBuyerProfileReturn {
  // Datos del perfil del comprador, o null si no esta cargado
  buyerData: BuyerProfileDTO | null;
  // Cargando perfil
  loading: boolean;
  // Mensaje de error, o null
  error: string | null;
  // Recarga manualmente el perfil del comprador
  refetch: () => Promise<void>;
}

// Carga y cachea el perfil del comprador autenticado
export function useBuyerProfile(authKey?: string): UseBuyerProfileReturn {
  const [buyerData, setBuyerData] = useState<BuyerProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyer = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<BuyerProfileDTO>('/buyer');
      console.log('[useBuyerProfile] RAW buyer data:', JSON.stringify(data, null, 2));
      setBuyerData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching buyer profile");
    } finally {
      setLoading(false);
    }
  }, [authKey]);

  useEffect(() => {
    fetchBuyer();
  }, [fetchBuyer]);

  return {
    buyerData,
    loading,
    error,
    refetch: fetchBuyer,
  };
}