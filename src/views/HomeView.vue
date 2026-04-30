<template>
  <div class="h-screen bg-[#f9f8f5] dark:bg-[#1f1f1e] text-text-100 flex overflow-hidden">
    <!-- 左侧导航栏 -->
    <AppNavigation
      :sidebar-width="sidebarWidth"
      @sidebar-change="onSidebarChange"
    />

    <!-- 主内容区域 -->
    <main class="h-full flex-1 min-w-0 overflow-y-auto transition-all duration-200 ease-in-out"
          :style="{ marginLeft: sidebarWidth + 'px' }">
      <div class="max-w-[800px] mx-auto px-6 pt-[25vh] pb-8">
        <!-- 问候语区域 -->
        <div class="text-center mb-8">
          <h1 class="text-[32px] font-normal text-[#5c5b58] dark:text-[#e8e7e0] flex items-center justify-center gap-3 leading-tight">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-[28px] h-[28px] fill-current text-[#d97757]"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/></svg>
            <span>{{ greeting }}, <span class="font-semibold">{{ appStore.displayName }}</span></span>
          </h1>
        </div>

        <!-- 输入框区域 -->
        <div class="mb-6 flex justify-center">
          <div
            class="relative bg-white rounded-[20px] dark:bg-[#2c2c2a] dark:border-[rgba(226,225,218,0.12)] dark:shadow-none transition-colors duration-200 border border-[#e5e5e4] hover:border-[#d0d0cd] hover:dark:border-[rgba(226,225,218,0.2)] w-full max-w-[674px]"
            :class="{ 'ring-2 ring-[#d97757]/20': isDragging }"
            style="min-height: 122px;"
            @dragenter.prevent="isDragging = true"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="(e: DragEvent) => { if (!(e.currentTarget as Element)?.contains(e.relatedTarget as Node)) isDragging = false }"
            @drop.prevent="handleDrop"
          >
            <!-- 拖拽提示遮罩 -->
            <div v-if="isDragging" class="absolute inset-0 rounded-[20px] bg-[#d97757]/5 flex items-center justify-center z-10 pointer-events-none">
              <div class="text-center">
                <svg class="w-10 h-10 mx-auto text-[#d97757] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-[14px] font-medium text-[#d97757]">释放以上传附件</p>
              </div>
            </div>

            <textarea
              ref="inputRef"
              v-model="userInput"
              rows="1"
              :class="[
                'w-full bg-transparent border-0 rounded-[20px] pt-4 px-4 text-[16px] text-[#1a1a1a] dark:text-[#f8f8f6] placeholder-[#9b9a97] focus:outline-none focus:ring-0 resize-none min-h-[68px] max-h-[240px] leading-relaxed',
                pendingAttachments.length > 0 ? 'pb-24' : 'pb-14'
              ]"
              placeholder="今天有什么可以帮您的？"
              @input="autoResize"
              @keydown.enter.exact.prevent="handleSend"
              @paste="handlePaste"
            ></textarea>

            <!-- 附件预览条（文件卡片形式） -->
            <div v-if="pendingAttachments.length > 0" class="absolute bottom-12 left-3 right-3 flex flex-wrap gap-3">
              <FileCard
                v-for="att in pendingAttachments"
                :key="att.id"
                :file="{
                  id: att.id,
                  filename: att.filename,
                  file_path: att.previewUrl || '',
                  file_type: att.fileType === 'image' ? 'image' : 'document',
                  size: att.size,
                  uploaded_at: new Date().toISOString(),
                  preview_url: att.previewUrl || ''
                }"
                @click="handleFilePreview(att)"
              />
              <!-- 移除附件按钮（单独的按钮，不在卡片内部） -->
              <div class="flex items-center gap-2">
                <button 
                  type="button" 
                  @click="clearPendingAttachments"
                  class="px-3 py-1.5 text-[11px] text-[#9b9a97] hover:text-[#787774] hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors border border-transparent hover:border-black/[0.08] dark:hover:border-white/10 flex items-center gap-1.5"
                  title="清空所有附件"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  清空
                </button>
              </div>
            </div>

            <!-- 底部工具栏 -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <!-- 左侧：附件按钮（始终显示） -->
              <button
                type="button"
                title="附件"
                class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors duration-150 group cursor-pointer"
                @click.stop="handleAttachClick"
              >
                <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input ref="fileInputRef" type="file" class="absolute -left-full opacity-0" accept="image/*,.pdf,.txt,.md,.doc,.docx,.csv,.json,.html,.css,.js,.ts,.py,.java,.go,.rs,.xml,.yaml,.yml,.log,.c,.cpp,.h,.hpp,.rb,.php,.sql,.vue" multiple @change="handleFileUpload" />

              <!-- 右侧：模型选择器 / 发送按钮 -->
              <div class="flex items-center gap-0.5">
                <template v-if="!userInput">
                  <div
                    v-click-outside="() => showModelMenu = false"
                    class="flex items-center gap-1 px-2 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md cursor-pointer transition-colors duration-150 group relative"
                    @click="showModelMenu = !showModelMenu"
                  >
                    <span class="text-[13px] text-[#787774] dark:text-gray-400 group-hover:text-[#5c5b58] leading-none tracking-tight">
                      {{ appStore.currentModel?.name || 'Haiku 4.5' }}
                    </span>
                    <svg class="w-3 h-3 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    <!-- 模型下拉菜单 -->
                    <Transition name="dropdown">
                      <div
                        v-if="showModelMenu"
                        class="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-[#2c2c2a] border border-[#e0e0df] dark:border-white/10 rounded-lg shadow-claude-md py-1 z-50"
                      >
                        <button
                          v-for="model in appStore.models"
                          :key="model.id"
                          class="w-full px-3 py-2 text-left text-[13px] flex items-center justify-between hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors"
                          :class="model.id === appStore.currentModel?.id ? 'text-[#d97757]' : 'text-[#1a1a1a] dark:text-gray-300'"
                          @click.stop="handleSwitchModel(model)"
                        >
                          <div>
                            <p class="font-medium">{{ model.name }}</p>
                            <p class="text-[11px] text-[#9b9a97] mt-0.5">{{ model.description }}</p>
                          </div>
                          <svg v-if="model.id === appStore.currentModel?.id" class="w-4 h-4 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        </button>
                      </div>
                    </Transition>
                  </div>

                  <!-- 语音按钮（官网同款：32x32, radius 8, 波形图标） -->
                  <button
                    v-tooltip="'语音输入'"
                    class="w-8 h-8 flex items-center justify-center hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-lg transition-colors duration-150 group cursor-pointer"
                    style="padding-left: 6px; padding-right: 6px;"
                  >
                    <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-block overflow-visible">
                      <rect x="0" y="7.5" height="6px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="4" y="5.5" height="10px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="8" y="2.5" height="16px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="12" y="5.5" height="10px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="16" y="2.5" height="16px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="20" y="7.5" height="6px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                    </svg>
                  </button>
                </template>

                <button
                  v-if="userInput"
                  :disabled="isSending || !userInput.trim()"
                  class="w-8 h-8 flex items-center justify-center bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150"
                  @click="handleSend"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷功能按钮 - 全部可点击 -->
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <router-link
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            :to="shortcut.route"
            class="shortcut-btn"
          >
            <component :is="'span'" v-html="shortcut.icon" class="inline-flex items-center"></component>
            {{ shortcut.label }}
          </router-link>
        </div>
      </div>
    </main>

    <!-- 文件预览模态框 -->
    <FilePreviewModal
      v-if="previewFile"
      v-model:visible="previewModalVisible"
      :file="previewFile"
      :text-content="previewTextContent"
      @close="handlePreviewClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { FileCard, FilePreviewModal } from '@/components/file'
