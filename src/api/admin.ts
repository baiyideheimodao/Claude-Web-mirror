/**
 * 后台管理 API - /api/v1/admin
 */
import apiClient from '@/utils/api'
import type { AdminUser, Plan, StatItem, PaginatedData } from '@/types/api'

export interface CreatePlanData {
  name: string
  description: string
  duration_days: number
  hourly_limit: number
  daily_limit: number
  price: number
}

export interface GenerateCodesData {
  plan_id: number
  count: number
  expires_at: string
}

export const adminApi = {
  /** 获取用户列表（分页） */
  getUsers: (page = 1, size = 20, keyword?: string) =>
    apiClient.get<PaginatedData<AdminUser>>('/admin/users', { page, size, keyword }),

  /** 禁用/启用用户 */
  toggleUserStatus: (userId: string, isActive: boolean) =>
    apiClient.put(`/admin/users/${userId}`, { is_active: isActive }),

  /** 创建套餐 */
  createPlan: (data: CreatePlanData) =>
    apiClient.post<Plan>('/admin/plans', data),

  /** 批量生成兑换码 */
  generateRedemptionCodes: (data: GenerateCodesData) =>
    apiClient.post<{ codes: string[] }>('/admin/redemption-codes/generate', data),

  /** 获取统计信息 */
  getStats: (type: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string) =>
    apiClient.get<StatItem[]>('/admin/stats', {
      type,
      start_date: startDate,
      end_date: endDate
    }),
}
