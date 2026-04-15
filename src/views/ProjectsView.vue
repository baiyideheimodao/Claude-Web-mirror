<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1f1f1e] text-[#1a1a1a] dark:text-gray-200">
    <AppNavigation @sidebar-change="onSidebarChange" />

    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[288px]']">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-8">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-xl font-semibold text-[#1a1a1a] dark:text-white">项目</h1>
          <button
            class="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-[#1a1a1a] rounded-lg transition-colors duration-150 text-[13px] font-medium flex items-center gap-1.5"
            @click="showCreateModal = true"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            新建项目
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="relative mb-4">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] dark:placeholder-gray-500 focus:outline-none focus:border-[#d97757] transition-all"
            placeholder="搜索项目..."
          />
        </div>

        <!-- 排序 -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-[13px] text-[#787774] dark:text-gray-400">{{ filteredProjects.length }} 个项目</p>
          <div class="flex items-center gap-1 text-[13px] text-[#787774] dark:text-gray-400">
            <span>排序方式</span>
            <select v-model="sortBy" class="border-none bg-transparent text-[13px] text-[#5c5b58] dark:text-gray-400 cursor-pointer focus:outline-none">
              <option value="updated">最近活动</option>
              <option value="name">名称</option>
              <option value="created">创建时间</option>
            </select>
            <svg class="w-3 h-3 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <!-- 项目列表 -->
        <div v-if="filteredProjects.length > 0" class="space-y-2">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg p-4 hover:border-[#cfcfce] dark:hover:border-white/20 cursor-pointer transition-colors group"
            @click="openProject(project)"
          >
            <h3 class="text-[14px] font-medium text-[#1a1a1a] dark:text-white">{{ project.name }}</h3>
            <p class="text-[13px] text-[#787774] dark:text-gray-400 mt-1 line-clamp-2">{{ project.description || '暂无描述' }}</p>
            <p class="text-[11px] text-[#cfcfce] dark:text-gray-500 mt-2">{{ formatTime(project.updated_at || project.created_at) }}前更新</p>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <p class="text-[15px] text-[#9b9a97] dark:text-gray-500 mb-1">暂无项目</p>
          <p class="text-[13px] text-[#cfcfce] dark:text-gray-500">创建项目来管理您的对话。</p>
          <button class="mt-4 px-4 py-2 bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] dark:disabled:bg-gray-300 text-white rounded-lg text-[13px]" @click="showCreateModal = true">创建第一个项目</button>
        </div>
      </div>
    </main>

    <!-- 创建项目弹窗 -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30" @click.self="showCreateModal = false">
      <div class="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-claude-lg w-[480px] max-w-[90vw] p-6 relative">
        <h2 class="text-xl font-semibold text-[#1a1a1a] dark:text-white mb-4">创建个人项目</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">您在做什么？</label>
            <input
              v-model="createForm.name"
              type="text"
              class="w-full px-3 py-2 border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white focus:outline-none focus:border-[#d97757]"
              placeholder="为您的项目命名"
            />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">您想达成什么目标？</label>
            <textarea
              v-model="createForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white resize-none focus:outline-none focus:border-[#d97757]"
              placeholder="描述您的项目、目标、主题等..."
            ></textarea>
          </div>
          <p v-if="createError" class="text-[13px] text-red-500">{{ createError }}</p>
          <div class="flex justify-end gap-2">
            <button class="px-4 py-2 text-[13px] text-[#5c5b58] dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-lg transition-colors" @click="showCreateModal = false">取消</button>
            <button
              :disabled="!createForm.name.trim()"
              class="px-4 py-2 bg-[#1a1a1a] dark:bg-white disabled:bg-[#cfcfce] dark:disabled:bg-gray-200 text-white dark:text-[#1a1a1a] rounded-lg text-[13px] font-medium transition-colors"
              @click="handleCreateProject"
            >创建项目</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { projectApi } from '@/api/project'

const router = useRouter()
const appStore = useAppStore()

const isCollapsed = ref(false)
const searchQuery = ref('')
const sortBy = ref('updated')
const showCreateModal = ref(false)
const createError = ref('')
const createForm = ref({ name: '', description: '' })

// 本地项目列表（从API获取）
const projects = ref<any[]>([])

const loadProjects = async () => {
  try {
    const res = await projectApi.getList()
    if (res.success && res.data) {
      const payload = (res.data as any).data || res.data
      projects.value = Array.isArray(payload) ? payload : []
    }
  } catch (e) {
    console.error('加载项目列表失败:', e)
  }
}

onMounted(() => { loadProjects() })

const filteredProjects = computed(() => {
  let result = [...projects.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
  }
  // sort
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    const timeA = new Date(a.updated_at || a.created_at).getTime()
    const timeB = new Date(b.updated_at || b.created_at).getTime()
    return timeB - timeA
  })
  return result
})

const onSidebarChange = (collapsed: boolean) => { isCollapsed.value = collapsed }

const openProject = (project: any) => router.push(`/project/${project.id}`)

const handleCreateProject = async () => {
  if (!createForm.value.name.trim()) return
  createError.value = ''
  try {
    const res = await projectApi.create({ name: createForm.value.name, description: createForm.value.description })
    if (res.success && res.data) {
      projects.value.unshift(res.data as any)
      showCreateModal.value = false
      createForm.value = { name: '', description: '' }
      router.push(`/project/${(res.data as any).id}`)
    } else {
      createError.value = res.message || '创建失败'
    }
  } catch (e: any) {
    createError.value = e.message || '创建失败'
  }
}

const formatTime = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟`
  const diffHr = Math.floor(diffMs / 60)
  if (diffHr < 24) return `${diffHr}小时`
  const diffDy = Math.floor(diffHr / 24)
  return `${diffDy}天`
}
</script>
