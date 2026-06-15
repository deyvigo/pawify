import Constants from "expo-constants";
import { UserPayload } from "../types";
import { decodeToken } from "../utils/jwt";
import { getToken, saveToken, deleteToken } from "../services/storageService";

const { API_BASE_URL, AUTH_TOKEN } = Constants.expoConfig?.extra || {};

export const API_URL =
  process.env.API_BASE_URL || API_BASE_URL || "http://192.168.0.200:8080";
export let authToken: string | null = AUTH_TOKEN || null;

export async function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    await saveToken(token);
  } else {
    await deleteToken();
  }
}

export async function loadAuthToken(): Promise<string | null> {
  try {
    const storedToken = await getToken();
    if (storedToken) {
      authToken = storedToken;
    }
    return authToken;
  } catch (error) {
    console.error("Error loading auth token:", error);
    return null;
  }
}

export function getAuthUser(): UserPayload | null {
  if (!authToken) return null;
  return decodeToken(authToken);
}
