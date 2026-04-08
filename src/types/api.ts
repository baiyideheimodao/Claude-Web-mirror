/**
 * 后端API类型定义 - 对应 api.yml 规范
 */

// ============ 通用响应 ============

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  status?: number
  code?: string
}

export interface PaginatedData<T> {
  total: number
  items: T[]
}

// ============ 认证相关 ============

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  avatar: string | null
  created_at: string
  updated_at: string
  last_login: string | null
  is_active: boolean
  email_verified: boolean
  token?: string // 登录后返回的JWT
}

// ============ 用户相关 ============

export interface UserProfile {
  username: string
  email: string
  avatar: string | null
  theme: 'light' | 'dark'
  font_size: 'small' | 'medium' | 'large'
}

export interface UserProfileUpdate {
  username?: string
  avatar?: string | null
  theme?: 'light' | 'dark'
  font_size?: 'small' | 'medium' | 'large'
}

export interface Plan {
  id: number
  name: string
  description: string
  duration_days: number
  hourly_limit: number
  daily_limit: number
  price: number
  created_at: string
}

export interface PaymentRecord {
  id: number
  user_id: string
  plan_id: number
  amount: number
  payment_method: string
  transaction_id: string
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

// ============ 对话/消息相关 ============

export interface Dialog {
  id: string
  title: string
  created_at: string
  updated_at: string
  last_message_at: string
  is_pinned: boolean
  group_date: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days'
}

export interface DialogListResponse {
  today: Dialog[]
  yesterday: Dialog[]
  last_7_days: Dialog[]
  last_30_days: Dialog[]
}

export interface MessageFile {
  id: string
  filename: string
  file_path: string
  file_type: 'image' | 'document'
  size: number
  uploaded_at: string
  preview_url: string | null
}

export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
  status: 'sending' | 'sent' | 'failed'
  parent_id: string | null
  version: number
  files?: MessageFile[]
}

export interface DialogDetail {
  id: string
  title: string
  messages: Message[]
}

export interface MessageBranch {
  id: string
  message_id: string
  content: string
  version: number
  created_at: string
}

// ============ 文件与Artifacts ============

export interface UploadedFile {
  id: string
  filename: string
  file_path: string
  file_type: 'image' | 'document'
  size: number
  uploaded_at: string
  preview_url: string | null
}

export interface ArtifactCreateRequest {
  dialog_id: string
  type: 'code' | 'web' | 'mermaid' | 'doc'
  content: string
  language?: string
}

export interface Artifact {
  id: string
  dialog_id: string
  type: string
  content: string
  render_url: string | null
  created_at: string
  updated_at: string
  version: number
}

// ============ 编程Agent ============

export interface CodeGenerateRequest {
  language: 'python' | 'javascript' | 'java' | 'cpp' | 'go' | 'rust' | 'php' | 'ruby' | 'sql' | 'shell'
  requirement: string
  context_files?: string[]
}

export interface CodeGenerateResponse {
  code: string
  explanation: string
}

export interface CodeDebugRequest {
  code: string
  error_message: string
}

export interface CodeDebugResponse {
  cause: string
  fixed_code: string
  suggestion: string
}

export interface ProjectCreateRequest {
  project_name: string
  requirement: string
}

export interface ProjectSkeletonResponse {
  directory_structure: string
  files: { path: string; content: string }[]
}

// ============ 模型管理 ============

export interface Model {
  id: string
  name: string
  description: string
  api_url: string
  capabilities: string[]
  cost_per_1k_tokens: number
  is_active: boolean
  status: 'available' | 'maintenance'
}

// ============ Projects ============

export interface ProjectCreateRequest {
  name: string
  description: string
  icon?: string | null
}

export interface Project {
  id: string
  name: string
  description: string
  icon: string | null
  system_prompt: string | null
  created_at: string
}

// ============ 后台管理 ============

export interface AdminUser {
  id: string
  username: string
  email: string
  is_active: boolean
  created_at: string
  usage_count: number
}

export interface StatItem {
  date: string
  call_count: number
  active_users: number
  revenue: number
  model_usage: Record<string, number>
}
