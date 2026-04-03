/**
 * 通用工具函数
 * 遵循 Claude 官网开发规范
 */

/**
 * 格式化日期时间
 * @param date 日期对象或日期字符串
 * @param format 格式字符串 (YYYY-MM-DD, YYYY-MM-DD HH:mm:ss, 相对时间等)
 */
export function formatDate(
  date: Date | string | number,
  format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss' | 'relative' | 'time' = 'YYYY-MM-DD'
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  
  if (format === 'relative') {
    return getRelativeTime(d)
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  switch (format) {
    case 'YYYY-MM-DD HH:mm:ss':
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hour}:${minute}`
    default: // 'YYYY-MM-DD'
      return `${year}-${month}-${day}`
  }
}

/**
 * 获取相对时间（例如：2分钟前，3小时前）
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 后缀（默认：...）
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * 生成随机ID
 * @param prefix ID前缀
 * @param length ID长度
 */
export function generateId(prefix: string = '', length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 等待时间（毫秒）
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 * @param func 要执行的函数
 * @param limit 限制时间（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (obj instanceof Object) {
    const clonedObj: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj as T
  }
  
  return obj
}

/**
 * 合并多个对象
 * @param objects 要合并的对象数组
 */
export function mergeObjects<T extends Record<string, any>>(...objects: Partial<T>[]): T {
  const result: any = {}
  
  objects.forEach(obj => {
    if (!obj) return
    
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          result[key] = mergeObjects(result[key] || {}, obj[key])
        } else {
          result[key] = obj[key]
        }
      }
    })
  })
  
  return result as T
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 * @param password 密码
 * @param minLength 最小长度（默认8）
 */
export function getPasswordStrength(password: string, minLength: number = 8): {
  score: number // 0-4
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  suggestions: string[]
} {
  const suggestions: string[] = []
  let score = 0
  
  // 长度检查
  if (password.length >= minLength) score += 1
  else suggestions.push(`密码长度至少为 ${minLength} 个字符`)
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score += 1
  else suggestions.push('添加小写字母')
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 1
  else suggestions.push('添加大写字母')
  
  // 包含数字
  if (/\d/.test(password)) score += 1
  else suggestions.push('添加数字')
  
  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else suggestions.push('添加特殊字符（如 !@#$%^&*）')
  
  const strengthMap: Record<number, 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'> = {
    0: 'weak',
    1: 'weak',
    2: 'fair',
    3: 'good',
    4: 'strong',
    5: 'very-strong'
  }
  
  return {
    score,
    strength: strengthMap[score] || 'weak',
    suggestions: score >= 4 ? [] : suggestions
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    return false
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 生成颜色渐变
 * @param color1 起始颜色（十六进制）
 * @param color2 结束颜色（十六进制）
 * @param steps 步数
 */
export function generateGradient(color1: string, color2: string, steps: number): string[] {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 }
  }
  
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const gradient = []
  
  for (let i = 0; i < steps; i++) {
    const r = Math.round(c1.r + ((c2.r - c1.r) * i) / (steps - 1))
    const g = Math.round(c1.g + ((c2.g - c1.g) * i) / (steps - 1))
    const b = Math.round(c1.b + ((c2.b - c1.b) * i) / (steps - 1))
    
    gradient.push(rgbToHex(r, g, b))
  }
  
  return gradient
}

/**
 * 获取 URL 查询参数
 * @param name 参数名
 */
export function getQueryParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

/**
 * 设置 URL 查询参数
 * @param params 参数对象
 */
export function setQueryParams(params: Record<string, string | number | boolean>): void {
  const url = new URL(window.location.href)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, String(value))
    }
  })
  
  window.history.replaceState({}, '', url.toString())
}