import { useAppStore } from '@/stores/useAppStore'
import { fileApi } from '@/api/file'
import { readFileContent } from '@/utils/fileReader'
import { getDisplayFilename } from '@/utils/fileName'
import type { UploadedFile } from '@/types/api'
import type { MessageFile } from '@/types/message'

const router = useRouter()
const appStore = useAppStore()

const userInput = ref('')
const isCollapsed = ref(false)
const sidebarWidth = ref(288)
const isSending = ref(false)
const showModelMenu = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// 文件预览相关状态
const previewModalVisible = ref(false)
const previewFile = ref<MessageFile | null>(null)
const previewTextContent = ref<string>('')

/** 待发送的附件列表（上传成功后暂存，随消息一起提交到新对话） */
interface PendingAttachment {
  id: string
  filename: string
  fileType: string
  size: number
  previewUrl?: string | null
  /** 可读文本文件的读取内容（txt/md/html/docx 等） */
  textContent?: string | null
}
const pendingAttachments = ref<PendingAttachment[]>([])

/** 将文件大小格式化为可读字符串 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

/** 移除待发送附件 */
const removePendingAttachment = (id: string) => {
  pendingAttachments.value = pendingAttachments.value.filter(f => f.id !== id)
}

/** 清空所有待发送附件 */
const clearPendingAttachments = () => {
  pendingAttachments.value = []
}

