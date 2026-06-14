export interface IUser {
  id: number
  username: string
  first_name: string
  last_name: string
  dni_number: string
  created_at: string
}

export interface IUserChangePassword {
  current_password: string
  new_password: string
  confirm_new_password: string
}

export interface IGetAdminsParams {
  search?: string
  page?: number
  size?: number
  sort?: string
}

export interface IUserMessage {
  id: number
  username: string
  first_name: string
  last_name: string
}
