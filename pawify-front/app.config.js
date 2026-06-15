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
      bundleIdentifier: "com.pawify.app", 
      supportsTablet: true,
      "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    }
    },
    android: {
      package: "com.pawify.app",
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
      API_BASE_URL: process.env.API_BASE_URL,
      eas: {
        projectId: "c4f74a0f-26a7-4626-864b-513d8078dfd6",
      },
    },
  },
};