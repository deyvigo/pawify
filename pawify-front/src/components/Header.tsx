import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { MenuIcon } from "./icons/MenuIcon";

interface HeaderProps {
  onActionPress: () => void;
  variant?: "catalog" | "detail";
}

export const Header: React.FC<HeaderProps> = ({ onActionPress, variant = "catalog" }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onActionPress} style={styles.actionButton}>
        {variant === "catalog" ? (
          <MenuIcon color={colors.black} size={28} />
        ) : (
          <Ionicons name="arrow-back" size={28} color={colors.black} />
        )}
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} source={require("../../assets/logopawify.png")} />
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
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
});
