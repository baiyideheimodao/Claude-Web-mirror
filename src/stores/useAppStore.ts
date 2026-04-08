import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, UserProfile, Model, Dialog, DialogListResponse, DialogDetail, Message, Plan } from '@/types/api'
import apiClient from '@/utils/api'
import { authApi } from '@/api/auth'
import { userApi } from '@/api/user'
import { dialogApi } from '@/api/dialog'
import { modelApi } from '@/api/model'

export const useAppStore = defineStore('app', () => {
  // ============ 用户状态 ============
  const user = ref<AuthUser | null>(null)
  const userProfile = ref<UserProfile | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // ============ UI 状态 ============
  const theme = ref<'light' | 'dark' | 'system'>('light')
  const sidebarOpen = ref(true)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ============ 模型状态 ============
  const models = ref<Model[]>([])
  const currentModel = ref<Model | null>(null)

  // ============ 对话/消息状态 ============
  const currentConversationId = ref<string | null>(null)
  const dialogList = ref<DialogListResponse>({ today: [], yesterday: [], last_7_days: [], last_30_days: [] })
  const currentDialogDetail = ref<DialogDetail | null>(null)
  const messages = ref<Message[]>([])
  const isSendingMessage = ref(false)

  // ============ 套餐 ============
  const plans = ref<Plan[]>([])

  // ============ 认证操作 ============
  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const res = await authApi.login({ username, password })
      if (res.success && res.data) {
        user.value = res.data as any
        if ((res.data as any).token) {
          apiClient.setToken((res.data as any).token)
        }
        await fetchUserProfile()
        await fetchDialogList()
        return { success: true }
      }
      return { success: false, message: res.message }
    } catch (e: any) {
      return { success: false, message: e.message || '登录失败' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: { username: string; email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await authApi.register(data)
      return { success: res.success, message: res.message }
    } catch (e: any) {
      return { success: false, message: e.message || '注册失败' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    user.value = null
    userProfile.value = null
    currentDialogDetail.value = null
    messages.value = []
    currentConversationId.value = null
    apiClient.clearToken()
    localStorage.removeItem('claude-token')
  }

  // ============ 用户信息 ============
  const fetchUserProfile = async () => {
    try {
      const res = await userApi.getProfile()
      if (res.success && res.data) {
        userProfile.value = res.data as any
      }
    } catch {}
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await userApi.updateProfile(data as any)
      if (res.success && res.data) {
        userProfile.value = { ...userProfile.value!, ...res.data } as any
      }
      return res
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  }

  // ============ 对话操作 ============
  const fetchDialogList = async () => {
    if (!isAuthenticated.value) return
    try {
      const res = await dialogApi.getList()
      if (res.success && res.data) {
        dialogList.value = res.data as any
      }
    } catch {}
  }

  const createDialog = async (title?: string) => {
    try {
      const res = await dialogApi.create(title)
      if (res.success && res.data) {
        await fetchDialogList()
        return res.data as Dialog
      }
      return null
    } catch {
      return null
    }
  }

  const openDialog = async (dialogId: string) => {
    setCurrentConversation(dialogId)
    try {
      const res = await dialogApi.getDetail(dialogId)
      if (res.success && res.data) {
        currentDialogDetail.value = res.data as any
        messages.value = (res.data as any).messages || []
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const sendMessage = async (dialogId: string, content: string, files?: string[]) => {
    isSendingMessage.value = true
    try {
      const res = await dialogApi.sendMessage(dialogId, content, files)
      if (res.success && res.data) {
        const newMsg = res.data as Message
        messages.value.push(newMsg)
        return newMsg
      }
      return null
    } catch {
      return null
    } finally {
      isSendingMessage.value = false
    }
  }

  const renameDialog = async (dialogId: string, title: string) => {
    try {
      await dialogApi.rename(dialogId, title)
      await fetchDialogList()
      return true
    } catch {
      return false
    }
  }

  const deleteDialog = async (dialogId: string) => {
    try {
      await dialogApi.delete(dialogId)
      if (currentConversationId.value === dialogId) {
        currentDialogDetail.value = null
        messages.value = []
        currentConversationId.value = null
      }
      await fetchDialogList()
      return true
    } catch {
      return false
    }
  }

  const regenerateMessage = async (dialogId: string, messageId: string) => {
    isSendingMessage.value = true
    try {
      const res = await dialogApi.regenerateMessage(dialogId, messageId)
      if (res.success && res.data) {
        const idx = messages.value.findIndex(m => m.id === messageId)
        if (idx !== -1) {
          messages.value[idx] = res.data as Message
        }
        return res.data as Message
      }
      return null
    } catch {
      return null
    } finally {
      isSendingMessage.value = false
    }
  }

  // ============ 模型操作 ============
  const fetchModels = async () => {
    try {
      const res = await modelApi.getList()
      if (res.success && res.data) {
        models.value = res.data as any
        if (!currentModel.value && res.data.length > 0) {
          currentModel.value = (res.data as any)[0]
        }
      }
    } catch {}
  }

  const switchModel = async (modelId: string) => {
    const model = models.value.find(m => m.id === modelId)
    if (model) {
      currentModel.value = model
      await modelApi.switchModel(modelId)
    }
  }

  // ============ 套餐操作 ============
  const fetchPlans = async () => {
    try {
      const res = await userApi.getPlans()
      if (res.success && res.data) {
        plans.value = res.data as any
      }
    } catch {}
  }

  // ============ UI 操作 ============
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else if (newTheme === 'light') {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        html.classList.add('dark')
        html.setAttribute('data-theme', 'dark')
      } else {
        html.classList.remove('dark')
        html.setAttribute('data-theme', 'light')
      }
    }
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

  const setLoading = (loading: boolean) => { isLoading.value = loading }
  const setError = (msg: string | null) => {
    error.value = msg
    if (msg) setTimeout(() => { error.value = null }, 5000)
  }
  const clearError = () => { error.value = null }

  const setCurrentConversation = (id: string | null) => {
    currentConversationId.value = id
    localStorage.setItem('claude-current-conversation', id || '')
  }

  // ============ 初始化 ============
  const initialize = async () => {
    const savedTheme = localStorage.getItem('claude-theme') as any
    if (savedTheme) setTheme(savedTheme)

    const savedSidebar = localStorage.getItem('claude-sidebar-open')
    if (savedSidebar !== null) sidebarOpen.value = savedSidebar === 'true'

    const savedConversation = localStorage.getItem('claude-current-conversation')
    if (savedConversation) currentConversationId.value = savedConversation

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => { if (theme.value === 'system') setTheme('system') })

    // 如果有 token，自动拉取用户数据
    if (apiClient.getToken()) {
      await Promise.all([
        fetchUserProfile(),
        fetchDialogList(),
        fetchModels(),
        fetchPlans()
      ])
    } else {
      await fetchModels()
      await fetchPlans()
    }

    // 监听认证失效事件
    window.addEventListener('auth:unauthorized', () => {
      logout()
    })

    return () => {
      window.removeEventListener('auth:unauthorized', () => {})
    }
  }

  // ============ 计算属性 ============
  const userName = computed(() => {
    if (!user.value) return 'Visitor'
    return user.value.username || user.value.email.split('@')[0]
  })

  const userInitials = computed(() => {
    if (!user.value?.username) return 'V'
    return user.value.username.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
  })

  const displayName = computed(() => userName.value)

  /** 展开的最近对话列表（从分组中扁平化） */
  const recentChatsFlat = computed(() => {
    const groups = dialogList.value
    return [
      ...groups.today,
      ...groups.yesterday,
      ...groups.last_7_days,
      ...groups.last_30_days
    ].slice(0, 30)
  })

  const isDarkMode = computed(() => {
    if (theme.value === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
    return theme.value === 'dark'
  })

  const planName = computed(() => {
    return 'Pro plan' // TODO: 从用户套餐信息获取
  })

  return {
    // 状态
    user,
    userProfile,
    isAuthenticated,
    theme,
    sidebarOpen,
    isLoading,
    error,
    models,
    currentModel,
    currentConversationId,
    dialogList,
    currentDialogDetail,
    messages,
    isSendingMessage,
    plans,

    // 计算属性
    userName,
    userInitials,
    displayName,
    recentChatsFlat,
    isDarkMode,
    planName,

    // 认证
    login,
    register,
    logout,

    // 用户
    fetchUserProfile,
    updateUserProfile,

    // 对话
    fetchDialogList,
    createDialog,
    openDialog,
    sendMessage,
    renameDialog,
    deleteDialog,
    regenerateMessage,

    // 模型
    fetchModels,
    switchModel,

    // 套餐
    fetchPlans,

    // UI
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    setLoading,
    setError,
    clearError,
    setCurrentConversation,
    initialize
  }
})
