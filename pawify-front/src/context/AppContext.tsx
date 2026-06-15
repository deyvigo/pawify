
import { createContext, useContext } from 'react';
import { Product } from '../types/product';
import { ProductResponseDTO, UserPayload, CategoryResponseDTO, BrandResponseDTO, CartItem } from '../types';
import { OrderResponseDTO } from '../types';

export type TabKey = 'catalog' | 'purchase' | 'orders' | 'account';

export interface AppContextType {
    drawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    products: ProductResponseDTO[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    loadProducts: (params?: any) => Promise<void>;
    loadMore: () => void;
    refresh: () => Promise<void>;
    currentUser: UserPayload | null;
    setCurrentUser: (user: UserPayload | null) => void;
    setActiveTab: (tab: TabKey) => void;
    categories: CategoryResponseDTO[];
    brands: BrandResponseDTO[];
    categoriesLoading: boolean;
    pendingFilterParams: Record<string, any> | null;
    setPendingFilterParams: (params: Record<string, any> | null) => void;
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    checkoutActive: boolean;
    setCheckoutActive: (active: boolean) => void;
}

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

export const useAppContext = () => useContext(AppContext);