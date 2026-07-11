
import { createContext, useContext } from 'react';
import { Product } from '../types/product';
import { ProductResponseDTO, UserPayload, CategoryResponseDTO, BrandResponseDTO, CartItem } from '../types';
import { OrderResponseDTO } from '../types';

// Claves validas del bottom navigation
export type TabKey = 'catalog' | 'purchase' | 'orders' | 'account';

// Forma del contexto global de la aplicacion compartido entre pantallas
export interface AppContextType {
    // Drawer de navegacion abierto
    drawerOpen: boolean;
    // Abre el drawer de navegacion
    openDrawer: () => void;
    // Cierra el drawer de navegacion
    closeDrawer: () => void;
    // Producto seleccionado para vista detalle, o null
    selectedProduct: Product | null;
    // Selecciona un producto para vista detalle (o limpia la seleccion)
    setSelectedProduct: (product: Product | null) => void;
    // Lista de productos del catalogo
    products: ProductResponseDTO[];
    // Cargando productos iniciales
    loading: boolean;
    // Cargando mas productos (scroll infinito)
    loadingMore: boolean;
    // Hay mas paginas de productos disponibles
    hasMore: boolean;
    // Carga productos con filtros/ordenamiento dados
    loadProducts: (params?: any) => Promise<void>;
    // Carga la siguiente pagina de productos
    loadMore: () => void;
    // Recarga la primera pagina de productos con filtros actuales
    refresh: () => Promise<void>;
    // Usuario autenticado actualmente, o null si no esta logueado
    currentUser: UserPayload | null;
    // Establece el usuario actual (login) o lo limpia (logout)
    setCurrentUser: (user: UserPayload | null) => void;
    // Navega al tab del bottom navigation indicado
    setActiveTab: (tab: TabKey) => void;
    // Lista de categorias de productos desde la API
    categories: CategoryResponseDTO[];
    // Lista de marcas de productos desde la API
    brands: BrandResponseDTO[];
    // Cargando categorias y marcas
    categoriesLoading: boolean;
    // Filtros pendientes para aplicar cuando se enfoque la pantalla del catalogo
    pendingFilterParams: Record<string, any> | null;
    // Establece o limpia los filtros pendientes
    setPendingFilterParams: (params: Record<string, any> | null) => void;
    // Items actualmente en el carrito de compras
    cartItems: CartItem[];
    // Total de items en todas las lineas del carrito
    cartCount: number;
    // Suma total del precio de todos los items del carrito
    cartTotal: number;
    // Agrega un producto al carrito con la cantidad dada (default 1)
    addToCart: (product: Product, quantity?: number) => void;
    // Elimina un producto del carrito por su ID
    removeFromCart: (productId: number) => void;
    // Actualiza la cantidad de un producto especifico en el carrito
    updateQuantity: (productId: number, quantity: number) => void;
    // Vacia todo el carrito de compras
    clearCart: () => void;
    // Flujo de checkout activo actualmente
    checkoutActive: boolean;
    // Establece si el flujo de checkout esta activo
    setCheckoutActive: (active: boolean) => void;
}

// Contexto de React para el estado compartido de la aplicacion Pawify
export const AppContext = createContext<AppContextType>({
    drawerOpen: false,
    openDrawer: () => {},
    closeDrawer: () => {},
    selectedProduct: null,
    setSelectedProduct: () => {},
    products: [],
    loading: true,
    loadingMore: false,
    hasMore: true,
    loadProducts: async () => {},
    loadMore: () => {},
    refresh: async () => {},
    currentUser: null,
    setCurrentUser: () => {},
    setActiveTab: () => {},
    categories: [],
    brands: [],
    categoriesLoading: true,
    pendingFilterParams: null,
    setPendingFilterParams: () => {},
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    checkoutActive: false,
    setCheckoutActive: () => {},
});

// Hook de conveniencia para acceder al contexto global de la aplicacion
export const useAppContext = () => useContext(AppContext);