export interface ILoginResponse {
  token: string
  refresh_token: string
}

export interface ILoginRequest {
  username: string
  password: string
}