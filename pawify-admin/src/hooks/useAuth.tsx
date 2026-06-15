import { useAuthContext } from '@/context/AuthContext'
import type { IErrorResponse } from '@/models/error.model'
import type { ILoginRequest, ILoginResponse } from '@/models/login.model'
import { login } from '@/services/authService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { login: loginHook, logout: logoutHook } = useAuthContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const loginMutation = useMutation<ILoginResponse, AxiosError<IErrorResponse>, ILoginRequest>({
    mutationFn: login,
    onSuccess: data => {
      loginHook(data.token)
      queryClient.clear()
      navigate('/')
    },
    onError: error => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        console.log(error)
      }
    },
  })

  const logoutMutation = () => {
    logoutHook()
    queryClient.clear()
    navigate('/')
  }

  return { loginMutation, logoutMutation }
}
