import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { BuyerProfileDTO } from "../types";

/**
 * Return type for the {@link useBuyerProfile} hook.
 */
interface UseBuyerProfileReturn {
  /** The buyer's profile data, or null if not yet loaded */
  buyerData: BuyerProfileDTO | null;
  /** Whether the profile is currently being fetched */
  loading: boolean;
  /** Error message from the last failed request, or null */
  error: string | null;
  /** Function to manually re-fetch the buyer profile */
  refetch: () => Promise<void>;
}

/**
 * Hook that fetches and caches the authenticated buyer's profile data.
 *
 * Calls the `/buyer` endpoint on mount (or when `authKey` changes) and
 * provides the profile along with loading/error state.
 *
 * @param authKey - Optional authentication key; profile loads only when this is provided.
 * @returns The {@link UseBuyerProfileReturn} object with profile data and control functions.
 *
 * @example
 * ```tsx
 * const { buyerData, loading, refetch } = useBuyerProfile(token);
 * if (buyerData) {
 *   console.log(buyerData.username);
 * }
 * ```
 */
export function useBuyerProfile(authKey?: string): UseBuyerProfileReturn {
  const [buyerData, setBuyerData] = useState<BuyerProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyer = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<BuyerProfileDTO>('/buyer');
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