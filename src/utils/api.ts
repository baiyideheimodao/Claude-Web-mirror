import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'

/**
 * Claude Mirror API 客户端
 * 对接后端 Node.js 服务 - /api/v1
 */
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('claude-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        config.headers['x-request-id'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('claude-token')
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        return Promise.reject(error)
      }
    )
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.request(config)
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: 'OK'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || '请求失败',
        status: error.response?.status || 0,
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      }
    }
  }

  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request({ method: 'GET', url, params })
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request({ method: 'POST', url, data })
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request({ method: 'PUT', url, data })
  }

  async delete<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request({ method: 'DELETE', url, params })
  }

  setToken(token: string): void {
    localStorage.setItem('claude-token', token)
  }

  clearToken(): void {
    localStorage.removeItem('claude-token')
  }

  getToken(): string | null {
    return localStorage.getItem('claude-token')
  }
}

const apiClient = new ApiClient()

export default apiClient
export { ApiClient }
