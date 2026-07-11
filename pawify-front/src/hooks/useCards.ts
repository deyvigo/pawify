import { useState, useEffect, useCallback } from "react";
import { getCards, CardDTO, CardCreateRequest, createCard, updateCard } from "../services/cardService";

/**
 * Return type for the {@link useCards} hook.
 */
interface UseCardsReturn {
  /** Array of payment cards for the authenticated user */
  cards: CardDTO[];
  /** Whether the cards are currently being fetched */
  loading: boolean;
  /** Error message from the last failed request, or null */
  error: string | null;
  /** Function to manually re-fetch the card list */
  refetch: () => Promise<void>;
  /** Function to create a new card and refresh the list */
  addCard: (data: CardCreateRequest) => Promise<void>;
  /** Function to update an existing card and refresh the list */
  editCard: (id: number, data: CardCreateRequest) => Promise<void>;
}

/**
 * Hook that manages the user's payment cards with CRUD operations.
 *
 * Fetches the card list on mount and provides functions to add, edit,
 * and re-fetch cards. All mutations automatically refresh the list.
 *
 * @param token - Optional authentication token; cards load only when this is provided.
 * @returns The {@link UseCardsReturn} object with card data and control functions.
 *
 * @example
 * ```tsx
 * const { cards, loading, addCard, editCard } = useCards(token);
 * addCard({ name: "Visa", number: "4111...", due_date: "12/25" });
 * ```
 */
export function useCards(token?: string): UseCardsReturn {
  const [cards, setCards] = useState<CardDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!token) {
      setCards([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCards();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching cards");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addCard = useCallback(async (data: CardCreateRequest) => {
    try {
      await createCard(data);
      await fetchCards();
    } catch (err) {
      throw err;
    }
  }, [fetchCards]);

  const editCard = useCallback(async (id: number, data: CardCreateRequest) => {
    try {
      await updateCard(id, data);
      await fetchCards();
    } catch (err) {
      throw err;
    }
  }, [fetchCards]);

  return {
    cards,
    loading,
    error,
    refetch: fetchCards,
    addCard,
    editCard,
  };
}
