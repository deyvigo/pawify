import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

type TabKey = "catalog" | "purchase" | "orders" | "account";

interface TabConfig {
  key: TabKey;
  icon: string;
  label: string;
}

const tabs: TabConfig[] = [
  { key: "catalog", icon: "🛍️", label: "Catálogo" },
  { key: "purchase", icon: "🛒", label: "Compra" },
  { key: "orders", icon: "📦", label: "Pedidos" },
  { key: "account", icon: "👤", label: "Cuenta" },
];

interface BottomNavBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
}) => {
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
            <Text
              style={[styles.icon, activeTab === tab.key && styles.activeIcon]}
            >
              {tab.icon}
            </Text>
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
  icon: {
    fontSize: 22,
    color: colors.gray,
  },
  activeIcon: {
    color: colors.primary,
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
