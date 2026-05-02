export default {
  expo: {
    name: "pawify-front",
    slug: "pawify-front",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-secure-store"],
    extra: {
      API_BASE_URL: process.env.API_BASE_URL || "https://pawify-g5fb.onrender.com",
      AUTH_TOKEN: process.env.AUTH_TOKEN || "",
    },
  },
};