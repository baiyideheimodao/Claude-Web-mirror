<template>
  <div class="bg-bg-000 border border-border-300 rounded-xl p-4 hover:border-border-200 hover:shadow-claude-soft transition-all duration-300 cursor-pointer h-full">
    <!-- 图标区域 -->
    <div class="mb-3">
      <div class="w-10 h-10 rounded-lg bg-bg-300/50 flex items-center justify-center text-lg">
        {{ icon }}
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div>
      <h3 class="text-base font-medium text-text-100 mb-1">{{ title }}</h3>
      <p class="text-text-400 text-sm leading-relaxed">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>