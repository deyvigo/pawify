import { API_URL, authToken } from '../config';

/**
 * Internal helper that performs an HTTP request using the Fetch API.
 * Handles JSON and FormData bodies, parses responses, and throws on non-OK status.
 *
 * @param {string} endpoint - The API endpoint path (appended to the base API_URL).
 * @param {RequestInit} [options={}] - Fetch options including method, headers, and body.
 * @returns {Promise<Object>} The parsed JSON response body, or an empty object if the body is empty.
 * @throws {Error} If the response status is not OK, throws an error with the server message.
 *
 * @example
 * const data = await request('/admin/admins', { method: 'GET', headers: authHeaders() });
 */
async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let message = `Error ${response.status}`;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

/**
 * Builds an authorization header object containing the Bearer token.
 *
 * @returns {Object} An object with the Authorization header if a token exists, or an empty object.
 *
 * @example
 * const headers = authHeaders();
 * // Returns: { Authorization: "Bearer <token>" } or {}
 */
function authHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

/**
 * Serializes a request body to the appropriate format.
 * Returns FormData as-is, or JSON-stringifies plain objects.
 *
 * @param {FormData|Object} body - The request body to serialize.
 * @returns {FormData|string} The serialized body ready for fetch.
 *
 * @example
 * const serialized = serializeBody({ username: 'admin' });
 * // Returns: '{"username":"admin"}'
 */
function serializeBody(body) {
  return body instanceof FormData ? body : JSON.stringify(body);
}

/**
 * Pre-configured API client object with methods for common HTTP operations.
 * All methods automatically include authorization headers and handle serialization.
 *
 * @type {Object}
 * @property {function(string): Promise<Object>} get - Performs a GET request to the specified endpoint.
 * @property {function(string, (Object|FormData)): Promise<Object>} post - Performs a POST request with a body.
 * @property {function(string, (Object|FormData)): Promise<Object>} put - Performs a PUT request with a body.
 * @property {function(string, (Object|FormData|undefined)): Promise<Object>} patch - Performs a PATCH request with an optional body.
 * @property {function(string): Promise<Object>} delete - Performs a DELETE request to the specified endpoint.
 *
 * @example
 * // GET request
 * const admins = await api.get('/admin/admins?page=0&size=5');
 *
 * // POST request
 * const newAdmin = await api.post('/auth/register/admin', { username: 'admin1' });
 *
 * // DELETE request
 * await api.delete('/admin/admins/1');
 */
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET', headers: authHeaders() }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: serializeBody(body), headers: authHeaders() }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: serializeBody(body), headers: authHeaders() }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: body ? serializeBody(body) : undefined, headers: authHeaders() }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE', headers: authHeaders() }),
};
