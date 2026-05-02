
import { createContext, useContext } from 'react';
import { Product } from '../types/product';
import { ProductResponseDTO, UserPayload } from '../types';



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
    setActiveTab: (tab: TabKey) => void;
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
    setActiveTab: () => {},
});

export const useAppContext = () => useContext(AppContext);