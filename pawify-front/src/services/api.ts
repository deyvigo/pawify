import { API_URL, authToken } from "../config";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`Request: ${options.method} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  console.log(`Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status !== 401) {
      console.error(`API Error ${response.status}:`, errorText);
    }
    throw new Error(`API Error: ${response.status}`);
  }

  const textResponse = await response.text();

  // Si hay texto, lo convertimos a JSON. Si está vacío, devolvemos un objeto vacío.
  return textResponse ? JSON.parse(textResponse) : {};
}

export const api = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "GET",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),

    post: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),

    patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),
};

export default api;
