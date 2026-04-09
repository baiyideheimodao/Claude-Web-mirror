<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1a1a1a] text-text-100">
    <!-- 左侧导航栏 -->
    <AppNavigation @sidebar-change="onSidebarChange" />

    <!-- 主聊天区域 -->
    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-24">
        <!-- 对话标题栏 + 返回按钮 -->
        <div v-if="dialogDetail" class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <button
              v-if="!dialogId || messages.length === 0"
              class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors text-[13px] text-[#787774] flex items-center gap-1"
              @click="$router.push('/chats')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              {{ dialogDetail.title }}
            </button>
            <h1 v-else class="text-xl font-semibold text-[#1a1a1a] dark:text-white truncate flex items-center gap-2">
              {{ dialogDetail.title }}
              <button class="p-1 hover:bg-black/[0.04] rounded opacity-60 hover:opacity-100 transition-opacity" title="编辑标题">
                <svg class="w-3.5 h-3.5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
            </h1>
          </div>

          <div class="flex items-center gap-1">
            <!-- 模型切换（在标题栏右侧） -->
            <div
              v-click-outside="() => showModelMenu = false"
              class="flex items-center gap-1 px-2 py-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded cursor-pointer relative"
              @click="showModelMenu = !showModelMenu"
            >
              <span class="text-[12px] text-[#787774]">{{ appStore.currentModel?.name || 'Sonnet 4d' }}</span>
              <svg class="w-3 h-3 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              <Transition name="dropdown">
                <div v-if="showModelMenu" class="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-lg shadow-claude-md py-1 z-50">
                  <button v-for="model in appStore.models" :key="model.id" class="w-full px-3 py-1.5 text-left text-[12px] flex justify-between hover:bg-black/[0.04] dark:hover:bg-white/5" :class="model.id === appStore.currentModel?.id ? 'text-[#d97757]' : ''" @click.stop="handleSwitchModel(model)">{{ model.name }}</button>
                </div>
              </Transition>
            </div>

            <button class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group" title="分享" @click="handleShare">
              <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            </button>
            <button class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group" title="删除对话" @click="handleDeleteDialog">
              <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <!-- 消息列表区域 -->
        <div class="space-y-6 mb-32">
          <!-- 空状态：无对话时提示 -->
          <div v-if="!dialogId || (!messages.length && !isSending)" class="text-center py-20">
            <p class="text-[15px] text-[#9b9a97]">开始新对话</p>
          </div>

          <!-- 消息列表 -->
          <template v-for="(msg, index) in messages" :key="msg.id">
            <!-- 用户消息 -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="max-w-[80%] bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-2xl rounded-tr-md p-4 shadow-sm">
                <p class="text-[15px] text-[#1a1a1a] dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                <p class="text-[11px] text-[#9b9a97] mt-2 text-right">{{ formatTime(msg.timestamp) }}</p>
              </div>
            </div>

            <!-- AI 消息 -->
            <div v-else class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center shrink-0 mt-1">
                <span class="text-white text-sm font-bold">C</span>
              </div>
              <div class="max-w-[80%] bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-2xl rounded-tl-md p-4 shadow-sm">
                <!-- AI消息内容 -->
                <div class="text-[15px] text-[#1a1a1a] dark:text-gray-200 leading-relaxed prose-sm dark:prose-invert max-w-none" v-html="renderContent(msg.content)"></div>

                <!-- 选项卡片面板 - 从消息内容中提取 [QUESTION]+[CHOICE] 块渲染为独立面板 -->
                <div v-if="(() => { console.log('[DEBUG] msg.id:', msg.id); console.log('[DEBUG] raw content:', JSON.stringify(msg.content)); console.log('[DEBUG] parsed panel:', JSON.stringify(getChoicePanel(msg.content))); return true; })()" class="hidden"></div>
                <div v-if="getChoicePanel(msg.content) && !closedPanels[msg.id]" class="mt-4">
                  <div class="choice-panel">
                    <!-- 面板标题问题 -->
                    <div class="choice-panel-header">
                      <span class="choice-panel-title">{{ getChoicePanel(msg.content)?.question }}</span>
                      <button class="choice-panel-close" @click="closedPanels[msg.id] = true" title="关闭">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>

                    <!-- 编号选项列表 -->
                    <div class="choice-panel-list">
                      <button
                        v-for="(choice, ci) in getChoicePanel(msg.content)!.choices"
                        :key="ci"
                        :class="['choice-panel-item', selectedChoices[msg.id] === ci ? 'choice-panel-item-active' : '']"
                        @click="handleSelectChoice(msg.id, ci, choice)"
                      >
                        <span class="choice-panel-num">{{ ci + 1 }}</span>
                        <span>{{ choice }}</span>
                      </button>
                    </div>

                    <!-- 底部：跳过按钮 -->
                    <div class="choice-panel-footer">
                      <button class="choice-skip-btn" @click="handleSkipChoice(msg.id)">
                        Skip
                      </button>
                    </div>
                  </div>
                </div>

                <!-- AI消息底部操作栏 -->
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-[#f0ede7] dark:border-white/5">
                  <div class="flex items-center gap-1">
                    <p class="text-[11px] text-[#9b9a97] mr-2">{{ formatTime(msg.timestamp) }}</p>
                    <!-- 复制按钮 -->
                    <button class="action-btn" title="复制" @click="handleCopy(msg.content)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <!-- 点赞/踩 -->
                    <button class="action-btn" title="好的回复">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                    </button>
                    <button class="action-btn" title="不好的回复">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-5 10h-2m0 0a2 2 0 01-2-2v-6m2 2v4"/></svg>
                    </button>
                    <!-- 转发 -->
                    <button class="action-btn" title="转发">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </button>
                  </div>

                  <!-- 重新生成按钮 (最后一条AI消息) -->
                  <button
                    v-if="index === messages.length - 1 && msg.role === 'ai'"
                    class="action-btn"
                    title="重新生成"
                    :disabled="isSending"
                    @click="handleRegenerate(msg.id)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- 发送中状态 / 停止生成按钮 -->
          <div v-if="isSending" class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center shrink-0 mt-1">
              <span class="text-white text-sm font-bold">C</span>
            </div>
            <div class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm min-w-[200px]">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-2 h-2 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 bg-[#d97757] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                </div>
                <button
                  v-if="messages.length > 0 && messages[messages.length - 1].role === 'ai'"
                  class="ml-auto px-3 py-1 text-xs bg-[#1a1a1a] text-white rounded-md hover:bg-[#333] transition-colors"
                  @click="handleStopGeneration"
                >停止生成</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部输入框 - 固定在底部 -->
        <div class="fixed bottom-6 left-0 right-0 z-40" :style="{ marginLeft: isCollapsed ? '48px' : '260px', transition: 'margin-left 200ms ease-in-out' }">
          <div class="max-w-3xl mx-auto px-6">
            <!-- "Want to be notified when Claude responds?" 提示条 -->
            <div v-if="showNotifyBar" class="mb-3 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg shadow-sm">
              <span class="text-[13px] text-[#1a1a1a] dark:text-white">当 Claude 回复完成时需要通知吗？</span>
              <button class="px-3 py-1 bg-[#1a1a1a] text-white rounded text-[12px] font-medium hover:bg-[#333]" @click="showNotifyBar = false">通知我</button>
              <button class="p-1 text-[#9b9a97] hover:text-[#5c5b58]" @click="showNotifyBar = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-claude-md hover:border-[#cfcfce] dark:hover:border-white/20 transition-colors duration-200">
              <textarea
                ref="inputRef"
                v-model="messageInput"
                rows="1"
                class="w-full bg-transparent border-0 rounded-xl pt-4 pb-14 px-4 text-[15px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] focus:outline-none resize-none min-h-[56px] max-h-[200px] leading-relaxed"
                placeholder="给 Claude 发消息..."
                @input="autoResize"
                @keydown.enter.exact.prevent="handleSend"
              ></textarea>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                <label class="p-1.5 mr-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group cursor-pointer" title="附件">
                  <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" class="hidden" accept="image/*,.pdf,.txt,.md,.doc,.docx" multiple @change="handleFileUpload" />
                </label>

                <button
                  :disabled="isSending || !messageInput.trim()"
                  class="px-4 py-1.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[13px] font-medium ml-2"
                  @click="handleSend"
                >
                  {{ isSending ? '...' : '发送' }}
                </button>
              </div>
            </div>

            <p class="text-center text-[11px] text-[#cfcfce] mt-2">
              Claude 可能会出错。请核实重要信息。
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { dialogApi } from '@/api/dialog'
import { fileApi } from '@/api/file'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const messageInput = ref('')
const isCollapsed = ref(false)
const isSending = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const showModelMenu = ref(false)
const showNotifyBar = ref(false)
const selectedChoices = reactive<Record<string, number>>({})
const closedPanels = reactive<Record<string, boolean>>({})

const dialogId = computed(() => route.params.id as string | undefined)
const messages = computed(() => appStore.messages)
const dialogDetail = computed(() => appStore.currentDialogDetail)

// 制品模式：从 query 中读取 artifact_type
const artifactType = computed(() => route.query.artifact_type as string | undefined)

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}

// 加载对话详情
const loadDialog = async (id: string) => {
  if (!id) return
  await appStore.openDialog(id)
}

// 制品模式：保存 artifact_type 到本地变量（避免 router.replace 后丢失）
const savedArtifactType = ref<string | undefined>(undefined)

// 如果URL有query参数 msg 或 artifact_type，自动发送
watch(dialogId, async (newId) => {
  if (newId) {
    await loadDialog(newId)
    const msg = route.query.msg as string
    if (msg) {
      messageInput.value = msg
      setTimeout(() => handleSend(), 300)
      router.replace({ path: `/chat/${newId}` })
    } else if (artifactType.value) {
      // 制品模式：先保存到本地变量，再清除 query
      savedArtifactType.value = artifactType.value
      const typeLabel: Record<string, string> = {
        web: '应用与网站',
        doc: '文档和模板',
        game: '游戏',
        tool: '效率工具',
        creative: '创意项目',
        survey: '问卷或调查',
        code: '从零开始'
      }
      messageInput.value = `我想创建一个「${typeLabel[savedArtifactType.value] || savedArtifactType.value}」类型的制品`
      // 清除 query 参数，避免刷新时重复发送（artifact_type 已保存到 savedArtifactType）
      router.replace({ path: `/chat/${newId}` })
      setTimeout(() => handleSend(), 300)
    }
  }
}, { immediate: true })

/** 从 AI 消息内容中提取选项面板数据 { question, choices[] } */
const getChoicePanel = (content: string): { question: string; choices: string[] } | null => {
  // 匹配 [QUESTION]...[/QUESTION] 后面紧跟的 [CHOICE]...[/CHOICE] 块
  const qMatch = content.match(/\[QUESTION\](.*?)\[\/QUESTION\]/s)
  if (!qMatch) return null
  const question = qMatch[1].trim()
  const choiceMatches = content.match(/\[CHOICE\](.*?)\[\/CHOICE\]/gs)
  const choices = choiceMatches ? choiceMatches.map(m => m.replace(/\[CHOICE\]/g, '').replace(/\[\/CHOICE\]/g, '').trim()) : []
  if (choices.length === 0) return null
  return { question, choices }
}

/** 渲染消息内容时，移除 [QUESTION] 和 [CHOICE] 标签块 */
const renderContent = (content: string): string => {
  if (!content) return ''
  // 先移除 [QUESTION]...[/QUESTION] 块
  let html = content.replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '').trim()
  // 再移除 [CHOICE]...[/CHOICE] 块
  html = html.replace(/\[CHOICE\][\s\S]*?\[\/CHOICE\]/g, '').trim()

  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 代码块 (```language\n...\n```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-[#f5f4f0] dark:bg-[#1a1a1a] rounded-lg p-3 my-3 overflow-x-auto font-mono text-[13px] border border-[#eee] dark:border-white/5"><code>${code}</code></pre>`
  })

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#f5f4f0] dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[13px]">$1</code>')

  // 粗体/斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 链接
  html = html.replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#d97757] underline hover:no-underline">$1</a>')

  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2 border border-[#e5e5e4]" />')

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h4 class="font-semibold text-[15px] mt-3 mb-1">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 class="font-semibold text-base mt-3 mb-1">$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2 class="font-semibold text-lg mt-4 mb-2">$1</h2>')

  // 无序列表
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="list-disc ml-5 my-0.5">$1</li>')

  // 分割线
  html = html.replace(/^---$/gm, '<hr class="border-[#e5e5e4] my-4" />')

  // 引用块
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-[#d97757]/30 pl-3 my-2 text-[#5c5b58] italic">$1</blockquote>')

  return html
}

/** 用户点击选项卡片 */
const handleSelectChoice = async (msgId: string, choiceIndex: number, choiceText: string) => {
  selectedChoices[msgId] = choiceIndex
  const id = dialogId.value
  if (!id || isSending.value) return
  messageInput.value = choiceText
  await handleSend()
}

/** 用户点击跳过按钮 */
const handleSkipChoice = async (msgId: string) => {
  selectedChoices[msgId] = -1 // 标记为已跳过
  const id = dialogId.value
  if (!id || isSending.value) return
  messageInput.value = '跳过此问题'
  await handleSend()
}

/** 发送消息 */
const handleSend = async () => {
  const content = messageInput.value.trim()
  const id = dialogId.value

  if (!content || !id || isSending.value) return

  isSending.value = true
  try {
    // 使用 savedArtifactType（制品模式保存的值）或 route.query 中的 artifact_type
    const effectiveArtifactType = savedArtifactType.value || (route.query.artifact_type as string) || undefined
    console.log('[DEBUG] sending with artifactType:', effectiveArtifactType)
    const res = await dialogApi.sendMessage(id, content, undefined, effectiveArtifactType)

    if (res.success && res.data) {
      await appStore.openDialog(id)
      showNotifyBar.value = true
    } else {
      // fallback回复
      appStore.messages.push({
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: res.message || '抱歉，处理您的请求时出现错误。',
        timestamp: new Date().toISOString(),
        status: 'sent',
        parent_id: null,
        version: 1,
      })
    }

    // 刷新对话列表以更新标题
    await appStore.fetchDialogList()
    messageInput.value = ''
    autoResizeByRef()
  } catch (e) {
    console.error('Send failed:', e)
  } finally {
    isSending.value = false
  }
}

/** 停止生成 */
const handleStopGeneration = () => {
  isSending.value = false
  // TODO: 实际上需要调用AbortController取消请求
}

/** 重新生成 */
const handleRegenerate = async (messageId: string) => {
  const id = dialogId.value
  if (!id) return
  isSending.value = true
  try {
    // 先删除最后一条AI消息
    const idx = messages.value.findIndex(m => m.id === messageId)
    if (idx !== -1) messages.value.splice(idx, 1)

    // 重新发送上一条用户消息
    const lastUserMsg = [...messages.value].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      const res = await dialogApi.sendMessage(id, lastUserMsg.content)
      if (res.success && res.data) {
        await appStore.openDialog(id)
      }
    } else {
      await appStore.regenerateMessage(id, messageId)
    }
  } catch (e) {
    console.error('Regenerate failed:', e)
  } finally {
    isSending.value = false
  }
}

/** 删除对话 */
const handleDeleteDialog = async () => {
  const id = dialogId.value
  if (!id || !confirm('确定要删除这个对话吗？')) return
  await appStore.deleteDialog(id)
  router.push('/')
}

/** 复制消息 */
const handleCopy = async (content: string) => {
  try {
    // 复制时去除 [QUESTION] 和 [CHOICE] 标签
    const cleanContent = content
      .replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '')
      .replace(/\[CHOICE\][\s\S]*?\[\/CHOICE\]/g, '')
      .trim()
    await navigator.clipboard.writeText(cleanContent)
    // TODO: show toast "Copied!"
  } catch {}
}

/** 分享 */
const handleShare = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    // toast copied
  })
}

