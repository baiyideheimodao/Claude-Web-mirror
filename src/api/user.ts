/**
 * 用户系统 API - /api/v1/user
 */
import apiClient from '@/utils/api'
import type { UserProfile, UserProfileUpdate, Plan, PaymentRecord, Dialog, PaginatedData } from '@/types/api'

export const userApi = {
  /** 获取用户 profile */
  getProfile: () =>
    apiClient.get<UserProfile>('/user/profile'),

  /** 更新用户 profile */
  updateProfile: (data: UserProfileUpdate) =>
    apiClient.put<UserProfile>('/user/profile', data),

  /** 获取可用套餐列表 */
  getPlans: () =>
    apiClient.get<Plan[]>('/user/plans'),

  /** 购买套餐 */
  buyPlan: (planId: number, paymentMethod: string = 'alipay') =>
    apiClient.post(`/user/plans/${planId}/buy`, { payment_method: paymentMethod }),

  /** 使用兑换码 */
  useRedemptionCode: (code: string) =>
    apiClient.post('/user/redemption-codes/use', { code }),

  /** 获取对话历史（30天内，分页） */
  getDialogHistory: (page = 1, size = 20) =>
    apiClient.get<PaginatedData<Dialog>>('/user/dialog-history', { page, size }),

  /** 获取支付记录 */
  getPaymentRecords: () =>
    apiClient.get<PaymentRecord[]>('/user/payment-records'),
}
