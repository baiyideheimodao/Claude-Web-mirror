/**
 * 文件上传 API - /api/v1/files
 */
import apiClient from '@/utils/api'
import type { UploadedFile } from '@/types/api'

export const fileApi = {
  /** 上传文件 */
  upload: (file: File, dialogId?: string): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    if (dialogId) formData.append('dialog_id', dialogId)
    return apiClient.request<UploadedFile>({
      method: 'POST',
      url: '/files/upload',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}
