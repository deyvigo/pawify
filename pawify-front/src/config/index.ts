import Constants from "expo-constants";
import { UserPayload } from "../types";
import { decodeToken } from "../utils/jwt";
import { getToken, saveToken, deleteToken } from "../services/storageService";

const { API_BASE_URL, AUTH_TOKEN } = Constants.expoConfig?.extra || {};

export const API_URL = process.env.API_BASE_URL || API_BASE_URL || "https://pawify-g5fb.onrender.com";
export let authToken: string | null = process.env.AUTH_TOKEN || AUTH_TOKEN || null;

export async function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    await saveToken(token);
  } else {
    await deleteToken();
  }
}

export async function loadAuthToken(): Promise<string | null> {
  const storedToken = await getToken();
  if (storedToken) {
    authToken = storedToken;
  }
  return authToken;
}

export function getAuthUser(): UserPayload | null {
  if (!authToken) return null;
  return decodeToken(authToken);
}