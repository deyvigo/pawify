import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onActionPress: () => void;
  variant?: "catalog" | "detail";
}

export const Header: React.FC<HeaderProps> = ({ onActionPress, variant = "catalog" }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onActionPress} style={styles.actionButton}>
        {variant === "catalog" ? (
          <View style={styles.hamburgerContainer}>
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, styles.middleLine]} />
            <View style={styles.hamburgerLine} />
          </View>
        ) : (
          <Ionicons name="arrow-back" size={28} color={colors.black} />
        )}
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🐾</Text>
        <Text style={styles.appName}>Pawify</Text>
      </View>
      
      <View style={styles.actionButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  hamburgerContainer: {
    width: 28,
    height: 20,
    justifyContent: "center",
    gap: 5,
  },
  hamburgerLine: {
    width: "100%",
    height: 3,
    backgroundColor: colors.black,
    borderRadius: 2,
  },
  middleLine: {
    width: "75%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoEmoji: {
    fontSize: 24,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
});
