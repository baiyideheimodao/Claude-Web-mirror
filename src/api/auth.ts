/**
 * 认证授权 API - /api/v1/auth
 */
import apiClient from '@/utils/api'
import type { AuthUser, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/api'

export const authApi = {
  /** 用户注册 */
  register: (data: RegisterRequest) =>
    apiClient.post<AuthUser>('/auth/register', data),

  /** 用户登录 */
  login: (data: LoginRequest) =>
    apiClient.post<AuthUser>('/auth/login', data),

  /** 忘记密码 */
  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post('/auth/forgot-password', data),

  /** 重置密码 */
  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post('/auth/reset-password', data),
}
