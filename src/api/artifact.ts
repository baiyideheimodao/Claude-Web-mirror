/**
 * Artifacts API - /api/v1/artifacts
 */
import apiClient from '@/utils/api'
import type { Artifact, ArtifactCreateRequest } from '@/types/api'

export const artifactApi = {
  /** 创建Artifact */
  create: (data: ArtifactCreateRequest) =>
    apiClient.post<Artifact>('/artifacts', data),

  /** 渲染Artifact（返回HTML/SVG） */
  render: (artifactId: string) =>
    apiClient.get(`/artifacts/${artifactId}/render`),
}
