import { API_URL, authToken } from "../config";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const textResponse = await response.text();
  
  // Si hay texto, lo convertimos a JSON. Si está vacío, devolvemos un objeto vacío.
  return textResponse ? JSON.parse(textResponse) : {};
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: "GET",
      headers: token || authToken ? { Authorization: `Bearer ${token || authToken}` } : {},
    }),

    post: <T>(endpoint: string, body: any, token?: string) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: token || authToken ? { Authorization: `Bearer ${token || authToken}` } : {},
    }),
};

export default api;
