<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1a1a1a] text-text-100">
    <!-- 左侧导航栏 -->
    <AppNavigation @sidebar-change="onSidebarChange" />

    <!-- 主内容区域 -->
    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-[800px] mx-auto px-6 pt-[28vh] pb-8">
        <!-- 问候语区域 -->
        <div class="text-center mb-8">
          <h1 class="text-[32px] font-normal text-[#1a1a1a] dark:text-white flex items-center justify-center gap-3 leading-tight">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-[28px] h-[28px] fill-current text-[#d97757]"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/></svg>
            <span>{{ greeting }}, <span class="font-semibold">{{ appStore.displayName }}</span></span>
          </h1>
        </div>

        <!-- 输入框区域 -->
        <div class="mb-6">
          <div class="relative bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm hover:border-[#cfcfce] dark:hover:border-white/20 transition-colors duration-200">
            <textarea
              ref="inputRef"
              v-model="userInput"
              rows="1"
              class="w-full bg-transparent border-0 rounded-xl pt-4 pb-14 px-4 text-[16px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] focus:outline-none resize-none min-h-[68px] max-h-[240px] leading-relaxed"
              placeholder="今天有什么可以帮您的？"
              @input="autoResize"
              @keydown.enter.exact.prevent="handleSend"
            ></textarea>

            <!-- 底部工具栏 -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <!-- 左侧：附件按钮 -->
              <label
                v-if="!userInput"
                v-tooltip="'Attach file (支持拖拽上传)'"
                class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors duration-150 group cursor-pointer"
              >
                <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <input type="file" class="hidden" accept="image/*,.pdf,.txt,.md,.doc,.docx,.csv,.json,.html,.css,.js,.ts,.py,.java,.go,.rs" multiple @change="handleFileUpload" />
              </label>

              <!-- 右侧：模型选择器 + 发送 -->
              <div class="flex items-center gap-0.5">
                <template v-if="!userInput">
                  <div
                    v-click-outside="() => showModelMenu = false"
                    class="flex items-center gap-1 px-2 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md cursor-pointer transition-colors duration-150 group relative"
                    @click="showModelMenu = !showModelMenu"
                  >
                    <span class="text-[13px] text-[#787774] dark:text-gray-400 group-hover:text-[#5c5b58] leading-none tracking-tight">
                      {{ appStore.currentModel?.name || 'Haiku 4.5' }}
                    </span>
                    <svg class="w-3 h-3 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    <!-- 模型下拉菜单 -->
                    <Transition name="dropdown">
                      <div
                        v-if="showModelMenu"
                        class="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-lg shadow-claude-md py-1 z-50"
                      >
                        <button
                          v-for="model in appStore.models"
                          :key="model.id"
                          class="w-full px-3 py-2 text-left text-[13px] flex items-center justify-between hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors"
                          :class="model.id === appStore.currentModel?.id ? 'text-[#d97757]' : 'text-[#1a1a1a] dark:text-gray-300'"
                          @click.stop="handleSwitchModel(model)"
                        >
                          <div>
                            <p class="font-medium">{{ model.name }}</p>
                            <p class="text-[11px] text-[#9b9a97] mt-0.5">{{ model.description }}</p>
                          </div>
                          <svg v-if="model.id === appStore.currentModel?.id" class="w-4 h-4 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        </button>
                      </div>
                    </Transition>
                  </div>

                  <!-- 语音按钮 -->
                  <button
                    v-tooltip="'语音输入'"
                    class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors duration-150 group cursor-pointer"
                  >
                    <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                    </svg>
                  </button>
                </template>

                <button
                  v-if="userInput"
                  :disabled="isSending || !userInput.trim()"
                  class="px-3 py-1.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[13px] font-medium"
                  @click="handleSend"
                >
                  {{ isSending ? '...' : '发送' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷功能按钮 - 全部可点击 -->
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <router-link
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            :to="shortcut.route"
            class="shortcut-btn"
          >
            <component :is="'span'" v-html="shortcut.icon" class="inline-flex items-center"></component>
            {{ shortcut.label }}
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { fileApi } from '@/api/file'

const router = useRouter()
const appStore = useAppStore()

const userInput = ref('')
const isCollapsed = ref(false)
const isSending = ref(false)
const showModelMenu = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}

/** 根据时间生成问候语 */
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

/** 创建对话并发送消息 */
const handleSend = async () => {
  if (!userInput.value.trim() || isSending.value) return

  isSending.value = true
  showModelMenu.value = false

  try {
    // 先创建对话
    const dialog = await appStore.createDialog(userInput.value.slice(0, 60))
    if (!dialog) return

    // 跳转到聊天页面
    router.push({ path: `/chat/${dialog.id}`, query: { msg: userInput.value } })
  } catch (e) {
    console.error('发送失败:', e)
  } finally {
    isSending.value = false
  }
}

/** 切换模型 */
const handleSwitchModel = async (model: any) => {
  showModelMenu.value = false
  await appStore.switchModel(model.id)
}

/** 文件上传处理 */
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  try {
    let fileNames = ''
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const res = await fileApi.upload(file)
      if (res.success && res.data) {
        fileNames += `[附件: ${(res.data as any).filename}] `
      }
    }
    userInput.value += '\n' + fileNames.trim()
  } catch (e) {
    console.error('上传失败:', e)
    // fallback
    for (let i = 0; i < files.length; i++) {
      userInput.value += `\n[附件: ${files[i].name}]`
    }
  }
  input.value = ''
}

// 快捷按钮 - 每个都有对应功能
const shortcuts = [
  { id: 1, label: '策略规划', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>', route: '/chat' },
  { id: 2, label: '写作', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>', route: '/chat' },
  { id: 3, label: '学习', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>', route: '/chat' },
  { id: 4, label: '编程', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>', route: '/code' },
  { id: 5, label: '生活', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/></svg>', route: '/chat' },
]

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 240) + 'px'
}

/** 点击外部关闭模型菜单 */
const handleClickOutside = (e: MouseEvent) => {
  if (showModelMenu.value) {
    const target = e.target as HTMLElement
    if (!target.closest('.relative') && !target.closest('[class*="rounded-md"]')) {
      showModelMenu.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  setTimeout(() => inputRef.value?.focus(), 300)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.shortcut-btn {
  @apply px-3 py-[5px] border border-[#e0e0df] dark:border-white/10 rounded-full text-[13px] text-[#787774] dark:text-gray-400 hover:text-[#5c5b58] hover:border-[#cfcfce] dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/5 transition-all duration-150 flex items-center gap-1.5 leading-none;
}
</style>
