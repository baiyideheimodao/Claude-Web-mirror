<template>
  <nav class="fixed top-0 left-0 h-screen w-nav-width bg-bg-100 border-r border-border-400 z-50 transition-all duration-300 md:static md:h-auto md:border-r-0 lg:block"
       :class="{ 'hidden': !isNavOpen, 'block': isNavOpen }">
    
    <!-- Logo 区域 -->
    <div class="h-16 border-b border-border-400 flex items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-md bg-brand-0 flex items-center justify-center">
          <span class="text-white font-bold">C</span>
        </div>
        <span class="text-text-100 font-semibold text-lg">Claude</span>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <div class="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
      <!-- 新建聊天按钮 -->
      <button class="btn-primary w-full mb-6">
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </span>
      </button>
      
      <!-- 最近聊天 -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-text-400 uppercase tracking-wider mb-3">Recent</h3>
        <ul class="space-y-1">
          <li v-for="chat in recentChats" :key="chat.id">
            <button class="nav-item w-full text-left flex items-center justify-between">
              <span class="truncate">{{ chat.title }}</span>
              <span class="text-xs text-text-400">{{ chat.time }}</span>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- 工具菜单 -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-text-400 uppercase tracking-wider mb-3">Tools</h3>
        <ul class="space-y-1">
          <li v-for="tool in tools" :key="tool.id">
            <button class="nav-item w-full text-left flex items-center gap-3">
              <span class="text-lg">{{ tool.icon }}</span>
              <span>{{ tool.name }}</span>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- 设置菜单 -->
      <div class="mt-auto pt-6 border-t border-border-300">
        <button class="nav-item w-full text-left flex items-center gap-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
        
        <button class="nav-item w-full text-left flex items-center gap-3 mt-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Help & FAQ
        </button>
      </div>
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