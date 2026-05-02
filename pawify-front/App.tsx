import React, { useState } from 'react';
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
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen'; 
import { RecoveryScreen } from './src/screens/RecoveryScreen'
import { NewPasswordScreen } from './src/screens/NewPasswordScreen';

import { Product } from './src/types/product';
import { useProducts } from './src/hooks/useProducts';
import { UserPayload } from './src/types';
import { getAuthUser } from './src/config';
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

  const [currentUser,setCurrentUser] = useState<UserPayload | null>(getAuthUser);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'| 'recovery'| 'newPassword'>('login');

  const [recoveryUser, setRecoveryUser] = useState<string>('');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  

  const ActiveScreen = screens[activeTab];

  const productApi = useProducts();

  
  if (!currentUser) {
    return (
    <SafeAreaView style={styles.container}>
            {authScreen === 'login' && (
              <LoginScreen 
                onLoginSuccess={(userData: any) => setCurrentUser(userData as UserPayload)} 
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
                onBackToLogin={() => setAuthScreen('login')} // Para el botón de "Volver"
                username={recoveryUser}
                onCodeVerified={(code:string) => {
                    setRecoveryCode(code);
                    setAuthScreen('newPassword'); // Pasamos a la siguiente pantalla
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
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
