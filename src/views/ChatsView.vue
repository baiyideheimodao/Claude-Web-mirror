<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1f1f1e] text-[#1a1a1a] dark:text-gray-200">
    <AppNavigation @sidebar-change="onSidebarChange" />

    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[288px]']">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-8">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-xl font-semibold text-[#1a1a1a] dark:text-white">对话</h1>
          <button
            class="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-[#1a1a1a] rounded-lg transition-colors duration-150 text-[13px] font-medium flex items-center gap-1.5"
            @click="handleNewChat"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            新建对话
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="relative mb-4">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] dark:placeholder-gray-500 focus:outline-none focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]/20 transition-all"
            placeholder="搜索对话..."
            @input="handleSearch"
          />
        </div>

        <!-- 提示文字 -->
        <p class="text-[13px] text-[#787774] dark:text-gray-400 mb-3">与 Claude 的对话 · <button class="text-[#d97757] hover:underline" @click="handleSelectAll">{{ selectMode ? '完成' : '选择' }}</button></p>

        <!-- 对话列表 -->
        <div v-if="filteredChats.length > 0" class="space-y-0.5">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            :class="[
              'flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors group hover:bg-black/[0.03] dark:hover:bg-white/5',
              selectedIds.has(chat.id) ? 'bg-[#f0ede7] dark:bg-white/5' : ''
            ]"
            @click="selectMode ? toggleSelect(chat.id) : openChat(chat)"
          >
            <div v-if="selectMode" class="pt-0.5">
              <div :class="['w-4 h-4 rounded border-2 flex items-center justify-center transition-colors', selectedIds.has(chat.id) ? 'bg-[#d97757] border-[#d97757]' : 'border-[#cfcfce] dark:border-gray-600']">
                <svg v-if="selectedIds.has(chat.id)" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-medium text-[#1a1a1a] dark:text-white truncate">{{ chat.title }}</p>
              <p class="text-[12px] text-[#9b9a97] dark:text-gray-500 mt-0.5">{{ formatRelativeTime(chat.last_message_at || chat.updated_at) }}</p>
            </div>
            <button
              v-if="!selectMode"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/[0.06] dark:hover:bg-white/5 rounded transition-all shrink-0"
              title="更多选项"
              @click.stop="showChatMenu(chat)"
            >
              <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="appStore.recentChatsFlat.length === 0" class="text-center py-20">
          <p class="text-[15px] text-[#9b9a97] dark:text-gray-500">暂无对话</p>
          <p class="text-[13px] text-[#cfcfce] dark:text-gray-500 mt-1">开始新对话，与 Claude 聊天吧。</p>
          <button class="mt-4 px-4 py-2 bg-[#d97757] hover:bg-[#c96a4a] text-white rounded-lg text-[13px]" @click="handleNewChat">开始对话</button>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-[13px] text-[#9b9a97] dark:text-gray-500">未找到 "{{ searchQuery }}" 的结果</p>
        </div>

        <!-- 批量操作栏 -->
        <div v-if="selectMode && selectedIds.size > 0" class="fixed bottom-4 left-0 right-0 z-40 flex justify-center" :style="{ marginLeft: isCollapsed ? '48px' : '260px', transition: 'margin-left 200ms ease-in-out' }">
          <div class="bg-[#1a1a1a] dark:bg-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
            <span :class="['text-[13px] font-medium', 'text-white dark:text-[#1a1a1a]']">{{ selectedIds.size }} 项已选</span>
            <button class="px-3 py-1 bg-white/15 hover:bg-white/25 dark:bg-black/10 dark:hover:bg-black/20 text-white dark:text-[#1a1a1a] rounded-md text-[12px] transition-colors" @click="handleDeleteSelected">删除</button>
            <button class="text-[#cfcfce] dark:text-gray-400 hover:text-white dark:hover:text-[#1a1a1a] text-[12px]" @click="selectMode = false; selectedIds.clear()">取消</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'

const router = useRouter()
const appStore = useAppStore()

const isCollapsed = ref(false)
const searchQuery = ref('')
const selectMode = ref(false)
const selectedIds = ref(new Set<string>())

const filteredChats = computed(() => {
  const chats = appStore.recentChatsFlat
  if (!searchQuery.value.trim()) return chats
  const q = searchQuery.value.toLowerCase()
  return chats.filter(c => c.title?.toLowerCase().includes(q))
})

const onSidebarChange = (collapsed: boolean) => { isCollapsed.value = collapsed }

const handleNewChat = () => router.push('/')
const openChat = (chat: any) => router.push(`/chat/${chat.id}`)
const handleSearch = () => {}

const handleSelectAll = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value) selectedIds.value.clear()
}

const toggleSelect = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  // force reactivity
  selectedIds.value = new Set(selectedIds.value)
}

const handleDeleteSelected = async () => {
  if (!confirm(`确定要删除这 ${selectedIds.value.size} 个对话吗？`)) return
  for (const id of selectedIds.value) {
    await appStore.deleteDialog(id)
  }
  selectedIds.value.clear()
  selectMode.value = false
}

const showChatMenu = (chat: any) => {
  // TODO: show context menu
}

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}天前`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}周前`
  return date.toLocaleDateString()
}
</script>
