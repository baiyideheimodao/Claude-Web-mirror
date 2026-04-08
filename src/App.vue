<template>
  <div id="app" class="min-h-screen bg-[#f9f8f5] dark:bg-[#1a1a1a] text-text-100 antialiased transition-colors duration-200" :class="{ 'dark': appStore.isDarkMode }">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()
</script>
