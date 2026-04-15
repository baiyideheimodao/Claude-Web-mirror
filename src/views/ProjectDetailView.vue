<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1f1f1e] text-[#1a1a1a] dark:text-gray-200">
    <AppNavigation @sidebar-change="onSidebarChange" />

    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[288px]']">
      <div class="max-w-4xl mx-auto px-6 pt-6 pb-32">
        <!-- 顶部导航 -->
        <div class="flex items-center gap-2 mb-6 text-[13px]">
          <button class="text-[#d97757] hover:underline" @click="$router.push('/projects')">← 所有项目</button>
          <span class="text-[#cfcfce] dark:text-gray-500">/</span>
          <h1 class="text-xl font-semibold text-[#1a1a1a] dark:text-white flex-1">{{ projectName }}</h1>
          <button class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded transition-colors" title="收藏">
            <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </button>
          <button class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded transition-colors" title="更多选项">
            <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
          </button>
        </div>

        <!-- 描述 -->
        <p class="text-[14px] text-[#787774] dark:text-gray-400 mb-6">{{ projectDescription }}</p>

        <div class="grid grid-cols-3 gap-6">
          <!-- 左侧：对话区域 -->
          <div class="col-span-2 space-y-4">
            <!-- 输入框 -->
            <div class="relative bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm hover:border-[#cfcfce] dark:hover:border-white/20 transition-colors">
              <textarea
                v-model="messageInput"
                rows="2"
                class="w-full bg-transparent border-0 rounded-xl p-4 pb-12 text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] dark:placeholder-gray-500 focus:outline-none resize-none min-h-[68px] max-h-[200px]"
                placeholder="今天有什么可以帮您的？"
                @keydown.enter.exact.prevent="handleSend"
              ></textarea>
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <label class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md cursor-pointer group">
                  <svg class="w-[17px] h-[17px] text-[#9b9a97] dark:text-gray-500 group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <input type="file" class="hidden" accept="image/*,.pdf,.txt,.md,.doc,.docx" @change="handleFileUpload" />
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-[12px] text-[#9b9a97] dark:text-gray-500">{{ currentModel }}</span>
                  <button class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded">
                    <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                  </button>
                  <button
                    :disabled="!messageInput.trim()"
                    class="px-3 py-1.5 bg-[#d97757] disabled:bg-[#cfcfce] dark:disabled:bg-gray-300 text-white rounded-lg text-[13px] font-medium"
                    @click="handleSend"
                  >发送</button>
                </div>
              </div>
            </div>

            <p class="text-center text-[12px] text-[#cfcfce] dark:text-gray-500">开始对话，保持对话有序并复用项目知识。</p>

            <!-- 消息区域（如果有对话） -->
            <div v-if="messages.length" class="space-y-4 mt-6">
              <div v-for="msg in messages" :key="msg.id" :class="['flex gap-3', msg.role === 'user' ? 'justify-end' : '']">
                <div v-if="msg.role !== 'ai'" class="max-w-[80%] bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-2xl rounded-tr-md p-4 shadow-sm">
                  <p class="text-[14px] text-[#1a1a1a] dark:text-white">{{ msg.content }}</p>
                </div>
                <template v-else>
                  <div class="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
                    <span class="text-white text-sm font-bold">C</span>
                  </div>
                  <div class="max-w-[80%] bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-2xl rounded-tl-md p-4 shadow-sm">
                    <div class="text-[14px] text-[#1a1a1a] dark:text-white whitespace-pre-wrap" v-html="renderContent(msg.content)"></div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- 右侧：Instructions + Files -->
          <div class="space-y-4">
            <!-- Instructions -->
            <div class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-[13px] font-medium text-[#1a1a1a] dark:text-white">指令</h3>
                <button class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded" @click="showInstructionEdit = !showInstructionEdit">
                  <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
              <p v-if="!showInstructionEdit" class="text-[12px] text-[#787774] dark:text-gray-400 leading-relaxed">添加指令来定制 Claude 的回复。</p>
              <textarea v-else v-model="systemPrompt" rows="4" class="w-full text-[12px] text-[#1a1a1a] dark:text-white border border-[#e0e0df] dark:border-white/10 rounded p-2 resize-none focus:outline-none focus:border-[#d97757] bg-transparent" placeholder="输入自定义系统提示..."></textarea>
            </div>

            <!-- Files -->
            <div class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-[13px] font-medium text-[#1a1a1a] dark:text-white">文件</h3>
                <button class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded">
                  <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
              <div class="text-center py-6">
                <svg class="w-10 h-10 mx-auto text-[#e5e5e4] dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p class="text-[12px] text-[#cfcfce] dark:text-gray-500">添加 PDF、文档或其他文本<br/>供项目记忆使用。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'

const route = useRoute()
const appStore = useAppStore()

const isCollapsed = ref(false)
const messageInput = ref('')
const showInstructionEdit = ref(false)
const systemPrompt = ref('')
const messages = ref<any[]>([])
const projectId = computed(() => route.params.id as string)

const projectName = ref('Untitled')
const projectDescription = ref('')

// TODO: 从后端加载项目详情
onMounted(async () => {
  const id = projectId.value
  if (id) {
    // const res = await projectApi.getDetail(id)
    // if (res.success && res.data) { ... }
  }
})

const currentModel = computed(() => appStore.currentModel?.name || 'Haiku 4.5')

const onSidebarChange = (collapsed: boolean) => { isCollapsed.value = collapsed }

const handleSend = async () => {
  if (!messageInput.value.trim()) return
  // TODO: 在项目中发送消息
  messageInput.value = ''
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) messageInput.value += `\n[附件: ${input.files[0].name}]`
  input.value = ''
}

const renderContent = (content: string): string => {
  if (!content) return ''
  let html = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#f5f4f0] dark:bg-[#1f1f1e] rounded p-3 my-2 overflow-x-auto font-mono text-[13px]"><code class="text-[#1a1a1a] dark:text-gray-200">$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#f5f4f0] dark:bg-white/10 px-1 rounded font-mono text-[13px] text-[#1a1a1a] dark:text-gray-200">$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  return html
}
</script>
