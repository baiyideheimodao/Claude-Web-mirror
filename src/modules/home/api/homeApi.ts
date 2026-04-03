import apiClient from '@/utils/api'
import type {
  Feature,
  Example,
  HomeStats,
  HomeApiResponse,
  PaginationParams,
  FeatureFilter,
  ExampleFilter
} from '../types/home'

/**
 * 首页 API 服务
 * 遵循 Claude 官网 API 设计规范
 */

const API_PREFIX = '/home'

/**
 * 获取特性列表
 */
export async function getFeatures(
  params?: PaginationParams & FeatureFilter
): Promise<HomeApiResponse<Feature[]>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/features`, params)
    
    if (response.success) {
      return {
        success: true,
        data: response.data as Feature[],
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: [],
      message: response.message || '获取特性列表失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error('获取特性列表失败:', error)
    return {
      success: false,
      data: [],
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 获取特性详情
 */
export async function getFeatureById(id: string): Promise<HomeApiResponse<Feature>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/features/${id}`)
    
    if (response.success) {
      return {
        success: true,
        data: response.data as Feature,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: {} as Feature,
      message: response.message || '获取特性详情失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error(`获取特性详情失败 (ID: ${id}):`, error)
    return {
      success: false,
      data: {} as Feature,
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 获取示例列表
 */
export async function getExamples(
  params?: PaginationParams & ExampleFilter
): Promise<HomeApiResponse<Example[]>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/examples`, params)
    
    if (response.success) {
      return {
        success: true,
        data: response.data as Example[],
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: [],
      message: response.message || '获取示例列表失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error('获取示例列表失败:', error)
    return {
      success: false,
      data: [],
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 获取示例详情
 */
export async function getExampleById(id: string): Promise<HomeApiResponse<Example>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/examples/${id}`)
    
    if (response.success) {
      return {
        success: true,
        data: response.data as Example,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: {} as Example,
      message: response.message || '获取示例详情失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error(`获取示例详情失败 (ID: ${id}):`, error)
    return {
      success: false,
      data: {} as Example,
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 获取首页统计数据
 */
export async function getHomeStats(): Promise<HomeApiResponse<HomeStats>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/stats`)
    
    if (response.success) {
      return {
        success: true,
        data: response.data as HomeStats,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    // 如果 API 不可用，返回模拟数据
    return {
      success: true,
      data: {
        totalUsers: 1000000,
        totalConversations: 5000000,
        totalMessages: 25000000,
        activeUsersToday: 50000,
        popularCategories: ['writing', 'coding', 'analysis'],
        averageResponseTime: 2.5
      },
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error('获取首页统计数据失败:', error)
    
    // 返回模拟数据
    return {
      success: true,
      data: {
        totalUsers: 1000000,
        totalConversations: 5000000,
        totalMessages: 25000000,
        activeUsersToday: 50000,
        popularCategories: ['writing', 'coding', 'analysis'],
        averageResponseTime: 2.5
      },
      message: '使用模拟数据',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 提交用户反馈
 */
export async function submitFeedback(
  featureId: string,
  rating: number,
  comment?: string
): Promise<HomeApiResponse<{ id: string }>> {
  try {
    const response = await apiClient.post(`${API_PREFIX}/feedback`, {
      featureId,
      rating,
      comment
    })
    
    if (response.success) {
      return {
        success: true,
        data: { id: response.data.id },
        message: '反馈提交成功',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: { id: '' },
      message: response.message || '反馈提交失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
    return {
      success: false,
      data: { id: '' },
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 搜索特性和示例
 */
export async function searchHomeContent(
  query: string,
  category?: string
): Promise<HomeApiResponse<{
  features: Feature[]
  examples: Example[]
}>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/search`, {
      query,
      category
    })
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: { features: [], examples: [] },
      message: response.message || '搜索失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error('搜索失败:', error)
    return {
      success: false,
      data: { features: [], examples: [] },
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}

/**
 * 获取热门特性
 */
export async function getPopularFeatures(limit: number = 3): Promise<HomeApiResponse<Feature[]>> {
  try {
    const response = await apiClient.get(`${API_PREFIX}/features/popular`, { limit })
    
    if (response.success) {
      return {
        success: true,
        data: response.data as Feature[],
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    // 如果 API 不可用，返回模拟数据
    return getFeatures({ limit, sortBy: 'popularity' })
  } catch (error) {
    console.error('获取热门特性失败:', error)
    return getFeatures({ limit, sortBy: 'popularity' })
  }
}

/**
 * 获取推荐示例
 */
export async function getRecommendedExamples(
  userId?: string,
  limit: number = 4
): Promise<HomeApiResponse<Example[]>> {
  try {
    const params: any = { limit }
    if (userId) {
      params.userId = userId
    }
    
    const response = await apiClient.get(`${API_PREFIX}/examples/recommended`, params)
    
    if (response.success) {
      return {
        success: true,
        data: response.data as Example[],
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    // 如果 API 不可用，返回模拟数据
    return getExamples({ limit })
  } catch (error) {
    console.error('获取推荐示例失败:', error)
    return getExamples({ limit })
  }
}

/**
 * 记录示例使用情况
 */
export async function recordExampleUsage(
  exampleId: string,
  userId?: string
): Promise<HomeApiResponse<{ success: boolean }>> {
  try {
    const response = await apiClient.post(`${API_PREFIX}/examples/${exampleId}/usage`, {
      userId,
      timestamp: new Date().toISOString()
    })
    
    if (response.success) {
      return {
        success: true,
        data: { success: true },
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }
    
    return {
      success: false,
      data: { success: false },
      message: response.message || '记录使用情况失败',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  } catch (error) {
    console.error('记录示例使用情况失败:', error)
    return {
      success: false,
      data: { success: false },
      message: '网络错误，请稍后重试',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`
    }
  }
}