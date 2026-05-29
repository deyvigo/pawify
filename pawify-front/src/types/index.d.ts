export interface UserPayload {
  id: number;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
  exp: number;
  token?: string;
}

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
  sub_category: SubCategoryDTO;
  sold_count: number;
  stock: number;
  share_code: string;
  active: boolean;
  review_count: number;
  rating: number;
  created_at: string;
  images: ImageResponseDTO[];
}

export interface SubCategoryResponseDTO {
  id: number;
  name: string;
}

export interface CategoryResponseDTO {
  id: number;
  name: string;
  sub_categories: SubCategoryResponseDTO[];
}

export interface BrandResponseDTO {
  id: number;
  name: string;
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

export interface CartItem {
  product: {
    id: string;
    productId: number;
    name: string;
    image: string;
    images: string[];
    price: number;
    rating: number;
    sold: number;
    description: string;
    stock: number;
    share_code: string;
    active: boolean;
    brand?: string;
    category?: string;
    sub_category?: string;
    pet?: string;
  };
  quantity: number;
}

export interface AddressCreateRequestDTO {
  name: string;
  reference: string;
  latitude: number;
  longitude: number;
}

export interface AddressResponseDTO {
  id: number;
  name: string;
  reference: string;
  latitude: number;
  longitude: number;
}

export interface CardCreateRequestDTO {
  name: string;
  number: string;
  due_date: string;
}

export interface CardResponseDTO {
  id: number;
  name: string;
  number: string;
  due_date: string;
}

export interface DetailCreateRequestDTO {
  product_id: number;
  quantity: number;
}

export interface OrderCreateRequestDTO {
  details: DetailCreateRequestDTO[];
}

export interface DetailResponseDTO {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  product_image: string;
}

export interface OrderResponseDTO {
  id: number;
  total_price: number;
  order_at: string;
  tracking_code: string;
  shipping_status: string;
  details: DetailResponseDTO[];
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

export interface BuyerProfileDTO {
  username: string;
  first_name: string;
  last_name: string;
  dni_number: string;
  profile: string | null;
}
