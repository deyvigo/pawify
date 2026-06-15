import { useState, useEffect } from "react";
import { api } from "../services/api";
import { CategoryResponseDTO, BrandResponseDTO } from "../types";

interface UseCategoriesReturn {
  categories: CategoryResponseDTO[];
  brands: BrandResponseDTO[];
  loading: boolean;
  error: string | null;
}

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
