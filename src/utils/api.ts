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

  /**
   * 流式 POST（SSE / fetch 原生 ReadableStream）
   * @returns AsyncGenerator 逐块 yield Server-Sent Event data
   */
  async *streamPost(url: string, data?: any): AsyncGenerator<any> {
    const token = localStorage.getItem('claude-token')
    // 统一走 Vite 代理 (/api/* → localhost:3001)，避免跨域和端口不匹配问题
    const fullUrl = `/api/v1${url}`

    console.log('[FRONTEND stream] POST', fullUrl)
    console.log('[FRONTEND stream] data:', JSON.stringify(data)?.substring(0, 100))

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify(data)
    })

    console.log('[FRONTEND stream] response status:', response.status, 'ok:', response.ok)
    console.log('[FRONTEND stream] content-type:', response.headers.get('content-type'))

    if (!response.ok) {
      const errBody = await response.text()
      console.error('[FRONTEND stream] ERROR body:', errBody)
      throw new Error(`Stream error ${response.status}: ${errBody}`)
    }

    if (!response.body) {
      console.error('[FRONTEND stream] response.body is null! No ReadableStream available')
      throw new Error('No response body (ReadableStream not supported)')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let eventCount = 0
    const t0 = performance.now()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        console.log(`[FRONTEND stream] ReadableStream DONE at +${Math.round(performance.now() - t0)}ms, total events: ${eventCount}`)
        break
      }
      const rawText = decoder.decode(value, { stream: true })
      buffer += rawText
      console.log(`[FRONTEND stream] raw chunk #${eventCount + 1} (${value.length} bytes) at +${Math.round(performance.now() - t0)}ms:`, rawText.substring(0, 200))

      // 按双换行分割 SSE 事件
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue
        let event = 'message'
        let dataStr = ''
        for (const part of line.split('\n')) {
          if (part.startsWith('event:')) event = part.slice(6).trim()
          if (part.startsWith('data:')) dataStr = part.slice(5).trim()
        }
        if (dataStr) {
          try {
            const parsed = JSON.parse(dataStr)
            eventCount++
            console.log(`[FRONTEND stream] event #${eventCount} type=${event}:`, dataStr.substring(0, 150))
            yield { ...parsed, type: event }
          } catch (parseErr) {
            console.warn(`[FRONTEND stream] JSON parse error for:`, dataStr.substring(0, 100))
            yield { raw: dataStr }
          }
        }
      }
    }

    console.log('[FRONTEND stream] generator finished normally, yielded', eventCount, 'events')
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
