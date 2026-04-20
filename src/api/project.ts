/**
 * Projects API - /api/v1/projects
 */
import apiClient from '@/utils/api'
import type { Project, ProjectCreateRequest } from '@/types/api'

export const projectApi = {
  /** 创建项目 */
  create: (data: ProjectCreateRequest) =>
    apiClient.post<Project>('/projects', data),

  /** 获取项目列表 */
  getList: () =>
    apiClient.get<Project[]>('/projects'),

  /** 将对话加入项目 */
  addDialog: (projectId: string, dialogId: string) =>
    apiClient.post(`/projects/${projectId}/dialogs`, { dialog_id: dialogId }),

  /** 上传知识库文件 */
  uploadKnowledgeBase: (projectId: string, file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.request({
      method: 'POST',
      url: `/projects/${projectId}/knowledge-base`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  /** 设置项目级System Prompt */
  setSystemPrompt: (projectId: string, systemPrompt: string) =>
    apiClient.put(`/projects/${projectId}/system-prompt`, { system_prompt: systemPrompt }),
}
