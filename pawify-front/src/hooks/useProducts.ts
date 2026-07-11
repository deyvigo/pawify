import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { ProductResponseDTO } from "../types";

/**
 * Return type for the {@link useProducts} hook.
 */
interface UseProductsReturn {
  /** Array of products matching the current query/filters */
  products: ProductResponseDTO[];
  /** Whether the initial product load is in progress */
  loading: boolean;
  /** Whether a next-page load is in progress */
  loadingMore: boolean;
  /** Error message from the last failed request, or null */
  error: string | null;
  /** Whether more pages of results are available */
  hasMore: boolean;
  /** Function to load products with the given filter/sort parameters */
  loadProducts: (params: {
    search?: string;
    brand?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
  }) => Promise<void>;
  /** Function to load the next page of products using the current filters */
  loadMore: () => void;
  /** Function to reload the first page with the current filters */
  refresh: () => Promise<void>;
}

/** Number of products to request per page. */
const PAGE_SIZE = 20;

/** Maps user-facing sort labels to API sort query parameters. */
const SORT_MAP: Record<string, string> = {
  "price-asc": "price,asc",
  "price-desc": "price,desc",
  "name-az": "name,asc",
  "name-za": "name,desc",
  "best-selling": "soldCount,desc",
  "best-rated": "rating,desc",
};

/**
 * Hook that manages product listing with filtering, sorting, and pagination.
 *
 * Fetches products from the `/product` endpoint and maintains scroll-based
 * infinite loading state.
 *
 * @param authKey - Optional authentication key; products load only when this is provided.
 * @returns The {@link UseProductsReturn} object with product data and control functions.
 *
 * @example
 * ```tsx
 * const { products, loading, loadProducts, loadMore } = useProducts(token);
 * loadProducts({ search: "collar", sort: "price-asc" });
 * ```
 */
export function useProducts(authKey?: string): UseProductsReturn {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentParams, setCurrentParams] = useState<Record<string, any>>({ sort: 'name,asc' });

  const buildQueryString = (params: Record<string, any>, page: number): string => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(PAGE_SIZE),
    });

    if (params.search) query.append("search", params.search);
    if (params.brand) query.append("brand", params.brand);
    if (params.category) query.append("category", params.category);
    if (params.subCategory) query.append("subCategory", params.subCategory);
    if (params.minPrice !== undefined && params.minPrice !== null) query.append("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined && params.maxPrice !== null) query.append("maxPrice", String(params.maxPrice));
    if (params.sort) query.append("sort", params.sort);

    return `?${query.toString()}`;
  };

  const loadProducts = useCallback(async (params: {
    search?: string;
    brand?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
  } = {}) => {
    const page = params.page ?? 0;
    const sortParam = params.sort ? SORT_MAP[params.sort] || params.sort : 'name,asc';
    const queryParams = { ...params, sort: sortParam };
    delete queryParams.page;

    const isLoadingMore = page > 0;
    
    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const queryString = buildQueryString(queryParams as Record<string, any>, page);
      const response = await api.get<{
        content: ProductResponseDTO[];
        last: boolean;
      }>(`/product${queryString}`);

      const newProducts = response.content || [];
      
      if (isLoadingMore) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      
      setHasMore(!response.last);
      setCurrentPage(page);
      setCurrentParams(queryParams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading products");
    } finally {
      if (isLoadingMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [authKey]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadProducts({ ...currentParams, page: currentPage + 1 });
    }
  }, [loadProducts, currentParams, currentPage, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    await loadProducts({ ...currentParams, page: 0 });
  }, [loadProducts, currentParams]);

  useEffect(() => {
    if (!authKey) return;
    loadProducts();
  }, [authKey]);

  return {
    products: Array.isArray(products) ? products : [],
    loading,
    loadingMore,
    error,
    hasMore,
    loadProducts,
    loadMore,
    refresh,
  };
}
