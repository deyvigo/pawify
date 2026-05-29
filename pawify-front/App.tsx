import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from './src/theme/colors';
import { BottomNavBar } from './src/components/BottomNavBar/BottomNavBar';
import { DrawerMenu } from './src/components/DrawerMenu/DrawerMenu';
import { ProductListScreen } from './src/screens/ProductListScreen/ProductListScreen';
import { PurchaseScreen } from './src/screens/PurchaseScreen/PurchaseScreen';
import { CheckoutScreen } from './src/screens/PurchaseScreen/CheckoutScreen';
import { OrdersScreen } from './src/screens/OrdersScreen/OrdersScreen';
import { AccountScreen } from './src/screens/AccountScreen/AccountScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen/ProductDetailScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen'; 
import { RecoveryScreen } from './src/screens/RecoveryScreen'
import { NewPasswordScreen } from './src/screens/NewPasswordScreen';

import { Product } from './src/types/product';
import { useProducts } from './src/hooks/useProducts';
import { useCategories } from './src/hooks/useCategories';
import { UserPayload, CartItem } from './src/types';
import { setAuthToken, loadAuthToken, getAuthUser } from './src/config';
import { AppContext,TabKey } from './src/context/AppContext';
import { loadCartFromStorage, saveCartToStorage } from './src/services/cartStorage';

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

  const [currentUser,setCurrentUser] = useState<UserPayload | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'| 'recovery'| 'newPassword'>('login');

  const [recoveryUser, setRecoveryUser] = useState<string>('');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [pendingFilterParams, setPendingFilterParams] = useState<Record<string, any> | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutActive, setCheckoutActive] = useState(false);

  // Load token from secure store on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await loadAuthToken();
        const user = getAuthUser();
        if (user && token) {
          setCurrentUser({ ...user, token: token });
        }
      } catch (error) {
        console.error('Error loading auth token:', error);
      } finally {
        const savedCart = await loadCartFromStorage();
        if (savedCart.length > 0) {
          setCartItems(savedCart);
        }
        setIsLoadingAuth(false);
      }
    };
    loadUser();
  }, []);

  const handleSetCurrentUser = async (user: any) => {
    if (user?.token) {
      await setAuthToken(user.token);
      const decoded = getAuthUser();
      if (decoded) {
        setCurrentUser({ ...decoded, token: user.token });
      } else {
        setCurrentUser(null);
      }
    } else {
      await setAuthToken(null);
      setCurrentUser(null);
    }
  };

  const updateCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
    saveCartToStorage(items);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      saveCartToStorage(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      saveCartToStorage(updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCartToStorage([]);
  }, []);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartItems]);

  const { categories, brands, loading: categoriesLoading } = useCategories(currentUser?.token);
  const productApi = useProducts(currentUser?.token);

  const ActiveScreen = screens[activeTab];

  
  if (isLoadingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
    <SafeAreaView style={styles.container}>
            {authScreen === 'login' && (
              <LoginScreen 
                onLoginSuccess={handleSetCurrentUser} 
                onNavigateToRegister={() => setAuthScreen('register')} 
                onNavigateToForgotPassword={(userToRecover: string) => {
                  setRecoveryUser(userToRecover);  
                  setAuthScreen('recovery');       
              }}
              />
            )}
            
            {authScreen === 'register' && (
              <RegisterScreen 
                onNavigateToLogin={() => setAuthScreen('login')} 
              />
            )}

            {authScreen === 'recovery' && (
              <RecoveryScreen 
                onBackToLogin={() => setAuthScreen('login')}
                username={recoveryUser}
                onCodeVerified={(code:string) => {
                    setRecoveryCode(code);
                    setAuthScreen('newPassword');
                }}
              />
            )}

            {authScreen === 'newPassword' && (
              <NewPasswordScreen 
                  username={recoveryUser}
                  code={recoveryCode}
                  onBackToRecovery={() => setAuthScreen('recovery')}
                  onPasswordResetSuccess={() => setAuthScreen('login')} 
              />
            )}
            <StatusBar style="dark" />
          </SafeAreaView>
        );
  }


  return (
    <AppContext.Provider
      value={{
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        selectedProduct,
        setSelectedProduct,
        ...productApi,
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        setActiveTab,
        categories,
        brands,
        categoriesLoading,
        pendingFilterParams,
        setPendingFilterParams,
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkoutActive,
        setCheckoutActive,
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {checkoutActive ? (
            <CheckoutScreen
              onBack={() => setCheckoutActive(false)}
              onSuccess={() => {
                clearCart();
                setCheckoutActive(false);
                setActiveTab('orders');
              }}
            />
          ) : selectedProduct ? (
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
    flex:1,
    backgroundColor: colors.background,
  },
  content: {
    flex:1,
  },
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});