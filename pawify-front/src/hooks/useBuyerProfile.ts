import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { BuyerProfileDTO } from "../types";

interface UseBuyerProfileReturn {
  buyerData: BuyerProfileDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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