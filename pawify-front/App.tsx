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

type TabKey = 'catalog' | 'purchase' | 'orders' | 'account';

interface AppContextType {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const AppContext = createContext<AppContextType>({
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
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

  const ActiveScreen = screens[activeTab];

  return (
    <AppContext.Provider value={{ drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false) }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActiveScreen />
        </View>
        <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
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
