/**
 * 对话管理 API - /api/v1/dialogs
 */
import apiClient from '@/utils/api'
import type { Dialog, DialogListResponse, DialogDetail, Message, MessageBranch } from '@/types/api'

export const dialogApi = {
  /** 获取对话列表（按时间分组） */
  getList: () =>
    apiClient.get<DialogListResponse>('/dialogs'),

  /** 新建对话 */
  create: (title?: string) =>
    apiClient.post<Dialog>('/dialogs', title ? { title } : {}),

  /** 获取对话详情（含消息） */
  getDetail: (dialogId: string) =>
    apiClient.get<DialogDetail>(`/dialogs/${dialogId}`),

  /** 重命名对话 */
  rename: (dialogId: string, title: string) =>
    apiClient.put(`/dialogs/${dialogId}`, { title }),

  /** 删除对话 */
  delete: (dialogId: string) =>
    apiClient.delete(`/dialogs/${dialogId}`),

  /** 发送消息 */
  sendMessage: (dialogId: string, content: string, files?: string[], artifactType?: string) =>
    apiClient.post<Message>(`/dialogs/${dialogId}/messages`, { content, files, artifact_type: artifactType }),

  /** 编辑已发送消息 */
  editMessage: (dialogId: string, messageId: string, content: string) =>
    apiClient.put(`/dialogs/${dialogId}/messages/${messageId}`, { content }),

  /** 重新生成AI回复 */
  regenerateMessage: (dialogId: string, messageId: string) =>
    apiClient.post<Message>(`/dialogs/${dialogId}/messages/${messageId}/regenerate`, {}),

  /** 获取消息分支版本 */
  getMessageBranches: (dialogId: string, messageId: string) =>
    apiClient.get<MessageBranch[]>(`/dialogs/${dialogId}/messages/${messageId}/branch`),
}
