import { useState, useEffect } from "react";
import { api } from "../services/api";
import { CategoryResponseDTO, BrandResponseDTO } from "../types";

/**
 * Return type for the {@link useCategories} hook.
 */
interface UseCategoriesReturn {
  /** Array of category response DTOs loaded from the API */
  categories: CategoryResponseDTO[];
  /** Array of brand response DTOs loaded from the API */
  brands: BrandResponseDTO[];
  /** Whether the data is currently being fetched */
  loading: boolean;
  /** Error message from the last failed request, or null */
  error: string | null;
}

/**
 * Hook that fetches and caches the list of categories and brands from the API.
 *
 * Data is loaded on mount (or when `authKey` changes) via parallel requests
 * to `/category` and `/brand`.
 *
 * @param authKey - Optional authentication key; data loads only when this is provided.
 * @returns The {@link UseCategoriesReturn} object with category and brand data.
 *
 * @example
 * ```tsx
 * const { categories, brands, loading } = useCategories(token);
 * ```
 */
export function useCategories(authKey?: string): UseCategoriesReturn {
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [brands, setBrands] = useState<BrandResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authKey) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [categoriesData, brandsData] = await Promise.all([
          api.get<CategoryResponseDTO[]>("/category"),
          api.get<BrandResponseDTO[]>("/brand"),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authKey]);

  return { categories, brands, loading, error };
}
