<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1f1f1e] text-[#1a1a1a] dark:text-gray-200">
    <AppNavigation :sidebar-width="sidebarWidth" @sidebar-change="onSidebarChange" />

    <main class="min-h-screen transition-all duration-200 ease-in-out" :style="{ marginLeft: sidebarWidth + 'px' }">
      <div class="max-w-4xl mx-auto px-6 pt-6 pb-8">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-xl font-semibold text-[#1a1a1a] dark:text-white">制品</h1>
          <button
            class="px-3 py-1.5 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 hover:border-[#cfcfce] dark:hover:border-white/20 rounded-lg transition-colors duration-150 text-[13px] font-medium flex items-center gap-1.5"
            @click="showCreateModal = true"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            新建制品
          </button>
        </div>

        <!-- Tab 切换 -->
        <div class="flex items-center gap-6 border-b border-[#e5e5e4] dark:border-white/10 mb-6">
          <button :class="['pb-3 text-[14px] font-medium border-b-2 transition-colors', activeTab === 'featured' ? 'border-[#1a1a1a] dark:border-white text-[#1a1a1a] dark:text-white' : 'border-transparent text-[#9b9a97] dark:text-gray-500 hover:text-[#5c5b58] dark:hover:text-gray-400']" @click="activeTab = 'featured'">精选</button>
          <button :class="['pb-3 text-[14px] font-medium border-b-2 transition-colors', activeTab === 'yours' ? 'border-[#1a1a1a] dark:border-white text-[#1a1a1a] dark:text-white' : 'border-transparent text-[#9b9a97] dark:text-gray-500 hover:text-[#5c5b58] dark:hover:text-gray-400']" @click="activeTab = 'yours'">我的制品</button>
        </div>

        <!-- Artifact 列表/空状态 -->
        <div v-if="artifacts.length > 0" class="grid grid-cols-2 gap-4">
          <div v-for="artifact in artifacts" :key="artifact.id" class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg p-4 hover:border-[#cfcfce] dark:hover:border-white/20 cursor-pointer group" @click="openArtifact(artifact)">
            <div class="flex items-center justify-between mb-2">
              <span :class="['inline-block px-2 py-0.5 rounded-full text-[11px] font-medium', getTypeColor(artifact.type)]">{{ artifact.type }}</span>
              <span class="text-[11px] text-[#cfcfce] dark:text-gray-500">{{ formatTime(artifact.created_at) }}</span>
            </div>
            <p class="text-[13px] text-[#1a1a1a] dark:text-white line-clamp-2">{{ artifact.content.slice(0, 120) }}...</p>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-[#e0e0df] dark:border-white/10 flex items-center justify-center">
            <svg class="w-7 h-7 text-[#cfcfce] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <p class="text-[15px] text-[#9b9a97] dark:text-gray-500 mb-1">暂无制品</p>
          <p class="text-[13px] text-[#cfcfce] dark:text-gray-500">点击「新建制品」开始创作。</p>
        </div>
      </div>
    </main>

    <!-- 创建Artifact弹窗 - 第一步：选择类别 -->
    <div v-if="showCreateModal && !isCreating" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/30" @click.self="showCreateModal = false">
      <div class="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-claude-lg w-[600px] max-w-[90vw] p-6 relative max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[#1a1a1a] dark:text-white">新建制品</h2>
          <button class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded" @click="showCreateModal = false">
            <svg class="w-5 h-5 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <p class="text-[13px] text-[#787774] dark:text-gray-400 mb-5">选择制品类别，AI 将引导您完成创建。</p>

        <!-- 类型选择网格 -->
        <div class="grid grid-cols-3 gap-3 mb-5">
          <button
            v-for="cat in artifactCategories"
            :key="cat.id"
            :class="['flex flex-col items-center gap-2 p-4 rounded-lg border transition-all hover:border-[#d97757]/50 hover:bg-[#fafaf8] dark:hover:bg-white/5', selectedCategory === cat.id ? 'border-[#d97757] bg-[#fef8f5] dark:bg-[#d97757]/10' : 'border-[#e5e5e4] dark:border-white/10']"
            @click="selectedCategory = cat.id"
          >
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-[12px] font-medium text-[#5c5b58] dark:text-gray-400 text-center leading-tight">{{ cat.label }}</span>
          </button>
        </div>

        <button
          :disabled="!selectedCategory"
          class="w-full py-2.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed dark:disabled:bg-gray-300 text-white rounded-lg text-[14px] font-medium transition-colors"
          @click="handleCreateArtifact"
        >
          开始创建
        </button>
      </div>
    </div>

    <!-- 创建中状态 -->
    <div v-if="isCreating" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div class="bg-white dark:bg-[#2a2a2a] rounded-xl p-8 flex flex-col items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2.5 h-2.5 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2.5 h-2.5 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
        <p class="text-[14px] text-[#5c5b58] dark:text-gray-400">正在创建制品对话...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'

const router = useRouter()
const appStore = useAppStore()
const isCollapsed = ref(false)
const sidebarWidth = ref(288)
const activeTab = ref('yours')
const showCreateModal = ref(false)
const selectedCategory = ref('')
const isCreating = ref(false)

// 使用 store 中的 artifacts 数据
const artifacts = computed(() => appStore.artifacts)

const artifactCategories = [
  { id: 'web', label: '应用与网站', icon: '🌐' },
  { id: 'doc', label: '文档和模板', icon: '📄' },
  { id: 'game', label: '游戏', icon: '🎮' },
  { id: 'tool', label: '效率工具', icon: '⚡' },
  { id: 'creative', label: '创意项目', icon: '💡' },
  { id: 'survey', label: '问卷或调查', icon: '📊' },
  { id: 'code', label: '从零开始', icon: '✨' },
]

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
  sidebarWidth.value = collapsed ? 48 : 288
}

const openArtifact = (artifact: any) => {
  // 如果有关联的对话，跳转到聊天页
  if (artifact.dialog_id) {
    router.push(`/chat/${artifact.dialog_id}`)
  }
}

/** 页面加载时刷新制品列表 */
onMounted(async () => {
  await appStore.fetchArtifacts()
})

/** 创建制品对话并跳转到聊天页面 */
const handleCreateArtifact = async () => {
  if (!selectedCategory.value || isCreating.value) return
  isCreating.value = true

  try {
    const cat = artifactCategories.find(c => c.id === selectedCategory.value)
    const dialog = await appStore.createDialog(`制品：${cat?.label || '新制品'}`)
    if (!dialog) {
      isCreating.value = false
      return
    }

    // 跳转到聊天页，带上 artifact_type 查询参数，AI 会引导用户
    router.push({
      path: `/chat/${dialog.id}`,
      query: { artifact_type: selectedCategory.value }
    })
  } catch (e) {
    console.error('创建制品对话失败:', e)
  } finally {
    isCreating.value = false
    showCreateModal.value = false
  }
}

const formatTime = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin}m`
  return `${Math.floor(diffMin / 60)}h`
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    code: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    web: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    doc: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    game: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    tool: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    creative: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    survey: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  }
  return colors[type] || 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
}
</script>