const hasPersistedAttachmentId = (attachment?: Partial<PendingAttachment> | null): attachment is PendingAttachment => {
  return typeof attachment?.id === 'string' && attachment.id.length > 0 && !attachment.id.startsWith('temp_')
}

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
  sidebarWidth.value = collapsed ? 48 : 288
}

/** 根据时间生成问候语 */
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

/** 创建对话并发送消息 */
const handleSend = async () => {
  if (!userInput.value.trim() && pendingAttachments.value.length === 0 || isSending.value) return

  isSending.value = true
  showModelMenu.value = false

  try {
    // 保存附件信息（在清空之前），过滤掉临时附件（ID以temp_开头）
    const validAttachments = pendingAttachments.value.filter(hasPersistedAttachmentId)
    const attachments = validAttachments.map(att => ({
      id: att.id,
      filename: att.filename,
      fileType: att.fileType,
      size: att.size,
      previewUrl: att.previewUrl,
    }))
    const fileIds = attachments.length > 0 ? attachments.map(f => f.id) : undefined

    // 构建包含可读文件内容的完整消息文本（发送给 API）
    let apiMessage = userInput.value.trim()
    if (validAttachments.length > 0) {
      const textParts: string[] = []
      for (const att of validAttachments) {
        if (att.textContent) {
          textParts.push(`\n\n--- 附件: ${att.filename} (${formatFileSize(att.size)}) ---\n${att.textContent}\n--- 结束 ---`)
        } else {
          textParts.push(`\n[附件: ${att.filename}]`)
        }
      }
      apiMessage += textParts.join('')
    }

    // 用户输入文本（不含文件内容，用于前端显示）
    const displayMessage = userInput.value.trim()

    // 先创建对话
    const dialog = await appStore.createDialog(apiMessage.slice(0, 60))
    if (!dialog) return

    clearPendingAttachments()

    // 跳转到聊天页面（携带显示消息 + 附件元数据）
    const query: Record<string, string> = { msg: displayMessage }
    if (fileIds && fileIds.length > 0) {
      query.fileIds = fileIds.join(',')
      query.files = JSON.stringify(attachments.map(a => ({
        id: a.id,
        filename: a.filename,
        file_type: a.fileType === 'image' ? 'image' : 'document',
        size: a.size,
      })))
    }
    // 同时传递完整消息供 API 使用
    query.apiMsg = apiMessage
    router.push({ path: `/chat/${dialog.id}`, query })
  } catch (e) {
    console.error('发送失败:', e)
  } finally {
    isSending.value = false
  }
}

/** 切换模型 */
const handleSwitchModel = async (model: any) => {
  showModelMenu.value = false
  await appStore.switchModel(model.id)
}

// 防止附件点击重复执行
let isAttachHandling = false

