<template>
  <div class="min-h-screen bg-[#f9f8f5] text-text-100">
    <AppNavigation @sidebar-change="onSidebarChange" />

    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-4xl mx-auto px-6 pt-6 pb-32">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-xl font-semibold text-[#1a1a1a]">代码</h1>
        </div>

        <!-- 工具选择 -->
        <div class="mb-6">
          <select v-model="selectedTool" class="px-3 py-1.5 bg-white border border-[#e0e0df] rounded-lg text-[13px] focus:outline-none focus:border-[#d97757]">
            <option value="generate">生成代码</option>
            <option value="debug">调试代码</option>
            <option value="project">生成项目骨架</option>
            <option value="explain">解释代码</option>
          </select>
        </div>

        <!-- Generate Code 面板 -->
        <div v-if="selectedTool === 'generate'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white border border-[#e5e5e4] rounded-lg p-4">
              <label class="block text-[13px] font-medium text-[#5c5b58] mb-2">语言</label>
              <select v-model="genForm.language" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[13px] focus:outline-none focus:border-[#d97757]">
                <option value="javascript">JavaScript / TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="sql">SQL</option>
                <option value="shell">Shell/Bash</option>
              </select>
            </div>
            <div class="bg-white border border-[#e5e5e4] rounded-lg p-4">
              <label class="block text-[13px] font-medium text-[#5c5b58] mb-2">描述</label>
              <textarea v-model="genForm.requirement" rows="4" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[13px] resize-none focus:outline-none focus:border-[#d97757]" placeholder="描述您希望代码做什么..."></textarea>
            </div>
          </div>
          <button :disabled="!genForm.requirement.trim() || isGenerating" class="px-4 py-2 bg-[#d97757] disabled:bg-[#cfcfce] text-white rounded-lg text-[13px] font-medium" @click="handleGenerate">
            {{ isGenerating ? '生成中...' : '生成代码' }}
          </button>
        </div>

        <!-- Debug Code 面板 -->
        <div v-else-if="selectedTool === 'debug'" class="space-y-4">
          <div class="bg-white border border-[#e5e5e4] rounded-lg p-4">
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-2">粘贴有错误的代码</label>
            <textarea v-model="debugForm.code" rows="8" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[13px] font-mono resize-none focus:outline-none focus:border-[#d97757]"             placeholder="在此粘贴代码..."></textarea>
          </div>
          <div class="bg-white border border-[#e5e5e4] rounded-lg p-4">
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-2">错误信息</label>
            <textarea v-model="debugForm.error" rows="3" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[13px] font-mono resize-none focus:outline-none focus:border-[#d97757]" placeholder="Paste the error message..."></textarea>
          </div>
          <button :disabled="!debugForm.code.trim() || isGenerating" class="px-4 py-2 bg-[#d97757] disabled:bg-[#cfcfce] text-white rounded-lg text-[13px] font-medium" @click="handleDebug">
            {{ isGenerating ? '分析中...' : '调试代码' }}
          </button>
        </div>

        <!-- Project 面板 -->
        <div v-else-if="selectedTool === 'project'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white border border-[#e5e5e4] rounded-lg p-4">
              <label class="block text-[13px] font-medium text-[#5c5b58] mb-2">项目名称</label>
              <input v-model="projectForm.name" type="text" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[13px] focus:outline-none focus:border-[#d97757]" placeholder="My Project" />
            </div>
            <div class="bg-white border border-[#e5e5e4] rounded-lg p-4">
              <label class="block text-[13px] font-medium text-[#5c5b58] mb-2">需求</label>
              <textarea v-model="projectForm.requirement" rows="4" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[13px] resize-none focus:outline-none focus:border-[#d97757]" placeholder="描述项目应实现的功能..."></textarea>
            </div>
          </div>
          <button :disabled="!projectForm.name.trim() || isGenerating" class="px-4 py-2 bg-[#d97757] disabled:bg-[#cfcfce] text-white rounded-lg text-[13px] font-medium" @click="handleProjectGen">
            {{ isGenerating ? '生成中...' : '生成项目' }}
          </button>
        </div>

        <!-- 结果展示区域 -->
        <div v-if="result" class="mt-6 bg-white border border-[#e5e5e4] rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2.5 border-b border-[#e5e5e4] bg-[#fafaf8]">
            <span class="text-[13px] font-medium text-[#1a1a1a]">{{ resultTitle }}</span>
            <div class="flex items-center gap-2">
              <select v-model="resultLanguage" v-if="selectedTool === 'generate'" class="text-[12px] border border-[#e0e0df] rounded px-2 py-1 bg-white">
                <option>JavaScript</option><option>TypeScript</option><option>Python</option><option>Go</option>
              </select>
              <button class="px-3 py-1 bg-[#1a1a1a] text-white rounded text-[12px]" @click="handleCopyResult">复制</button>
              <button class="p-1 hover:bg-black/[0.04] rounded" title="Publish" @click="handlePublish">
                <svg class="w-4 h-4 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              </button>
              <button class="p-1 hover:bg-black/[0.04] rounded" title="Close" @click="result = ''">
                <svg class="w-4 h-4 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <div class="p-4 overflow-x-auto">
            <pre class="font-mono text-[13px] text-[#1a1a1a] whitespace-pre-wrap leading-relaxed">{{ result }}</pre>
          </div>
        </div>

        <!-- Debug 结果 -->
        <div v-if="debugResult" class="mt-6 space-y-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 class="text-[13px] font-semibold text-red-700 mb-1">原因</h3>
            <p class="text-[13px] text-red-600">{{ debugResult.cause }}</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 class="text-[13px] font-semibold text-green-700 mb-1">修复后的代码</h3>
            <pre class="font-mono text-[13px] text-green-800 mt-2 whitespace-pre-wrap overflow-x-auto">{{ debugResult.fixed_code }}</pre>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-[13px] font-semibold text-blue-700 mb-1">建议</h3>
            <p class="text-[13px] text-blue-600">{{ debugResult.suggestion }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { agentApi } from '@/api/agent'

const isCollapsed = ref(false)
const selectedTool = ref('generate')
const isGenerating = ref(false)

const genForm = ref({ language: 'javascript', requirement: '' })
const debugForm = ref({ code: '', error: '' })
const projectForm = ref({ name: '', requirement: '' })

const result = ref('')
const resultTitle = ref('Generated Code')
const resultLanguage = ref('JavaScript')
const debugResult = ref<{ cause: string; fixed_code: string; suggestion: string } | null>(null)

const onSidebarChange = (collapsed: boolean) => { isCollapsed.value = collapsed }

const handleGenerate = async () => {
  if (!genForm.value.requirement.trim()) return
  isGenerating.value = true
  try {
    const res = await agentApi.generateCode({
      language: genForm.value.language as any,
      requirement: genForm.value.requirement,
    })
    if (res.success && res.data) {
      result.value = (res.data as any).code
      resultTitle.value = `Generated ${genForm.value.language.charAt(0).toUpperCase() + genForm.value.language.slice(1)} Code`
    }
  } catch (e: any) {
    result.value = `Error: ${e.message}`
  } finally {
    isGenerating.value = false
  }
}

const handleDebug = async () => {
  if (!debugForm.value.code.trim()) return
  isGenerating.value = true
  try {
    const res = await agentApi.debugCode({
      code: debugForm.value.code,
      error_message: debugForm.value.error,
    })
    if (res.success && res.data) {
      debugResult.value = res.data as any
    }
  } catch (e: any) {
    debugResult.value = { cause: e.message, fixed_code: '', suggestion: 'Please check your code again.' }
  } finally {
    isGenerating.value = false
  }
}

const handleProjectGen = async () => {
  if (!projectForm.value.name.trim()) return
  isGenerating.value = true
  try {
    const res = await agentApi.generateProject({
      project_name: projectForm.value.name,
      requirement: projectForm.value.requirement,
    })
    if (res.success && res.data) {
      const data = res.data as any
      result.value = `Directory Structure:\n${data.directory_structure}\n\nFiles:\n${data.files.map((f: any) => `--- ${f.path} ---\n${f.content}`).join('\n\n')}`
      resultTitle.value = `Project: ${projectForm.value.name}`
    }
  } catch (e: any) {
    result.value = `Error: ${e.message}`
  } finally {
    isGenerating.value = false
  }
}

const handleCopyResult = () => {
  navigator.clipboard.writeText(result.value).then(() => {
    // toast copied
  })
}

const handlePublish = () => {
  // publish to artifact
}
</script>
