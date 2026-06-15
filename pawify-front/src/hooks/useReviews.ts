import { useState, useEffect, useCallback, useRef } from "react";
import { getReviews, createReview, ReviewDTO, ReviewCreateRequest, SliceReviewResponse } from "../services/reviewService";

interface UseReviewsReturn {
  reviews: ReviewDTO[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  addReview: (data: Omit<ReviewCreateRequest, 'detail_id'>) => Promise<void>;
}

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
