
import { createContext, useContext } from 'react';
import { Product } from '../types/product';
import { ProductResponseDTO, UserPayload, CategoryResponseDTO, BrandResponseDTO, CartItem } from '../types';
import { OrderResponseDTO } from '../types';

/**
 * Union of valid bottom-navigation tab keys.
 */
export type TabKey = 'catalog' | 'purchase' | 'orders' | 'account';

/**
 * Shape of the global application context shared across all screens.
 */
export interface AppContextType {
    /** Whether the navigation drawer is currently open */
    drawerOpen: boolean;
    /** Opens the navigation drawer */
    openDrawer: () => void;
    /** Closes the navigation drawer */
    closeDrawer: () => void;
    /** Currently selected product for detail view, or null */
    selectedProduct: Product | null;
    /** Sets the currently selected product (or clears it) */
    setSelectedProduct: (product: Product | null) => void;
    /** List of products loaded from the catalog */
    products: ProductResponseDTO[];
    /** Whether the initial product load is in progress */
    loading: boolean;
    /** Whether a next-page load is in progress */
    loadingMore: boolean;
    /** Whether more pages of products are available */
    hasMore: boolean;
    /** Function to load products with the given filter/sort parameters */
    loadProducts: (params?: any) => Promise<void>;
    /** Function to load the next page of products */
    loadMore: () => void;
    /** Function to reload the first page of products with the current filters */
    refresh: () => Promise<void>;
    /** The currently authenticated user payload, or null if not logged in */
    currentUser: UserPayload | null;
    /** Sets the current user (e.g. on login) or clears it (on logout) */
    setCurrentUser: (user: UserPayload | null) => void;
    /** Navigates to the specified bottom tab */
    setActiveTab: (tab: TabKey) => void;
    /** List of product categories from the API */
    categories: CategoryResponseDTO[];
    /** List of product brands from the API */
    brands: BrandResponseDTO[];
    /** Whether categories and brands are currently being fetched */
    categoriesLoading: boolean;
    /** Pending filter parameters to apply when the catalog screen is focused, or null */
    pendingFilterParams: Record<string, any> | null;
    /** Sets or clears the pending filter parameters */
    setPendingFilterParams: (params: Record<string, any> | null) => void;
    /** Array of items currently in the shopping cart */
    cartItems: CartItem[];
    /** Total number of items across all cart lines */
    cartCount: number;
    /** Summed total price of all items in the cart */
    cartTotal: number;
    /** Adds a product to the cart with the given quantity (defaults to 1) */
    addToCart: (product: Product, quantity?: number) => void;
    /** Removes a product from the cart by its product ID */
    removeFromCart: (productId: number) => void;
    /** Updates the quantity of a specific product in the cart */
    updateQuantity: (productId: number, quantity: number) => void;
    /** Empties the entire shopping cart */
    clearCart: () => void;
    /** Whether the checkout flow is currently active */
    checkoutActive: boolean;
    /** Sets whether the checkout flow is active */
    setCheckoutActive: (active: boolean) => void;
}

/**
 * React context for the Pawify application's shared state.
 *
 * Provides default no-op values so that `useAppContext` can be called
 * outside of a provider without throwing (though the values will be inert).
 */
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

/**
 * Convenience hook to access the global application context.
 *
 * Must be used within a component tree wrapped by the `AppContext.Provider`.
 *
 * @returns The current {@link AppContextType} value.
 */
export const useAppContext = () => useContext(AppContext);