/** 切换模型 */
const handleSwitchModel = async (model: any) => {
  showModelMenu.value = false
  await appStore.switchModel(model.id)
}

/** 文件上传 */
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  try {
    let fileNames = ''
    for (let i = 0; i < input.files.length; i++) {
      const res = await fileApi.upload(input.files[i])
      if (res.success && res.data) {
        fileNames += `[附件: ${(res.data as any).filename}] `
      }
    }
    messageInput.value += '\n' + fileNames.trim()
  } catch {
    for (let i = 0; i < input.files.length; i++) {
      messageInput.value += `\n[附件: ${input.files[i].name}]`
    }
  }
  input.value = ''
}

/** 格式化时间 */
const formatTime = (timestamp: string) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`
  return date.toLocaleDateString()
}

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const autoResizeByRef = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 200) + 'px'
  }
}

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 300)
})
</script>

<style scoped>
.action-btn {
  @apply p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded transition-colors;
}
.action-btn svg {
  @apply w-3.5 h-3.5 text-[#9b9a97] hover:text-[#787774];
}
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}
/* dropdown animation reused from nav */
.dropdown-enter-active { transition: all 0.15s ease-out; }
.dropdown-leave-active { transition: all 0.1s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(4px); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px); }

/* 选项面板样式 - 模仿截图中的独立卡片面板 */
.choice-panel {
  @apply bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm overflow-hidden;
}
.choice-panel-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-[#f0ede7] dark:border-white/5;
}
.choice-panel-title {
  @apply text-[14px] font-medium text-[#1a1a1a] dark:text-white;
}
.choice-panel-close {
  @apply p-0.5 text-[#9b9a97] hover:text-[#5c5b58] transition-colors;
}
.choice-panel-list {
  @apply p-2;
}
.choice-panel-item {
  @apply w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] text-[#5c5b58] dark:text-gray-300
    rounded-lg cursor-pointer transition-all duration-150
    hover:bg-black/[0.03] dark:hover:bg-white/5;
}
.choice-panel-item-active {
  @apply bg-[#fef8f5] text-[#d97757] font-medium;
}
.choice-panel-num {
  @apply w-5 h-5 flex items-center justify-center text-[11px] font-semibold text-[#9b9a97]
    bg-[#f5f4f0] dark:bg-white/5 rounded-full shrink-0;
}
.choice-panel-item-active .choice-panel-num {
  @apply bg-[#d97757]/10 text-[#d97757];
}
.choice-panel-footer {
  @apply flex items-center justify-end px-4 py-2.5 border-t border-[#f0ede7] dark:border-white/5;
}
.choice-skip-btn {
  @apply px-3 py-1 text-[12px] font-medium text-[#787774] dark:text-gray-400 border border-[#e5e5e4] dark:border-white/10
    rounded-md transition-colors duration-150
    hover:bg-black/[0.04] dark:hover:bg-white/5 hover:text-[#1a1a1a] dark:hover:text-white;
}
</style>
