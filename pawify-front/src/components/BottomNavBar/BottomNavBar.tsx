import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { useAppContext } from "../../context/AppContext";
import { CatalogIcon } from "../icons/CatalogIcon";
import { PurchaseIcon } from "../icons/PurchaseIcon";
import { OrdersIcon } from "../icons/OrdersIcon";
import { AccountIcon } from "../icons/AccountIcon";

type TabKey = "catalog" | "purchase" | "orders" | "account";

interface TabConfig {
  key: TabKey;
  icon: React.FC<{ color: string; size: number }>;
  label: string;
}

const tabs: TabConfig[] = [
  { key: "catalog", icon: CatalogIcon, label: "Catálogo" },
  { key: "purchase", icon: PurchaseIcon, label: "Compra" },
  { key: "orders", icon: OrdersIcon, label: "Pedidos" },
  { key: "account", icon: AccountIcon, label: "Cuenta" },
];

interface BottomNavBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { cartCount } = useAppContext();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.tabInner,
              activeTab === tab.key && styles.activeTabInner,
            ]}
          >
            <View style={styles.iconContainer}>
              <tab.icon
                color={activeTab === tab.key ? colors.primary : colors.gray}
                size={24}
              />
              {tab.key === "purchase" && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                activeTab === tab.key && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 30,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  tabInner: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  activeTabInner: {
    backgroundColor: "#FFE4E4",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.gray,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: "600",
  },
});
