<template>
  <div class="card-base card-hover h-full flex flex-col">
    <!-- 图标区域 -->
    <div class="mb-4">
      <div class="w-12 h-12 rounded-lg bg-bg-300 flex items-center justify-center text-2xl">
        {{ icon }}
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-text-100 mb-2">{{ title }}</h3>
      <p class="text-text-400 text-sm leading-relaxed">{{ description }}</p>
    </div>
    
    <!-- 底部链接 -->
    <div class="mt-6 pt-4 border-t border-border-300">
      <button class="btn-text text-sm flex items-center gap-1">
        Try it
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
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