import { API_URL, authToken } from '../config';

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

function authHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function serializeBody(body) {
  return body instanceof FormData ? body : JSON.stringify(body);
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET', headers: authHeaders() }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: serializeBody(body), headers: authHeaders() }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: serializeBody(body), headers: authHeaders() }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: body ? serializeBody(body) : undefined, headers: authHeaders() }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE', headers: authHeaders() }),
};
