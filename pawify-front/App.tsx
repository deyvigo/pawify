import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from './src/theme/colors';
import { BottomNavBar } from './src/components/BottomNavBar/BottomNavBar';
import { DrawerMenu } from './src/components/DrawerMenu/DrawerMenu';
import { ProductListScreen } from './src/screens/ProductListScreen/ProductListScreen';
import { PurchaseScreen } from './src/screens/PurchaseScreen/PurchaseScreen';
import { OrdersScreen } from './src/screens/OrdersScreen/OrdersScreen';
import { AccountScreen } from './src/screens/AccountScreen/AccountScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen/ProductDetailScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen'; 
import { RecoveryScreen } from './src/screens/RecoveryScreen'
import { NewPasswordScreen } from './src/screens/NewPasswordScreen';

import { Product } from './src/types/product';
import { useProducts } from './src/hooks/useProducts';
import { UserPayload } from './src/types';
import { setAuthToken, loadAuthToken, getAuthUser } from './src/config';
import { AppContext,TabKey } from './src/context/AppContext';

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