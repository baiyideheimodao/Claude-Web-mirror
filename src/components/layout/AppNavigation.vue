<template>
  <nav class="fixed top-0 left-0 h-screen w-72 bg-bg-000 border-r border-border-300 z-50 transition-all duration-300 md:static md:h-auto md:border-r-0 lg:block flex flex-col"
       :class="{ 'hidden': !isNavOpen, 'block': isNavOpen }">
    
    <!-- Logo 区域 -->
    <div class="h-16 border-b border-border-300 flex items-center px-4 flex-shrink-0">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-md bg-brand-100 flex items-center justify-center">
          <span class="text-white font-bold text-sm">C</span>
        </div>
        <span class="text-text-100 font-semibold">Claude</span>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <div class="flex-1 overflow-y-auto p-3">
      <!-- 新建聊天按钮 -->
      <button class="w-full mb-4 py-2.5 bg-brand-100 hover:bg-brand-200 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New chat
      </button>
      
      <!-- 最近聊天 -->
      <div class="mb-4">
        <h3 class="text-xs font-semibold text-text-400 uppercase tracking-wider mb-2 px-1">Recent</h3>
        <ul class="space-y-1">
          <li v-for="chat in recentChats" :key="chat.id">
            <button class="w-full text-left px-2 py-1.5 rounded-md text-sm text-text-200 hover:text-text-100 hover:bg-bg-100 transition-colors flex items-center justify-between">
              <span class="truncate">{{ chat.title }}</span>
              <span class="text-xs text-text-400 flex-shrink-0">{{ chat.time }}</span>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- 工具菜单 -->
      <div class="mb-4">
        <h3 class="text-xs font-semibold text-text-400 uppercase tracking-wider mb-2 px-1">Tools</h3>
        <ul class="space-y-1">
          <li v-for="tool in tools" :key="tool.id">
            <button class="w-full text-left px-2 py-1.5 rounded-md text-sm text-text-200 hover:text-text-100 hover:bg-bg-100 transition-colors flex items-center gap-2">
              <span class="text-base">{{ tool.icon }}</span>
              <span>{{ tool.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 设置菜单 -->
    <div class="border-t border-border-300 p-3 flex-shrink-0">
      <button class="w-full text-left px-2 py-1.5 rounded-md text-sm text-text-200 hover:text-text-100 hover:bg-bg-100 transition-colors flex items-center gap-2 mb-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>
      
      <button class="w-full text-left px-2 py-1.5 rounded-md text-sm text-text-200 hover:text-text-100 hover:bg-bg-100 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        Help
      </button>
    </div>
  </nav>
  
  <!-- 移动端汉堡菜单按钮 -->
  <button 
    class="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-md bg-bg-0 border border-border-400 flex items-center justify-center"
    @click="toggleNav"
  >
    <svg class="w-5 h-5 text-text-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="isNavOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  
  <!-- 移动端遮罩 -->
  <div 
    v-if="isNavOpen"
    class="md:hidden fixed inset-0 bg-overlay-100 z-40"
    @click="closeNav"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isNavOpen = ref(false)

const recentChats = [
  { id: 1, title: 'Vue button component tutorial', time: '2h ago' },
  { id: 2, title: 'Project planning for Q2', time: 'Yesterday' },
  { id: 3, title: 'JavaScript debugging help', time: '2 days ago' },
  { id: 4, title: 'Email draft review', time: '3 days ago' }
]

const tools = [
  { id: 1, name: 'Web Search', icon: '🔍' },
  { id: 2, name: 'File Upload', icon: '📎' },
  { id: 3, name: 'Code Interpreter', icon: '💻' },
  { id: 4, name: 'Artifacts', icon: '🖼️' }
]

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  isNavOpen.value = false
}

// 响应式：桌面端默认打开导航
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      isNavOpen.value = true
    } else {
      isNavOpen.value = false
    }
  }
  
  handleResize()
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>