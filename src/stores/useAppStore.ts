import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, UserProfile, Model, Dialog, DialogListResponse, DialogDetail, Message, MessageBranch, UploadedFile, Plan } from '@/types/api'
import apiClient from '@/utils/api'
import { authApi } from '@/api/auth'
import { userApi } from '@/api/user'
import { dialogApi } from '@/api/dialog'
import { modelApi } from '@/api/model'
import { fileApi } from '@/api/file'
import { artifactApi } from '@/api/artifact'

export const useAppStore = defineStore('app', () => {
  // ============ 用户状态 ============
  const user = ref<AuthUser | null>(null)
  const userProfile = ref<UserProfile | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // ============ 制品状态 ============
  const artifacts = ref<any[]>([])

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
        // API客户端已包裹一层：res.data = { success, data: { user, token }, message }
        const payload = (res.data as any).data || res.data
        user.value = payload.user || payload
        if (payload.token) {
          apiClient.setToken(payload.token)
        }
        await fetchUserProfile()
        await fetchDialogList()
        return { success: true }
      }
      return { success: false, message: (res.data as any)?.message || res.message }
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
      if (res.success) {
        // 注册成功时后端也返回 { data: { user, token } }
        const payload = (res.data as any)?.data || res.data
        if (payload?.token) {
          apiClient.setToken(payload.token)
          user.value = payload.user || null
        }
        return { success: true, message: (res.data as any)?.message || res.message }
      }
      return { success: false, message: (res.data as any)?.message || (res.data as any)?.error || res.message }
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
        const payload = (res.data as any).data || res.data
        user.value = payload as AuthUser
        userProfile.value = payload
      }
    } catch {}
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await userApi.updateProfile(data as any)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        userProfile.value = { ...userProfile.value!, ...payload } as any
      }
      return res
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  }

  // ============ 制品操作 ============
  const fetchArtifacts = async () => {
    if (!isAuthenticated.value) return
    try {
      const res = await artifactApi.getList()
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        artifacts.value = Array.isArray(payload) ? payload : []
      }
    } catch {}
  }

  // ============ 对话操作 ============
  const fetchDialogList = async () => {
    if (!isAuthenticated.value) return
    try {
      const res = await dialogApi.getList()
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        dialogList.value = payload
      }
    } catch {}
  }

  const createDialog = async (title?: string) => {
    try {
      const res = await dialogApi.create(title)
      if (res.success && res.data) {
        await fetchDialogList()
        const payload = (res.data as any).data || res.data
        return payload as Dialog
      }
      return null
    } catch {
      return null
    }
  }

  const openDialog = async (dialogId: string) => {
    // 切换到不同对话时，先清空旧消息（避免新对话显示旧内容）
    if (currentConversationId.value !== dialogId) {
      messages.value = []
    }
    setCurrentConversation(dialogId)
    try {
      const res = await dialogApi.getDetail(dialogId)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        currentDialogDetail.value = payload
        // 用服务器返回的消息列表替换本地消息（空列表也会清空）
        messages.value = payload.messages || []
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
        const payload = (res.data as any).data || res.data
        const newMsg = payload as Message
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
      const res = await dialogApi.rename(dialogId, title)
      const payload = (res.data as any)?.data || res.data

      if (currentDialogDetail.value?.id === dialogId) {
        currentDialogDetail.value = {
          ...currentDialogDetail.value,
          title: payload?.title || title
        }
      }

      await fetchDialogList()
      return true
    } catch {
      return false
    }
  }

  const setDialogPinned = async (dialogId: string, isPinned: boolean) => {
    try {
      const res = await dialogApi.setPinned(dialogId, isPinned)
      const payload = (res.data as any)?.data || res.data

      if (currentDialogDetail.value?.id === dialogId && payload) {
        currentDialogDetail.value = {
          ...currentDialogDetail.value,
          ...(payload as any)
        }
      }

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
      console.log('[store] regenerateMessage called', { dialogId, messageId })
      const res = await dialogApi.regenerateMessage(dialogId, messageId)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        const newAiMessage = payload as Message
        console.log('[store] new AI message:', newAiMessage.id, 'parent_id:', newAiMessage.parent_id)
        
        // 找到父用户消息（当前轮次的用户消息）
        const parentUserId = newAiMessage.parent_id
        if (!parentUserId) {
          console.log('[store] no parent_id, appending to end')
          // 如果没有 parent_id，则无法确定位置，直接添加到末尾
          messages.value.push(newAiMessage)
          return newAiMessage
        }
        
        // 查找父用户消息在列表中的位置
        const parentIndex = messages.value.findIndex(m => m.id === parentUserId)
        console.log('[store] parentIndex:', parentIndex, 'messages count:', messages.value.length)
        if (parentIndex === -1) {
          console.log('[store] parent message not found, appending to end')
          // 父用户消息不在当前列表中，直接添加到末尾
          messages.value.push(newAiMessage)
          return newAiMessage
        }
        
        // 删除父用户消息之后的所有消息（后续消息归档到历史记录）
        // 从 parentIndex + 1 开始删除到末尾
        const deleteCount = messages.value.length - (parentIndex + 1)
        console.log('[store] deleteCount:', deleteCount, 'from index:', parentIndex + 1)
        if (deleteCount > 0) {
          const deleted = messages.value.splice(parentIndex + 1, deleteCount)
          console.log('[store] deleted messages:', deleted.length)
        }
        
        // 插入新的AI消息到父用户消息之后
        messages.value.splice(parentIndex + 1, 0, newAiMessage)
        console.log('[store] inserted new message at index:', parentIndex + 1)
        
        return newAiMessage
      }
      return null
    } catch (e) {
      console.error('[store] regenerateMessage error:', e)
      return null
    } finally {
      isSendingMessage.value = false
    }
  }

  const editMessage = async (dialogId: string, messageId: string, content: string) => {
    try {
      const res = await dialogApi.editMessage(dialogId, messageId, content)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        const idx = messages.value.findIndex(m => m.id === messageId)
        if (idx !== -1) {
          messages.value[idx] = payload as Message
        }
        return payload as Message
      }
      return null
    } catch {
      return null
    }
  }

  const getMessageBranches = async (dialogId: string, messageId: string) => {
    try {
      const res = await dialogApi.getMessageBranches(dialogId, messageId)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        return payload as MessageBranch[]
      }
      return []
    } catch {
      return []
    }
  }

  const uploadFile = async (file: File, dialogId?: string) => {
    try {
      const res = await fileApi.upload(file, dialogId)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        return payload as UploadedFile
      }
      return null
    } catch {
      return null
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const res = await authApi.forgotPassword({ email })
      if (res.success) {
        return { success: true, message: (res.data as any)?.message || res.message }
      }
      return { success: false, message: (res.data as any)?.message || res.message }
    } catch (e: any) {
      return { success: false, message: e.message || '操作失败' }
    }
  }

  // ============ 模型操作 ============
  const fetchModels = async () => {
    try {
      const res = await modelApi.getList()
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        models.value = payload as any
        if (!currentModel.value && payload.length > 0) {
          currentModel.value = payload[0]
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
        const payload = (res.data as any).data || res.data
        plans.value = payload as any
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
    // 先注册认证失效监听器（必须在 API 调用之前，否则 401 事件会丢失）
    window.addEventListener('auth:unauthorized', () => {
      logout()
    })

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
        fetchArtifacts(),
        fetchModels(),
        fetchPlans()
      ])
    } else {
      await fetchModels()
      await fetchPlans()
    }

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
    artifacts,
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
    setDialogPinned,
    deleteDialog,
    regenerateMessage,
    editMessage,
    getMessageBranches,
    uploadFile,
    forgotPassword,

    // 制品
    fetchArtifacts,

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
