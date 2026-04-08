<template>
  <div class="min-h-screen bg-[#f9f8f5] text-text-100">
    <!-- 左侧导航栏 -->
    <AppNavigation @sidebar-change="onSidebarChange" />

    <!-- 主聊天区域 -->
    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-24">
        <!-- 对话标题栏 -->
        <div v-if="dialogDetail" class="flex items-center justify-between mb-6">
          <h1 class="text-xl font-semibold text-[#1a1a1a] truncate">{{ dialogDetail.title }}</h1>
          <button
            class="p-1.5 hover:bg-black/[0.04] rounded-md transition-colors group"
            title="Delete conversation"
            @click="handleDeleteDialog"
          >
            <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        <!-- 消息列表区域 -->
        <div class="space-y-6 mb-32">
          <!-- 空状态：无对话时提示 -->
          <div v-if="!dialogId || !messages.length && !isSending" class="text-center py-20">
            <p class="text-[#9b9a97] text-[15px]">Start a new conversation</p>
          </div>

          <!-- 消息列表 -->
          <template v-for="(msg, index) in messages" :key="msg.id">
            <!-- 用户消息 -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="max-w-[80%] bg-white border border-[#e5e5e4] rounded-2xl rounded-tr-md p-4 shadow-sm">
                <p class="text-[15px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                <p class="text-[11px] text-[#9b9a97] mt-2 text-right">{{ formatTime(msg.timestamp) }}</p>
              </div>
            </div>

            <!-- AI 消息 -->
            <div v-else class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center shrink-0 mt-1">
                <span class="text-white text-sm font-bold">C</span>
              </div>
              <div class="max-w-[80%] bg-white border border-[#e5e5e4] rounded-2xl rounded-tl-md p-4 shadow-sm">
                <div class="text-[15px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap" v-html="renderContent(msg.content)"></div>
                <div class="flex items-center gap-2 mt-3">
                  <p class="text-[11px] text-[#9b9a97]">{{ formatTime(msg.timestamp) }}</p>
                  <button
                    v-if="index === messages.length - 1"
                    class="p-1 hover:bg-black/[0.04] rounded transition-colors group"
                    title="Regenerate response"
                    :disabled="appStore.isSendingMessage"
                    @click="handleRegenerate(msg.id)"
                  >
                    <svg class="w-3.5 h-3.5 text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- 发送中状态 -->
          <div v-if="isSending" class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center shrink-0 mt-1">
              <span class="text-white text-sm font-bold">C</span>
            </div>
            <div class="bg-white border border-[#e5e5e4] rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部输入框 - 固定在底部 -->
        <div class="fixed bottom-6 left-0 right-0 z-40" :style="{ marginLeft: isCollapsed ? '48px' : '260px', transition: 'margin-left 200ms ease-in-out' }">
          <div class="max-w-3xl mx-auto px-6">
            <div class="bg-white border border-[#e0e0df] rounded-xl shadow-claude-md hover:border-[#cfcfce] transition-colors duration-200">
              <textarea
                ref="inputRef"
                v-model="messageInput"
                class="w-full bg-transparent border-0 rounded-xl pt-4 pb-14 px-4 text-[15px] text-[#1a1a1a] placeholder-[#9b9a97] focus:outline-none resize-none min-h-[56px] max-h-[200px] leading-relaxed"
                placeholder="Message Claude..."
                rows="1"
                @input="autoResize"
                @keydown.enter.exact.prevent="handleSend"
              ></textarea>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                <label class="p-1.5 mr-1 hover:bg-black/[0.04] rounded-md transition-colors group cursor-pointer" title="Attach file">
                  <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" class="hidden" accept="image/*,.pdf,.txt,.md,.doc,.docx" @change="handleFileUpload" />
                </label>

                <button
                  :disabled="isSending || !messageInput.trim()"
                  class="px-4 py-1.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[13px] font-medium ml-2"
                  @click="handleSend"
                >
                  {{ isSending ? '...' : 'Send' }}
                </button>
              </div>
            </div>

            <p class="text-center text-[11px] text-[#cfcfce] mt-2">
              Claude can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { dialogApi } from '@/api/dialog'
import type { Message } from '@/types/api'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const messageInput = ref('')
const isCollapsed = ref(false)
const isSending = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)

const dialogId = computed(() => route.params.id as string | undefined)
const messages = computed(() => appStore.messages)
const dialogDetail = computed(() => appStore.currentDialogDetail)

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}

// 加载对话详情
const loadDialog = async (id: string) => {
  if (!id) return
  await appStore.openDialog(id)
}

// 如果URL有query参数 msg，自动发送
watch(dialogId, async (newId) => {
  if (newId) {
    await loadDialog(newId)
    const msg = route.query.msg as string
    if (msg) {
      messageInput.value = msg
      // 延迟发送，等对话框加载完
      setTimeout(() => handleSend(), 300)
      router.replace({ path: `/chat/${newId}` })
    }
  }
}, { immediate: true })

/** 发送消息 */
const handleSend = async () => {
  const content = messageInput.value.trim()
  const id = dialogId.value

  if (!content || !id || isSending.value) return

  isSending.value = true
  try {
    const result = await appStore.sendMessage(id, content)
    if (!result) {
      // fallback: 手动添加用户消息并请求AI回复
      const userMsg: Message = {
        id: `temp_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        status: 'sent',
        parent_id: null,
        version: 1,
      }
      appStore.messages.push(userMsg)

      // 调用API发送消息
      const res = await dialogApi.sendMessage(id, content)
      if (res.success && res.data) {
        appStore.messages.push(res.data as Message)
      } else {
        // API失败时的fallback回复
        appStore.messages.push({
          id: `ai_${Date.now()}`,
          role: 'ai',
          content: res.message || 'Sorry, there was an error processing your request.',
          timestamp: new Date().toISOString(),
          status: 'sent',
          parent_id: null,
          version: 1,
        })
      }

      // 刷新对话列表以更新标题
      await appStore.fetchDialogList()
    }
    messageInput.value = ''
    autoResizeByRef()
  } catch (e) {
    console.error('Send failed:', e)
  } finally {
    isSending.value = false
  }
}

/** 重新生成 */
const handleRegenerate = async (messageId: string) => {
  const id = dialogId.value
  if (!id) return
  await appStore.regenerateMessage(id, messageId)
}

/** 删除对话 */
const handleDeleteDialog = async () => {
  const id = dialogId.value
  if (!id || !confirm('确定要删除这个对话吗？')) return
  await appStore.deleteDialog(id)
  router.push('/')
}

/** 文件上传 */
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  // TODO: 上传文件后附加到消息中
  messageInput.value += `\n[附件: ${file.name}]`
  input.value = ''
}

/** 格式化时间 */
const formatTime = (timestamp: string) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}min ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  return date.toLocaleDateString()
}

/** 渲染消息内容（支持简单Markdown）*/
const renderContent = (content: string): string => {
  if (!content) return ''
  let html = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#f5f4f0] rounded-lg p-3 my-2 overflow-x-auto font-mono text-[13px]"><code>$2</code></pre>')
  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#f5f4f0] px-1 py-0.5 rounded font-mono text-[13px]">$1</code>')
  // 粗体/斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return html
}

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const autoResizeByRef = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 200) + 'px'
  }
}

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 300)
})
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}
</style>
