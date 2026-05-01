import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface HeaderProps {
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <View style={styles.hamburgerLine} />
        <View style={[styles.hamburgerLine, styles.middleLine]} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🐾</Text>
        <Text style={styles.appName}>Pawify</Text>
      </View>
      <View style={styles.menuButton} />
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
    paddingVertical: 20,
    backgroundColor: colors.white,
  },
  menuButton: {
    width: 32,
    height: 24,
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
