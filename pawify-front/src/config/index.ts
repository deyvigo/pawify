import Constants from "expo-constants";

const { API_BASE_URL, AUTH_TOKEN } = Constants.expoConfig?.extra || {};

export const API_URL = API_BASE_URL || "https://pawify-g5fb.onrender.com";
export let authToken: string | null = AUTH_TOKEN || null;

export function setAuthToken(token: string | null) {
  authToken = token;
}
