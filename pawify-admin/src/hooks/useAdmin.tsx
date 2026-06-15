import type { IErrorResponse } from '@/models/error.model'
import type { IUserChangePassword, IGetAdminsParams } from '@/models/user.model'
import { changePassword, getAdmins, getMyInfo } from '@/services/adminService'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export const useAdmin = (adminsParams?: IGetAdminsParams) => {
  const { data: adminInfo, isLoading, isError } = useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: () => getMyInfo(),
    staleTime: 30_000,
  })

  const { data: adminsPage, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admin', 'admins', adminsParams],
    queryFn: () => getAdmins(adminsParams!),
    staleTime: 30_000,
  })

  const updatePasswordMutation = useMutation<
    void,
    AxiosError<IErrorResponse>,
    IUserChangePassword
  >({
    mutationFn: changePassword,
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return {
    adminInfo, isLoading, isError, updatePasswordMutation,
    adminsPage, isLoadingAdmins
  }
}