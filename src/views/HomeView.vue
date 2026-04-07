<template>
  <div class="min-h-screen bg-[#f9f8f5] text-text-100">
    <!-- 左侧导航栏 -->
    <AppNavigation @sidebar-change="onSidebarChange" />

    <!-- 主内容区域 -->
    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-[800px] mx-auto px-6 pt-[140px] pb-8">
        <!-- 问候语区域 -->
        <div class="text-center mb-8">
          <h1 class="text-[32px] font-normal text-[#1a1a1a] flex items-center justify-center gap-3 leading-tight">
            <span class="text-[24px]" style="filter: grayscale(10%) brightness(1.05);">🌸</span>
            <span>Afternoon, <span class="font-semibold">Isharaoy Fullerjr</span></span>
          </h1>
        </div>

        <!-- 输入框区域 -->
        <div class="mb-6">
          <div class="relative bg-white border border-[#e0e0df] rounded-xl shadow-sm hover:border-[#cfcfce] transition-colors duration-200">
            <textarea
              v-model="userInput"
              class="w-full bg-transparent border-0 rounded-xl pt-4 pb-14 px-4 text-[16px] text-[#1a1a1a] placeholder-[#9b9a97] focus:outline-none resize-none min-h-[68px] max-h-[240px] leading-relaxed"
              placeholder="How can I help you today?"
              rows="1"
              @input="autoResize"
            ></textarea>

            <!-- 底部工具栏 - 左右分布布局 -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <!-- 左侧：附件按钮 -->
              <button
                v-if="!userInput"
                class="p-1.5 hover:bg-black/[0.04] rounded-md transition-colors duration-150 group"
                title="Attach file"
              >
                <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <!-- 右侧：模型选择器 + 语音 + 发送 -->
              <div class="flex items-center gap-0.5">
                <template v-if="!userInput">
                  <div class="flex items-center gap-1 px-2 py-1.5 hover:bg-black/[0.04] rounded-md cursor-pointer transition-colors duration-150 group">
                    <span class="text-[13px] text-[#787774] group-hover:text-[#5c5b58] leading-none tracking-tight">Sonnet 4.6</span>
                    <svg class="w-3 h-3 text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <button
                    class="p-1.5 hover:bg-black/[0.04] rounded-md transition-colors duration-150 group"
                    title="Voice input"
                  >
                    <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </template>

                <button
                  v-if="userInput"
                  class="px-3 py-1.5 bg-[#d97757] hover:bg-[#c96a4a] text-white rounded-lg transition-colors duration-150 text-[13px] font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷功能按钮 -->
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <button
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            class="px-3 py-[5px] border border-[#e0e0df] rounded-full text-[13px] text-[#787774] hover:text-[#5c5b58] hover:border-[#cfcfce] hover:bg-black/[0.03] transition-all duration-150 flex items-center gap-1.5 leading-none"
          >
            <component :is="'span'" v-html="shortcut.icon" class="inline-flex items-center"></component>
            {{ shortcut.label }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNavigation from '@/components/layout/AppNavigation.vue'

const userInput = ref('')
const isCollapsed = ref(false)

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}

const shortcuts = [
  {
    id: 1,
    label: 'Strategize',
    icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
  },
  {
    id: 2,
    label: 'Write',
    icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>'
  },
  {
    id: 3,
    label: 'Learn',
    icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>'
  },
  {
    id: 4,
    label: 'Code',
    icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>'
  },
  {
    id: 5,
    label: 'Life stuff',
    icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/></svg>'
  }
]

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 240) + 'px'
}
</script>
