import { useAuthContext } from '@/context/AuthContext'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuthContext()
  return isLoggedIn ? children : <Navigate to='/login' replace />
}