import { useState, useEffect, useCallback, useRef } from "react";
import { getReviews, createReview, ReviewDTO, ReviewCreateRequest, SliceReviewResponse } from "../services/reviewService";

/**
 * Return type for the {@link useReviews} hook.
 */
interface UseReviewsReturn {
  /** Array of reviews loaded so far for the product */
  reviews: ReviewDTO[];
  /** Whether reviews are currently being fetched */
  loading: boolean;
  /** Error message from the last failed request, or null */
  error: string | null;
  /** Whether more pages of reviews are available */
  hasMore: boolean;
  /** Function to re-fetch reviews from the first page */
  refetch: () => Promise<void>;
  /** Function to load the next page of reviews */
  loadMore: () => Promise<void>;
  /** Function to submit a new review for the product and refresh the list */
  addReview: (data: Omit<ReviewCreateRequest, 'detail_id'>) => Promise<void>;
}

/**
 * Hook that manages paginated product reviews with create functionality.
 *
 * Fetches reviews for a specific product on mount and provides pagination,
 * refresh, and review submission capabilities.
 *
 * @param productId - The unique identifier of the product whose reviews to manage.
 * @param token - Optional authentication token (reserved for authenticated review creation).
 * @returns The {@link UseReviewsReturn} object with review data and control functions.
 *
 * @example
 * ```tsx
 * const { reviews, loading, addReview, loadMore } = useReviews(productId, token);
 * addReview({ content: "Great product!", rating: 5 });
 * ```
 */
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
