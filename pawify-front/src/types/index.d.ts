// Payload JWT decodificado del usuario autenticado
export interface UserPayload {
  // Identificador unico del usuario
  id: number;
  // Nombre de usuario
  username: string;
  // Rol del usuario
  role: string;
  // Nombre del usuario
  first_name: string;
  // Apellido del usuario
  last_name: string;
  // Timestamp de expiracion del token
  exp: number;
  // Token JWT raw (opcional)
  token?: string;
}

// Representacion basica de un producto para carrito y vistas locales
export interface Product {
  // Identificador unico del producto (string)
  id: string;
  // Nombre del producto
  name: string;
  // Descripcion del producto (opcional)
  description?: string;
  // Precio del producto
  price: number;
  // URL de la imagen principal
  image: string;
  // Valoracion promedio
  rating: number;
  // Cantidad de unidades vendidas
  sold_count: number;
  // Nombre de la marca (opcional)
  brand?: string;
  // Nombre de la categoria (opcional)
  category?: string;
  // Nombre de la subcategoria (opcional)
  subCategory?: string;
  // Stock disponible (opcional)
  stock?: number;
  // Cantidad de resenas (opcional)
  review_count?: number;
}

// DTO de una marca de producto
export interface BrandDTO {
  // Identificador unico de la marca
  id: number;
  // Nombre de la marca
  name: string;
}

// Categoria simplificada sin subcategorias
export interface CategorySimpleDTO {
  // Identificador unico de la categoria
  id: number;
  // Nombre de la categoria
  name: string;
}

// DTO de una subcategoria de producto
export interface SubCategoryDTO {
  // Identificador unico de la subcategoria
  id: number;
  // Nombre de la subcategoria
  name: string;
}

// DTO de una imagen de producto devuelto por la API
export interface ImageResponseDTO {
  // Identificador unico de la imagen
  id: number;
  // URL completa de la imagen
  url: string;
}

// DTO completo de un producto devuelto por la API
export interface ProductResponseDTO {
  // Identificador unico del producto
  id: number;
  // Nombre del producto
  name: string;
  // Descripcion detallada del producto
  description: string;
  // Precio del producto
  price: number;
  // Marca asociada
  brand: BrandDTO;
  // Categoria principal
  category: CategorySimpleDTO;
  // Subcategoria dentro de la categoria
  sub_category: SubCategoryDTO;
  // Unidades totales vendidas
  sold_count: number;
  // Stock disponible
  stock: number;
  // Codigo unico para compartir el producto
  share_code: string;
  // Producto activo en catalogo
  active: boolean;
  // Total de resenas de clientes
  review_count: number;
  // Valoracion promedio de clientes
  rating: number;
  // Fecha de creacion en formato ISO 8601
  created_at: string;
  // Coleccion de imagenes del producto
  images: ImageResponseDTO[];
}

// Subcategoria en listados de categorias
export interface SubCategoryResponseDTO {
  // Identificador unico de la subcategoria
  id: number;
  // Nombre de la subcategoria
  name: string;
}

// Categoria completa con sus subcategorias
export interface CategoryResponseDTO {
  // Identificador unico de la categoria
  id: number;
  // Nombre de la categoria
  name: string;
  // Lista de subcategorias
  sub_categories: SubCategoryResponseDTO[];
}

// Marca en listados de marcas
export interface BrandResponseDTO {
  // Identificador unico de la marca
  id: number;
  // Nombre de la marca
  name: string;
}

// Respuesta paginada de productos
export interface ProductsResponse {
  // Lista de productos de la pagina actual
  content: ProductResponseDTO[];
  // Metadatos de paginacion
  pageable: {
    // Numero de pagina actual (desde 0)
    page: number;
    // Cantidad de elementos por pagina
    size: number;
    // Descriptor de ordenamiento activo
    sort: string;
  };
  // Total de productos en todas las paginas
  totalElements: number;
  // Total de paginas disponibles
  totalPages: number;
  // Es la ultima pagina
  last: boolean;
}

