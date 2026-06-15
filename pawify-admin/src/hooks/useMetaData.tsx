import { getBrands, getCategories, getSubCategoriesByCategoryName } from "@/services/metaService"
import { useQuery } from "@tanstack/react-query"

export const useMetaData = (subCatogoryName: string) => {
  const { data: brands } = useQuery({
    queryKey: ['brand'],
    queryFn: () => getBrands()
  })

  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: () => getCategories()
  })

  const { data: subCategories } = useQuery({
    queryKey: ['sub-category', subCatogoryName],
    queryFn: () => getSubCategoriesByCategoryName(subCatogoryName),
    staleTime: 30_000,
    enabled: !!subCatogoryName
  })

  return { brands, categories, subCategories }
}