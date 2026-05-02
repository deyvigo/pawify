import React, { useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from './src/theme/colors';
import { BottomNavBar } from './src/components/BottomNavBar/BottomNavBar';
import { DrawerMenu } from './src/components/DrawerMenu/DrawerMenu';
import { ProductListScreen } from './src/screens/ProductListScreen/ProductListScreen';
import { PurchaseScreen } from './src/screens/PurchaseScreen/PurchaseScreen';
import { OrdersScreen } from './src/screens/OrdersScreen/OrdersScreen';
import { AccountScreen } from './src/screens/AccountScreen/AccountScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen/ProductDetailScreen';
import { Product } from './src/types/product';
import { useProducts } from './src/hooks/useProducts';
import { ProductResponseDTO } from './src/types';

type TabKey = 'catalog' | 'purchase' | 'orders' | 'account';

interface AppContextType {
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
}

const AppContext = createContext<AppContextType>({
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
});

export const useAppContext = () => useContext(AppContext);

const screens: Record<TabKey, React.FC> = {
  catalog: ProductListScreen,
  purchase: PurchaseScreen,
  orders: OrdersScreen,
  account: AccountScreen,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const ActiveScreen = screens[activeTab];

  const productApi = useProducts();

  return (
    <AppContext.Provider
      value={{
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        selectedProduct,
        setSelectedProduct,
        ...productApi,
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {selectedProduct ? (
            <ProductDetailScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} />
          ) : (
            <ActiveScreen />
          )}
        </View>
        <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        {!selectedProduct && (
          <BottomNavBar activeTab={activeTab} onTabPress={(tab) => {
            setActiveTab(tab);
            setSelectedProduct(null);
          }} />
        )}
        <StatusBar style="dark" />
      </SafeAreaView>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
