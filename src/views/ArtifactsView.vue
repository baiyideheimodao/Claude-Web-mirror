<template>
  <div class="min-h-screen bg-[#f9f8f5] text-text-100">
    <AppNavigation @sidebar-change="onSidebarChange" />

    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-4xl mx-auto px-6 pt-6 pb-8">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-xl font-semibold text-[#1a1a1a]">制品</h1>
          <button
            class="px-3 py-1.5 bg-white border border-[#e0e0df] hover:border-[#cfcfce] rounded-lg transition-colors duration-150 text-[13px] font-medium flex items-center gap-1.5"
            @click="showCreateModal = true"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            新建制品
          </button>
        </div>

        <!-- Tab 切换 -->
        <div class="flex items-center gap-6 border-b border-[#e5e5e4] mb-6">
          <button :class="['pb-3 text-[14px] font-medium border-b-2 transition-colors', activeTab === 'featured' ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#9b9a97] hover:text-[#5c5b58]']" @click="activeTab = 'featured'">精选</button>
          <button :class="['pb-3 text-[14px] font-medium border-b-2 transition-colors', activeTab === 'yours' ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#9b9a97] hover:text-[#5c5b58]']" @click="activeTab = 'yours'">我的制品</button>
        </div>

        <!-- Artifact 列表/空状态 -->
        <div v-if="artifacts.length > 0" class="grid grid-cols-2 gap-4">
          <div v-for="artifact in artifacts" :key="artifact.id" class="bg-white border border-[#e5e5e4] rounded-lg p-4 hover:border-[#cfcfce] cursor-pointer group" @click="openArtifact(artifact)">
            <div class="flex items-center justify-between mb-2">
              <span :class="['inline-block px-2 py-0.5 rounded-full text-[11px] font-medium', getTypeColor(artifact.type)]">{{ artifact.type }}</span>
              <span class="text-[11px] text-[#cfcfce]">{{ formatTime(artifact.created_at) }}</span>
            </div>
            <p class="text-[13px] text-[#1a1a1a] line-clamp-2">{{ artifact.content.slice(0, 120) }}...</p>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-[#e0e0df] flex items-center justify-center">
            <svg class="w-7 h-7 text-[#cfcfce]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <p class="text-[15px] text-[#9b9a97] mb-1">暂无制品</p>
          <p class="text-[13px] text-[#cfcfce]">从对话中创建您的第一个制品。</p>
        </div>
      </div>
    </main>

    <!-- 创建Artifact弹窗 -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/30" @click.self="showCreateModal = false">
      <div class="bg-white rounded-xl shadow-claude-lg w-[600px] max-w-[90vw] p-6 relative max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[#1a1a1a]">Untitled</h2>
          <button class="p-1 hover:bg-black/[0.04] rounded" @click="showCreateModal = false">
            <svg class="w-5 h-5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <p class="text-[13px] text-[#787774] mb-5">开始创作吧！选择制品类别或从零开始构建。</p>

        <!-- 类型选择网格 -->
        <div class="grid grid-cols-3 gap-3 mb-4">
          <button
            v-for="cat in artifactCategories"
            :key="cat.id"
            :class="['flex flex-col items-center gap-2 p-4 rounded-lg border transition-all hover:border-[#d97757]/50 hover:bg-[#fafaf8]', selectedCategory === cat.id ? 'border-[#d97757] bg-[#fef8f5]' : 'border-[#e5e5e4]']"
            @click="selectedCategory = cat.id"
          >
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-[12px] font-medium text-[#5c5b58] text-center leading-tight">{{ cat.label }}</span>
            <component :is="'span'" v-html="cat.svgIcon" class="w-5 h-5 text-[#787774]"></component>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'

const router = useRouter()
const isCollapsed = ref(false)
const activeTab = ref('yours')
const showCreateModal = ref(false)
const selectedCategory = ref('')
const artifacts = ref<any[]>([])

// TODO: 从后端加载 artifacts

const artifactCategories = [
  { id: 'web', label: '应用与网站', icon: '🌐', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>' },
  { id: 'doc', label: '文档和模板', icon: '📄', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
  { id: 'game', label: '游戏', icon: '🎮', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M7 15l2-3 3 3 3-3 2 3"/><rect x="4" y="5" width="16" height="14" rx="2"/></svg>' },
  { id: 'tool', label: '效率工具', icon: '⚡', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
  { id: 'creative', label: '创意项目', icon: '💡', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
  { id: 'survey', label: '问卷或调查', icon: '📊', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
  { id: 'code', label: '从零开始', icon: '✨', svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m8.66-10l-5.2 3m-2.92 5.2l-5.2 3M2.34 6l5.2 3m2.92 5.2l5.2 3"/></svg>' },
]

const onSidebarChange = (collapsed: boolean) => { isCollapsed.value = collapsed }
const openArtifact = (artifact: any) => {}

const formatTime = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin}m`
  return `${Math.floor(diffMin / 60)}h`
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    code: 'bg-blue-50 text-blue-600',
    web: 'bg-green-50 text-green-600',
    mermaid: 'bg-purple-50 text-purple-600',
    doc: 'bg-orange-50 text-orange-600',
  }
  return colors[type] || 'bg-gray-50 text-gray-600'
}
</script>
