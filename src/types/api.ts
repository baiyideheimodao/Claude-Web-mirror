/**
 * API 响应类型定义
 * 遵循 Claude 官网 API 设计规范
 */

/**
 * 通用 API 响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  status?: number
  code?: string
}

/**
 * API 错误接口
 */
export interface ApiError extends Omit<ApiResponse, 'success'> {
  success: false
  message: string
  status: number
  code: string
  errors?: Record<string, string[]>
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
export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * 聊天相关类型
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  updatedAt?: string
  metadata?: Record<string, any>
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  metadata?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
}

export interface ChatRequest {
  message: string
  conversationId?: string
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  attachments?: FileAttachment[]
}

export interface ChatResponse {
  message: string
  conversationId: string
  messageId: string
  createdAt: string
  finishReason?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * 文件上传类型
 */
export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url?: string
  uploadedAt: string
}

export interface UploadResponse {
  fileId: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
  uploadedAt: string
}

/**
 * 用户相关类型
 */
export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  createdAt: string
  updatedAt: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notificationSettings: {
    email: boolean
    push: boolean
    sound: boolean
  }
  editorSettings: {
    fontSize: number
    lineHeight: number
    fontFamily: string
  }
}

/**
 * 认证相关类型
 */
export interface AuthResponse {
  user: UserProfile
  token: string
  expiresAt: string
  refreshToken?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

/**
 * 错误码定义
 */
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 认证错误
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  
  // 聊天错误
  CHAT_NOT_FOUND = 'CHAT_NOT_FOUND',
  MESSAGE_TOO_LONG = 'MESSAGE_TOO_LONG',
  INVALID_MESSAGE_FORMAT = 'INVALID_MESSAGE_FORMAT',
  MODEL_NOT_AVAILABLE = 'MODEL_NOT_AVAILABLE',
  
  // 文件错误
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  
  // 用户错误
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK'
}

/**
 * API 端点定义
 */
export enum ApiEndpoints {
  // 认证
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  LOGOUT = '/auth/logout',
  REFRESH_TOKEN = '/auth/refresh',
  VERIFY_EMAIL = '/auth/verify',
  RESET_PASSWORD = '/auth/reset-password',
  
  // 用户
  GET_PROFILE = '/users/me',
  UPDATE_PROFILE = '/users/me',
  UPDATE_PREFERENCES = '/users/me/preferences',
  
  // 聊天
  CREATE_CHAT = '/chats',
  GET_CHATS = '/chats',
  GET_CHAT = '/chats/:id',
  UPDATE_CHAT = '/chats/:id',
  DELETE_CHAT = '/chats/:id',
  SEND_MESSAGE = '/chats/:id/messages',
  STREAM_MESSAGE = '/chats/:id/messages/stream',
  
  // 文件
  UPLOAD_FILE = '/files/upload',
  GET_FILE = '/files/:id',
  DELETE_FILE = '/files/:id',
  
  // 系统
  HEALTH_CHECK = '/health',
  STATISTICS = '/stats'
}

/**
 * 请求配置类型
 */
export interface RequestConfig {
  timeout?: number
  retry?: boolean
  retryCount?: number
  retryDelay?: number
  showLoading?: boolean
  showError?: boolean
  headers?: Record<string, string>
}