/** 附件按钮点击 */
const handleAttachClick = () => {
  // 防止重复执行
  if (isAttachHandling) {
    console.warn('附件点击处理中，忽略重复点击')
    return
  }
  
  if (!fileInputRef.value) {
    console.error('fileInputRef 为 null')
    return
  }
  
  isAttachHandling = true
  
  try {
    // 方案1：直接点击原始输入框
    fileInputRef.value.click()
  } catch (error) {
    console.error('点击文件输入框失败:', error)
    // 方案2：创建新的文件输入框作为备用
    createAndClickFallbackFileInput(fileInputRef.value)
  } finally {
    // 短暂延迟后重置标志，避免快速连续点击
    setTimeout(() => {
      isAttachHandling = false
    }, 100)
  }
}

/** 创建并点击备用文件输入框 */
const createAndClickFallbackFileInput = (originalInput: HTMLInputElement) => {
  const tempInput = document.createElement('input')
  tempInput.type = 'file'
  tempInput.multiple = true
  tempInput.accept = originalInput.accept
  
  // 使用不可见但可点击的位置
  tempInput.style.position = 'fixed'
  tempInput.style.left = '-9999px'
  tempInput.style.opacity = '0'
  tempInput.style.pointerEvents = 'auto'
  
  document.body.appendChild(tempInput)
  
  tempInput.addEventListener('change', () => {
    // 将文件传递给原始输入框
    const event = new Event('change', { bubbles: true })
    Object.defineProperty(event, 'target', { value: { files: tempInput.files } })
    originalInput.dispatchEvent(event)
    
    // 清理临时输入框
    document.body.removeChild(tempInput)
  })
  
  // 确保临时输入框已经添加到DOM后立即点击（同步执行以保持用户激活上下文）
  try {
    tempInput.click()
  } catch (error) {
    console.error('点击临时文件输入框失败:', error)
    // 清理临时输入框
    document.body.removeChild(tempInput)
  }
}

/** 文件上传处理 */
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  for (let i = 0; i < input.files.length; i++) {
    await uploadAndAddFile(input.files[i])
  }
  input.value = '' // 允许重复选择同一文件
}

/** 拖拽上传 */
const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files?.length) return

  // 过滤允许的文件类型
  const allowedTypes = ['image/', 'application/pdf', 'text/plain', 'application/json', '.md', '.docx',
    '.csv', '.html', '.css', '.js', '.ts', '.py', '.java', '.go', '.rs', '.xml', '.yaml', '.yml', '.log']
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!allowedTypes.some(t => file.type.startsWith(t) || file.name.endsWith(t))) continue
    await uploadAndAddFile(file)
  }
  autoResizeByRef()
}

/** 统一的上传+添加附件方法（供 file upload / drop / paste 共用）
 *
 *  策略：
 *  - 可读文本文件（txt/md/html/css/js/py...）：读取文件内容 → 上传到服务器 → 同时保存 textContent
 *  - docx 文件：用 mammoth 解析纯文本 → 上传到服务器 → 保存解析后的 textContent
 *  - 图片/PDF/其他：仅上传到服务器（只存 fileId，AI 无法读取内容）
 */
