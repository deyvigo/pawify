import { API_URL, authToken } from "../config";

/**
 * Sends an HTTP request to the backend API and parses the JSON response.
 *
 * @template T - Expected response type.
 * @param endpoint - API path to call (appended to the base API_URL).
 * @param options - Standard fetch RequestInit options (method, body, headers, etc.).
 * @returns A promise that resolves to the parsed JSON response of type T.
 * @throws {Error} An error with the HTTP status code if the response is not OK.
 */
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

/**
 * Pre-configured HTTP client for communicating with the Pawify REST API.
 *
 * All methods automatically attach the Bearer token when one is available.
 */
export const api = {
  /**
   * Sends a GET request to the specified endpoint.
   *
   * @template T - Expected response type.
   * @param endpoint - API path to call.
   * @returns A promise that resolves to the parsed JSON response of type T.
   */
  get: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "GET",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),

  /**
   * Sends a POST request with a JSON body to the specified endpoint.
   *
   * @template T - Expected response type.
   * @param endpoint - API path to call.
   * @param body - Request body to be JSON-serialized.
   * @returns A promise that resolves to the parsed JSON response of type T.
   */
    post: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),

  /**
   * Sends a PATCH request with an optional JSON body to the specified endpoint.
   *
   * @template T - Expected response type.
   * @param endpoint - API path to call.
   * @param body - Optional request body to be JSON-serialized.
   * @returns A promise that resolves to the parsed JSON response of type T.
   */
    patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),
};

export default api;
