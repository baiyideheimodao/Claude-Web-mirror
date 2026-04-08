/**
 * 编程Agent API - /api/v1/agent
 */
import apiClient from '@/utils/api'
import type {
  CodeGenerateRequest,
  CodeGenerateResponse,
  CodeDebugRequest,
  CodeDebugResponse,
  ProjectCreateRequest,
  ProjectSkeletonResponse
} from '@/types/api'

export const agentApi = {
  /** 生成代码 */
  generateCode: (data: CodeGenerateRequest) =>
    apiClient.post<CodeGenerateResponse>('/agent/code/generate', data),

  /** Bug分析与修复 */
  debugCode: (data: CodeDebugRequest) =>
    apiClient.post<CodeDebugResponse>('/agent/code/debug', data),

  /** 生成项目骨架 */
  createProject: (data: ProjectCreateRequest) =>
    apiClient.post<ProjectSkeletonResponse>('/agent/project/create', data),
}
