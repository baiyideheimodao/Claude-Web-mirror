/**
 * 模型管理 API - /api/v1/models
 */
import apiClient from '@/utils/api'
import type { Model } from '@/types/api'

export const modelApi = {
  /** 获取模型列表 */
  getList: () =>
    apiClient.get<Model[]>('/models'),

  /** 切换模型 */
  switchModel: (modelId: string, dialogId?: string) =>
    apiClient.post(`/models/${modelId}/switch`, dialogId ? { dialog_id: dialogId } : {}),
}
