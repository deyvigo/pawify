import { useState, useEffect, useCallback, useRef } from "react";
import { getReviews, createReview, ReviewDTO, ReviewCreateRequest, SliceReviewResponse } from "../services/reviewService";

// Tipo de retorno del hook useReviews
interface UseReviewsReturn {
  // Lista de resenas cargadas
  reviews: ReviewDTO[];
  // Cargando resenas
  loading: boolean;
  // Mensaje de error, o null
  error: string | null;
  // Hay mas paginas disponibles
  hasMore: boolean;
  // Recarga la primera pagina de resenas
  refetch: () => Promise<void>;
  // Carga la siguiente pagina de resenas
  loadMore: () => Promise<void>;
  // Crea una resena y recarga la lista
  addReview: (data: Omit<ReviewCreateRequest, 'detail_id'>) => Promise<void>;
}

// Maneja las resenas paginadas de un producto con funcionalidad de crear
export function useReviews(productId: number, token?: string): UseReviewsReturn {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const isInitialized = useRef(false);

  const fetchReviews = useCallback(async (pageNum: number = 0) => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: SliceReviewResponse = await getReviews(productId, pageNum, 10);
      if (pageNum === 0) {
        setReviews(data.content);
      } else {
        setReviews(prev => [...prev, ...data.content]);
      }
      setHasMore(!data.last);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching reviews");
      if (pageNum === 0) {
        setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!isInitialized.current && productId) {
      isInitialized.current = true;
      fetchReviews(0);
    }
  }, [fetchReviews, productId]);

  const refetch = useCallback(async () => {
    await fetchReviews(0);
  }, [fetchReviews]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchReviews(page + 1);
    }
  }, [fetchReviews, loading, hasMore, page]);

  const addReview = useCallback(async (data: Omit<ReviewCreateRequest, 'detail_id'>) => {
    try {
      await createReview({ ...data, detail_id: productId });
      await refetch();
    } catch (err) {
      throw err;
    }
  }, [productId, refetch]);

  return {
    reviews,
    loading,
    error,
    hasMore,
    refetch,
    loadMore,
    addReview,
  };
}
