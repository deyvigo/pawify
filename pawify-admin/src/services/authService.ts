import type { ILoginRequest, ILoginResponse } from '@/models/login.model'
import { axiosPublic } from '@/services/api'

export const login = async ({ username, password }: ILoginRequest) => {
  const response = await axiosPublic.post<ILoginResponse>(
    "/auth/login",
    {
      username,
      password,
    },
  )
  return response.data
}