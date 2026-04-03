import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile, UserPreferences } from '@/types/api'

/**
 * 应用全局状态管理
 * 遵循 Claude 官网的状态管理规范
 */
export const useAppStore = defineStore('app', () => {
  // 用户状态
  const user = ref<UserProfile | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  // UI 状态
  const theme = ref<'light' | 'dark' | 'system'>('light')
  const sidebarOpen = ref(true)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 应用配置
  const appConfig = ref({
    title: import.meta.env.VITE_APP_TITLE || 'Claude 官网镜像',
    version: import.meta.env.VITE_APP_VERSION || '0.0.1',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.claude.ai',
    useMock: import.meta.env.VITE_USE_MOCK === 'true'
  })
  
  // 用户偏好
  const preferences = ref<UserPreferences>({
    theme: 'light',
    language: 'zh-CN',
    notificationSettings: {
      email: true,
      push: true,
      sound: true
    },
    editorSettings: {
      fontSize: 16,
      lineHeight: 1.5,
      fontFamily: 'var(--font-sans-serif)'
    }
  })
  
  // 聊天状态
  const currentConversationId = ref<string | null>(null)
  const conversations = ref<any[]>([])
  
  // 操作方法
  const setUser = (userData: UserProfile | null) => {
    user.value = userData
    if (userData?.preferences) {
      preferences.value = userData.preferences
      theme.value = userData.preferences.theme
    }
  }
  
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    preferences.value.theme = newTheme
    
    // 应用主题到 DOM
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else if (newTheme === 'light') {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    } else {
      // 系统主题
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isSystemDark) {
        html.classList.add('dark')
        html.setAttribute('data-theme', 'dark')
      } else {
        html.classList.remove('dark')
        html.setAttribute('data-theme', 'light')
      }
    }
    
    // 保存到 localStorage
    localStorage.setItem('claude-theme', newTheme)
  }
  
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    localStorage.setItem('claude-sidebar-open', String(sidebarOpen.value))
  }
  
  const setSidebarOpen = (open: boolean) => {
    sidebarOpen.value = open
    localStorage.setItem('claude-sidebar-open', String(open))
  }
  
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }
  
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
    if (errorMessage) {
      // 自动清除错误
      setTimeout(() => {
        error.value = null
      }, 5000)
    }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  const setCurrentConversation = (conversationId: string | null) => {
    currentConversationId.value = conversationId
    localStorage.setItem('claude-current-conversation', conversationId || '')
  }
  
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    preferences.value = { ...preferences.value, ...newPreferences }
    
    // 如果主题发生变化，应用新主题
    if (newPreferences.theme && newPreferences.theme !== theme.value) {
      setTheme(newPreferences.theme)
    }
    
    // 保存到服务器（如果有用户）
    if (user.value) {
      // TODO: 调用 API 更新用户偏好
      console.log('更新用户偏好:', newPreferences)
    }
  }
  
  // 初始化
  const initialize = () => {
    // 加载保存的主题
    const savedTheme = localStorage.getItem('claude-theme') as 'light' | 'dark' | 'system'
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    // 加载侧边栏状态
    const savedSidebar = localStorage.getItem('claude-sidebar-open')
    if (savedSidebar !== null) {
      sidebarOpen.value = savedSidebar === 'true'
    }
    
    // 加载当前对话
    const savedConversation = localStorage.getItem('claude-current-conversation')
    if (savedConversation) {
      currentConversationId.value = savedConversation
    }
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme.value === 'system') {
        setTheme('system') // 重新应用系统主题
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }
  
  // 计算属性
  const userName = computed(() => {
    if (!user.value) return 'Visitor'
    return user.value.name || user.value.email.split('@')[0]
  })
  
  const userInitials = computed(() => {
    if (!user.value?.name) return 'V'
    return user.value.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })
  
  const isDarkMode = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })
  
  return {
    // 状态
    user,
    isAuthenticated,
    theme,
    sidebarOpen,
    isLoading,
    error,
    appConfig,
    preferences,
    currentConversationId,
    conversations,
    
    // 计算属性
    userName,
    userInitials,
    isDarkMode,
    
    // 操作方法
    setUser,
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    setLoading,
    setError,
    clearError,
    setCurrentConversation,
    updatePreferences,
    initialize
  }
})