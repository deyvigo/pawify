import { useState, useEffect, useCallback } from "react";
import { getCards, CardDTO, CardCreateRequest, createCard, updateCard } from "../services/cardService";

interface UseCardsReturn {
  cards: CardDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addCard: (data: CardCreateRequest) => Promise<void>;
  editCard: (id: number, data: CardCreateRequest) => Promise<void>;
}

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