const uploadAndAddFile = async (file: File): Promise<void> => {
  try {
    // 1) 先尝试读取文件内容
    const readResult = await readFileContent(file)

    // 2) 同时上传文件到服务器（获取 fileId 用于关联消息）
    const res = await fileApi.upload(file)
    if (res.success && res.data) {
      // 后端返回嵌套结构: { success, message, data: { id, filename, ... } }
      const raw = res.data as any
      const uploaded: UploadedFile = raw.data ? raw.data : raw
      // 使用服务器返回的文件名，如果为空则使用原始文件名
      const filename = getDisplayFilename(file.name, uploaded.filename)

      const att: PendingAttachment = {
        id: uploaded.id,
        filename,
        fileType: uploaded.file_type,
        size: uploaded.size,
        previewUrl: uploaded.preview_url,
        textContent: readResult?.content ?? null,
      }

      pendingAttachments.value.push(att)

      if (readResult) {
        console.log(`[UPLOAD] 文件上传+读取成功: ${filename} (${readResult.method}, ${readResult.content.length}字符, id=${uploaded.id})`)
      } else {
        console.log(`[UPLOAD] 文件上传成功(不可读): ${filename} (id=${uploaded.id})`)
      }
    } else {
      // 上传失败时，仍然创建本地附件预览（使用临时ID）
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const att: PendingAttachment = {
        id: tempId,
        filename: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size,
        previewUrl: null,
        textContent: readResult?.content ?? null,
      }
      
      pendingAttachments.value.push(att)
      console.log(`[UPLOAD] 上传失败但已创建本地附件预览: ${file.name} (临时ID: ${tempId})`)
      
      // 不再将内容直接注入输入框，保持附件样式显示
      autoResizeByRef()
    }
  } catch (err: any) {
    console.error('[UPLOAD] 处理失败:', err)
    // 异常时也创建本地附件预览
    const tempId = `temp_err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const att: PendingAttachment = {
      id: tempId,
      filename: file.name,
      fileType: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      previewUrl: null,
      textContent: null,
    }
    
    pendingAttachments.value.push(att)
    console.log(`[UPLOAD] 处理异常但已创建本地附件预览: ${file.name} (临时ID: ${tempId})`)
    autoResizeByRef()
  }
}

/** 粘贴处理（支持 Ctrl+V 粘贴图片/文件） */
const handlePaste = async (e: ClipboardEvent): Promise<void> => {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'file') {
      e.preventDefault()
      const file = item.getAsFile()
      if (file) {
        await uploadAndAddFile(file)
      }
    }
  }
}

// 快捷按钮 - 每个都有对应功能（使用官网同款 fill 图标，viewBox 0 0 256 256）
const shortcuts = [
  { id: 1, label: '策略规划', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"/></svg>', route: '/chat' },
  { id: 2, label: '写作', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"/></svg>', route: '/chat' },
  { id: 3, label: '学习', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.6a8,8,0,0,0,7.52,0L208,126.4v39.89C196.72,178.83,171.26,200,128,200Z"/></svg>', route: '/chat' },
  { id: 4, label: '编程', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"/></svg>', route: '/code' },
  { id: 5, label: '生活', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16H56.54A96.3,96.3,0,0,1,24,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120ZM200,96H40v40a80.14,80.14,0,0,0,80,80h16a80.14,80.14,0,0,0,80-80V96Z"/></svg>', route: '/chat' },
]

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 240) + 'px'
}

const autoResizeByRef = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 240) + 'px'
  }
}

/** 点击外部关闭模型菜单 */
const handleClickOutside = (e: MouseEvent) => {
  if (showModelMenu.value) {
    const target = e.target as HTMLElement
    if (!target.closest('.relative') && !target.closest('[class*="rounded-md"]')) {
      showModelMenu.value = false
    }
  }
}

/** 处理文件预览 - 将 PendingAttachment 转换为 MessageFile 格式 */
const handleFilePreview = (att: PendingAttachment) => {
  // 将 PendingAttachment 转换为 MessageFile 格式
  const messageFile: MessageFile = {
    id: att.id,
    filename: att.filename,
    file_path: att.previewUrl || '',
    file_type: att.fileType === 'image' ? 'image' : 'document',
    size: att.size,
    uploaded_at: new Date().toISOString(),
    preview_url: att.previewUrl || ''
  }
  
  previewFile.value = messageFile
  previewModalVisible.value = true
  
  // 如果有文本内容，设置到预览中
  if (att.textContent) {
    previewTextContent.value = att.textContent
  }
}

/** 处理预览关闭 */
const handlePreviewClose = () => {
  previewModalVisible.value = false
  previewFile.value = null
  previewTextContent.value = ''
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  setTimeout(() => inputRef.value?.focus(), 300)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.shortcut-btn {
  @apply px-2.5 h-8 border border-[#e5e5e4]/[0.15] dark:border-white/10 rounded-lg text-sm text-[#c3c2b7] dark:text-gray-400 hover:text-[#e8e7e0] dark:hover:text-gray-200 hover:border-[#cfcfce]/30 dark:hover:border-white/20 bg-transparent dark:bg-transparent hover:bg-black/[0.03] dark:hover:bg-white/5 transition-all duration-150 flex items-center gap-1.5 leading-none;
}
</style>
