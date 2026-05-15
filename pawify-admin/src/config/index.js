export const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://pawify-g5fb.onrender.com';

export let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('AuthToken', token);
  } else {
    localStorage.removeItem('AuthToken');
  }
}

export function loadAuthToken() {
  const stored = localStorage.getItem('AuthToken');
  if (stored) authToken = stored;
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('AuthToken');
}
