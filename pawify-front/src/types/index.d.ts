export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  rating: number;
  sold_count: number;
  brand?: string;
  category?: string;
  subCategory?: string;
  stock?: number;
  review_count?: number;
}

export interface BrandDTO {
  id: number;
  name: string;
}

export interface CategorySimpleDTO {
  id: number;
  name: string;
}

export interface SubCategoryDTO {
  id: number;
  name: string;
}

export interface ImageDTO {
  id: number;
  url: string;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: BrandDTO;
  category: CategorySimpleDTO;
  sub_category: SubCategoryDTO;
  sold_count: number;
  stock: number;
  share_code: string;
  active: boolean;
  review_count: number;
  rating: number;
  created_at: string;
  images: ImageDTO[];
}

export interface CategorySimpleDTO {
  id: number;
  name: string;
}

export interface SubCategoryResponseDTO {
  id: number;
  name: string;
}

export interface ImageResponseDTO {
  id: number;
  url: string;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: BrandDTO;
  category: CategorySimpleDTO;
  sub_category: SubCategoryResponseDTO;
  sold_count: number;
  stock: number;
  share_code: string;
  active: boolean;
  review_count: number;
  rating: number;
  created_at: string;
  images: ImageResponseDTO[];
}

export interface ProductsResponse {
  content: ProductResponseDTO[];
  pageable: {
    page: number;
    size: number;
    sort: string;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  category?: string;
  sub_category?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}
