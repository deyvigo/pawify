import type { IUser } from '@/models/user.model'
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useState } from 'react'

interface AuthContextProps {
  token: string | null
  login: (newToken: string) => void
  logout: () => void
  isLoggedIn: boolean
  user: IUser | null
}

const AuthContext = createContext<AuthContextProps | null>(null)

const decodeToken = (token: string | null) => {
  if (!token) return null
  try {
    return jwtDecode<IUser>(token)
  } catch (error) {
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  )
  const [user, setUser] = useState<IUser | null>(() => decodeToken(token))

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser(decodeToken(newToken))
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}