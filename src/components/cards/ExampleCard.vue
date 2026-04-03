<template>
  <div class="card-base card-hover h-full flex flex-col">
    <!-- 标题区域 -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-text-100 mb-1">{{ title }}</h3>
      <p class="text-text-400 text-sm">{{ description }}</p>
    </div>
    
    <!-- 提示示例 -->
    <div class="flex-1 mb-4">
      <div class="bg-bg-200 rounded-lg p-3">
        <p class="text-text-300 text-sm font-mono leading-relaxed">{{ prompt }}</p>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <button class="btn-secondary flex-1 text-sm">Copy</button>
      <button class="btn-primary flex-1 text-sm">Try it</button>
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