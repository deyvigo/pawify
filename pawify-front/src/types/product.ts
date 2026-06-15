export interface Product {
  id: string;
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
}
