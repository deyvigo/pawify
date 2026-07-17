import { useState, useEffect } from "react";
import { api } from "../services/api";
import { CategoryResponseDTO, BrandResponseDTO } from "../types";

// Tipo de retorno del hook useCategories
interface UseCategoriesReturn {
  // Lista de categorias cargadas
  categories: CategoryResponseDTO[];
  // Lista de marcas cargadas
  brands: BrandResponseDTO[];
  // Datos cargando
  loading: boolean;
  // Mensaje de error, o null
  error: string | null;
}

// Carga y cachea categorias y marcas desde la API
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
