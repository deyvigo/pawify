import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_BASE_URL
export const WS_URL = import.meta.env.VITE_WS_BASE_URL

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const axiosAuthenticated = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosAuthenticated.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
