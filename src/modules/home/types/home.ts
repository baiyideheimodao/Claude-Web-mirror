/**
 * 首页模块类型定义
 */

/**
 * 特性卡片
 */
export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  category: string
  popularity: number // 0-100
  tags?: string[]
  link?: string
  color?: string
  sortOrder?: number
}

/**
 * 使用示例
 */
export interface Example {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  usageCount?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * 首页统计数据
 */
export interface HomeStats {
  totalUsers: number
  totalConversations: number
  totalMessages: number
  activeUsersToday: number
  popularCategories: string[]
  averageResponseTime: number
}

/**
 * 用户反馈
 */
export interface UserFeedback {
  id: string
  userId: string
  featureId: string
  rating: number // 1-5
  comment?: string
  createdAt: string
}

/**
 * 首页配置
 */
export interface HomeConfig {
  showHero: boolean
  showFeatures: boolean
  showExamples: boolean
  showStats: boolean
  maxFeatures: number
  maxExamples: number
  layout: 'grid' | 'list' | 'carousel'
  theme: 'light' | 'dark' | 'auto'
}

/**
 * 搜索参数
 */
export interface SearchParams {
  query: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  sortBy?: 'popularity' | 'recent' | 'alphabetical'
  limit?: number
  offset?: number
}

/**
 * 搜索结果
 */
export interface SearchResults<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/**
 * 特性分类
 */
export interface FeatureCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  featureCount: number
  sortOrder: number
}

/**
 * 示例类别
 */
export interface ExampleCategory {
  id: string
  name: string
  description: string
  icon: string
  exampleCount: number
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * 首页 API 响应
 */
export interface HomeApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
  requestId: string
}

/**
 * 错误响应
 */
export interface HomeErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
  timestamp: string
  requestId: string
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  enabled: boolean
  ttl: number // 生存时间（毫秒）
  key: string
}

/**
 * 加载状态
 */
export interface LoadingState {
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

/**
 * 特性过滤器
 */
export interface FeatureFilter {
  categories?: string[]
  minPopularity?: number
  tags?: string[]
  search?: string
  sortBy?: 'popularity' | 'name' | 'category'
}

/**
 * 示例过滤器
 */
export interface ExampleFilter {
  categories?: string[]
  difficulties?: ('easy' | 'medium' | 'hard')[]
  tags?: string[]
  search?: string
  sortBy?: 'usage' | 'difficulty' | 'name'
}

// 这个文件已经导出了所有接口，不需要重复导出