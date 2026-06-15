import type { IUser, IUserChangePassword, IGetAdminsParams } from '@/models/user.model'
import type { IPage } from '@/models/page.model'
import { axiosAuthenticated } from '@/services/api'

export const getMyInfo = async () => {
  const response = await axiosAuthenticated.get<IUser>('/admin/profile')
  return response.data
}

export const changePassword = async (payload: IUserChangePassword) => {
  const response = await axiosAuthenticated.post(
    '/user/password',
    payload
  )
  return response.data
}

export const getAdmins = async (params?: IGetAdminsParams) => {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      )
    : undefined
  const response = await axiosAuthenticated.get<IPage<IUser>>(
    '/admin/admins',
    { params: cleanParams }
  )
  return response.data
}