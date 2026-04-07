<template>
  <div class="bg-bg-200 border border-border-300 rounded-xl p-4 hover:border-border-200 transition-colors cursor-pointer h-full flex flex-col">
    <!-- 标题区域 -->
    <div class="mb-3">
      <h3 class="text-base font-medium text-text-100 mb-1">{{ title }}</h3>
      <p class="text-text-400 text-sm">{{ description }}</p>
    </div>
    
    <!-- 提示示例 -->
    <div class="flex-1 mb-3">
      <div class="bg-bg-300/50 rounded-lg p-3 border border-border-300">
        <p class="text-text-300 text-sm leading-relaxed">{{ prompt }}</p>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <button class="flex-1 text-sm text-text-300 hover:text-text-100 hover:bg-bg-300 rounded-lg py-1.5 transition-colors">
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