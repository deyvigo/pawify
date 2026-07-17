// Representacion de un producto usada en carrito y vistas locales
export interface Product {
  // Identificador unico del producto
  productId: number;
  // Nombre del producto
  name: string;
  // URL de la imagen principal
  image: string;
  // Todas las URLs de imagenes del producto
  images: string[];
  // Precio del producto
  price: number;
  // Valoracion promedio de clientes
  rating: number;
  // Total de unidades vendidas
  sold: number;
  // Descripcion detallada del producto
  description: string;
  // Stock disponible
  stock: number;
  // Codigo para compartir el producto
  share_code: string;
  // Producto activo en catalogo
  active: boolean;
  // Nombre de la marca (opcional)
  brand?: string;
  // Nombre de la categoria (opcional)
  category?: string;
  // Nombre de la subcategoria (opcional)
  sub_category?: string;
  // Tipo de mascota (opcional)
  pet?: string;
}