// Item individual del carrito de compras
export interface CartItem {
  // Snapshot de datos del producto al momento de agregarlo al carrito
  product: {
    // Identificador unico del producto
    productId: number;
    // Nombre del producto
    name: string;
    // URL de la imagen principal
    image: string;
    // Todas las URLs de imagenes del producto
    images: string[];
    // Precio al momento de agregar al carrito
    price: number;
    // Rating al momento de agregar al carrito
    rating: number;
    // Unidades vendidas al momento de agregar al carrito
    sold: number;
    // Descripcion del producto
    description: string;
    // Stock disponible al momento de agregar al carrito
    stock: number;
    // Codigo para compartir el producto
    share_code: string;
    // Producto activo
    active: boolean;
    // Nombre de la marca (opcional)
    brand?: string;
    // Nombre de la categoria (opcional)
    category?: string;
    // Nombre de la subcategoria (opcional)
    sub_category?: string;
    // Tipo de mascota (opcional)
    pet?: string;
  };
  // Cantidad de unidades de este producto en el carrito
  quantity: number;
}

// Payload para crear una nueva direccion de envio
export interface AddressCreateRequestDTO {
  // Nombre o etiqueta de la direccion
  name: string;
  // Referencia adicional para ubicar la direccion
  reference: string;
  // Latitud geografica
  latitude: number;
  // Longitud geografica
  longitude: number;
}

// DTO de una direccion devuelto por la API
export interface AddressResponseDTO {
  // Identificador unico de la direccion
  id: number;
  // Nombre o etiqueta de la direccion
  name: string;
  // Referencia adicional
  reference: string;
  // Latitud geografica
  latitude: number;
  // Longitud geografica
  longitude: number;
}

// Payload para crear una nueva tarjeta de pago
export interface CardCreateRequestDTO {
  // Nombre del titular
  name: string;
  // Numero de la tarjeta (string)
  number: string;
  // Fecha de vencimiento
  due_date: string;
}

// DTO de una tarjeta de pago devuelto por la API
export interface CardResponseDTO {
  // Identificador unico de la tarjeta
  id: number;
  // Nombre del titular
  name: string;
  // Numero de la tarjeta (enmascarado o completo)
  number: string;
  // Fecha de vencimiento
  due_date: string;
}

// Payload para un item individual de una orden
export interface DetailCreateRequestDTO {
  // Identificador del producto a ordenar
  product_id: number;
  // Cantidad de unidades a ordenar
  quantity: number;
}

// Payload para crear una nueva orden
export interface OrderCreateRequestDTO {
  // Lista de items de la orden
  details: DetailCreateRequestDTO[];
}

// DTO de un item de orden devuelto por la API
export interface DetailResponseDTO {
  // Identificador unico del item
  id: number;
  // Nombre del producto en esta linea
  product_name: string;
  // Cantidad ordenada
  quantity: number;
  // Precio unitario del producto
  price: number;
  // Costo total de esta linea (precio * cantidad)
  total: number;
  // URL de la imagen del producto
  product_image: string;
}

// DTO de una orden devuelto por la API
export interface OrderResponseDTO {
  // Identificador unico de la orden
  id: number;
  // Precio total de la orden
  total_price: number;
  // Fecha de la orden en formato ISO 8601
  order_at: string;
  // Codigo de seguimiento unico
  tracking_code: string;
  // Estado actual del envio
  shipping_status: string;
  // Items de la orden
  details: DetailResponseDTO[];
}

// Parametros de filtro para consultar el catalogo de productos
export interface ProductFilters {
  // Busqueda por texto libre
  search?: string;
  // Filtrar por nombre de marca
  brand?: string;
  // Filtrar por nombre de categoria
  category?: string;
  // Filtrar por nombre de subcategoria
  sub_category?: string;
  // Precio minimo
  min_price?: number;
  // Precio maximo
  max_price?: number;
  // Descriptor de ordenamiento
  sort?: string;
}

// DTO del perfil del comprador devuelto por la API
export interface BuyerProfileDTO {
  // Nombre de usuario del comprador
  username: string;
  // Nombre del comprador
  first_name: string;
  // Apellido del comprador
  last_name: string;
  // Numero de documento de identidad
  dni_number: string;
  // Cantidad de tarjetas registradas
  count_cards: number;
  // Cantidad de direcciones registradas
  count_addresses: number;
  // URL de la foto de perfil, o null si no tiene
  profile: { id: number; url: string } | null;
}
