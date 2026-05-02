import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { ProductResponseDTO } from "../types";

interface UseProductsReturn {
  products: ProductResponseDTO[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
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
  loadMore: () => void;
  refresh: () => Promise<void>;
}

const PAGE_SIZE = 20;
const SORT_MAP: Record<string, string> = {
  "price-asc": "price,asc",
  "price-desc": "price,desc",
  "name-az": "name,asc",
  "name-za": "name,desc",
  "best-selling": "soldCount,desc",
  "best-rated": "rating,desc",
};

export function useProducts(token?: string): UseProductsReturn {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentParams, setCurrentParams] = useState<Record<string, any>>({});

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
    const sortParam = params.sort ? SORT_MAP[params.sort] || params.sort : undefined;
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
      }>(`/product${queryString}`, token);

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
  }, [token]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadProducts({ ...currentParams, page: currentPage + 1 });
    }
  }, [loadProducts, currentParams, currentPage, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    await loadProducts({ ...currentParams, page: 0 });
  }, [loadProducts, currentParams]);

  useEffect(() => {
    loadProducts();
  }, []);

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
