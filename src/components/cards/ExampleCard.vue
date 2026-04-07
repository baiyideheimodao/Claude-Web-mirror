<template>
  <div class="bg-bg-000 border border-border-300 rounded-xl p-4 hover:border-border-200 hover:shadow-claude-soft transition-all duration-300 cursor-pointer h-full flex flex-col">
    <!-- 标题区域 -->
    <div class="mb-3">
      <h3 class="text-base font-medium text-text-100 mb-1">{{ title }}</h3>
      <p class="text-text-400 text-sm">{{ description }}</p>
    </div>
    
    <!-- 提示示例 -->
    <div class="flex-1 mb-3">
      <div class="bg-bg-200 rounded-lg p-3 border border-border-300">
        <p class="text-text-300 text-sm leading-relaxed">{{ prompt }}</p>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <button class="flex-1 text-sm text-text-400 hover:text-text-100 hover:bg-bg-300 rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy
      </button>
      <button class="flex-1 text-sm bg-brand-100 hover:bg-brand-200 text-white rounded-lg py-1.5 transition-colors">
        Try it
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  prompt: string
}>()
</script>