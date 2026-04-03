import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse, ApiError } from '@/types/api'

/**
 * Claude API 客户端
 * 遵循 Claude 官网 API 设计规范
 */
class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'https://api.claude.ai'
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30秒超时
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证头
        const token = localStorage.getItem('claude-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // 添加 API 密钥
        const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
        if (apiKey && apiKey !== 'sk-ant-your-api-key-here') {
          config.headers['x-api-key'] = apiKey
        }
        
        // 添加请求标识
        config.headers['x-request-id'] = this.generateRequestId()
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 处理错误响应
   */
  private handleError(error: any): void {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      const errorMessage = data?.message || `请求失败，状态码：${status}`
      
      console.error(`API Error [${status}]:`, errorMessage)
      
      // 特殊错误处理
      switch (status) {
        case 401:
          // 未授权，清除本地 token
          localStorage.removeItem('claude-token')
          // TODO: 触发登出事件
          break
        case 403:
          // 禁止访问
          console.warn('访问被拒绝，请检查权限')
          break
        case 429:
          // 请求过多
          console.warn('请求过于频繁，请稍后重试')
          break
        case 500:
          // 服务器内部错误
          console.error('服务器内部错误，请稍后重试')
          break
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误：无法连接到服务器')
    } else {
      // 请求配置出错
      console.error('请求配置错误：', error.message)
    }
  }

  /**
   * 通用请求方法
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.request(config)
      
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: '请求成功'
      }
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.response?.data?.message || error.message || '请求失败',
        status: error.response?.status || 0,
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      }
      
      return apiError
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params
    })
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data
    })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data
    })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params
    })
  }

  /**
   * 上传文件
   */
  async upload<T = any>(url: string, file: File, fieldName = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append(fieldName, file)
    
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /**
   * 设置认证令牌
   */
  setToken(token: string): void {
    localStorage.setItem('claude-token', token)
  }

  /**
   * 清除认证令牌
   */
  clearToken(): void {
    localStorage.removeItem('claude-token')
  }

  /**
   * 获取当前令牌
   */
  getToken(): string | null {
    return localStorage.getItem('claude-token')
  }
}

// 创建默认 API 客户端实例
const apiClient = new ApiClient()

// 导出默认实例和类
export default apiClient
export { ApiClient }