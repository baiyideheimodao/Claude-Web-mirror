<template>
  <!-- 模态框遮罩层 -->
  <div
    v-if="visible"
    class="file-preview-modal-overlay"
    @click.self="handleClose"
  >
    <!-- 模态框主体 -->
    <div class="file-preview-modal" :class="{'image-preview': isImageFile, 'text-preview': isTextFile, 'other-preview': !isImageFile && !isTextFile}">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <div class="header-left">
          <div class="file-info">
            <div class="file-icon">
              <svg
                v-if="isImageFile"
                class="w-5 h-5 text-[#d97757]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.75"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
              </svg>
              <svg
                v-else-if="isTextFile"
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.75"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.75"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
            </div>
            <div>
              <div class="filename" :title="file.filename">
                {{ file.filename }}
              </div>
              <div class="meta-info">
                <span>{{ formatSize(file.size) }}</span>
                <span>•</span>
                <span>{{ getFileTypeDescription() }}</span>
                <span v-if="uploadedAt">•</span>
                <span v-if="uploadedAt">{{ formatDate(uploadedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="header-right">
          <!-- 下载按钮 -->
          <button
            class="action-btn"
            :title="`下载 ${file.filename}`"
            @click="handleDownload"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
          </button>

          <!-- 关闭按钮 -->
          <button
            class="close-btn"
            @click="handleClose"
            title="关闭预览"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 模态框内容区域 -->
      <div class="modal-content">
        <!-- 图片预览 -->
        <div v-if="isImageFile && !imageLoadFailed" class="image-preview-container">
          <div class="image-zoom-container" ref="zoomContainerRef">
            <img
              v-if="file.preview_url"
              :src="file.preview_url"
              :alt="file.filename"
              class="image-preview"
              @load="handleImageLoad"
              @error="handleImagePreviewError"
              ref="imageRef"
            />
            <div v-else class="image-preview-placeholder">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
              </svg>
              <p class="mt-2 text-sm text-gray-500">无法加载图片预览</p>
            </div>
          </div>
        </div>

        <!-- 文本文件预览 -->
        <div v-else-if="isTextFile" class="text-preview-container">
          <div class="text-preview-header">
            <div class="text-file-type-info">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
              <span>文本文件预览</span>
            </div>
            <div class="text-preview-actions">
              <button
                class="copy-btn"
                @click="handleCopyTextContent"
                :title="`复制全部内容 ${file.filename}`"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
                复制
              </button>
            </div>
          </div>
          <div class="text-content-wrapper">
            <pre class="text-content" v-if="textContent">{{ textContent }}</pre>
            <div v-else class="no-text-content">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 4.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 4.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
              <p class="mt-2 text-sm text-gray-500">无法获取文本内容</p>
            </div>
          </div>
        </div>

        <!-- 其他文件预览 -->
        <div v-else class="other-preview-container">
          <div class="other-preview-placeholder">
            <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 4.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 4.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
            </svg>
            <div class="mt-4 text-center">
              <p class="text-2xl font-medium text-gray-600">{{ file.filename }}</p>
              <p class="mt-2 text-sm text-gray-500">此文件类型暂不支持预览</p>
              <div class="mt-4 file-details">
                <p><strong>文件类型:</strong> {{ getFileTypeDescription() }}</p>
                <p><strong>文件大小:</strong> {{ formatSize(file.size) }}</p>
                <p v-if="uploadedAt"><strong>上传时间:</strong> {{ formatDate(uploadedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { fileApi } from '@/api/file'
import type { MessageFile } from '@/types/api'

interface Props {
  visible: boolean
  file: MessageFile
  textContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  textContent: undefined,
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  close: []
}>()

const imageLoadFailed = ref(false)
const zoomScale = ref(1)
const zoomContainerRef = ref<HTMLDivElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

const uploadedAt = computed(() => (props.file as any).uploaded_at || (props.file as any).created_at)

// 判断是否为图片文件
const isImageFile = computed(() => props.file.file_type === 'image')

// 判断是否为文本文件
const isTextFile = computed(() => {
  const textExtensions = [
    'txt', 'md', 'html', 'htm', 'css', 'js', 'ts', 'jsx', 'tsx',
    'py', 'java', 'go', 'rs', 'json', 'xml', 'yaml', 'yml', 'csv', 'log',
    'sh', 'bat', 'c', 'cpp', 'h', 'hpp', 'rb', 'php', 'sql', 'env',
    'gitignore', 'toml', 'ini', 'conf', 'proto', 'graphql', 'vue', 'svelte', 'docx'
  ]
  const ext = props.file.filename.split('.').pop()?.toLowerCase() || ''
  return textExtensions.includes(ext)
})

// 获取文件类型描述
const getFileTypeDescription = (): string => {
  const ext = props.file.filename.split('.').pop()?.toLowerCase()
  if (isImageFile.value) return '图片'
  if (!ext) return '未知文件'
  
  const types: Record<string, string> = {
    pdf: 'PDF文档',
    doc: 'Word文档',
    docx: 'Word文档',
    xls: 'Excel表格',
    xlsx: 'Excel表格',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    zip: '压缩文件',
    rar: '压缩文件',
    '7z': '压缩文件',
    exe: '可执行文件',
    dmg: '磁盘映像',
    iso: '光盘映像',
    mp3: '音频文件',
    mp4: '视频文件',
    avi: '视频文件',
    mkv: '视频文件',
  }
  
  return types[ext] || `${ext.toUpperCase()}文件`
}

// 格式化文件大小
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1048576).toFixed(1) + 'MB'
}

// 格式化日期
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

// 处理关闭事件
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 处理下载事件
const handleDownload = () => {
  // 如果文件有预览URL，直接下载预览URL
  if (props.file.preview_url) {
    const link = document.createElement('a')
    link.href = props.file.preview_url
    link.download = props.file.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // 否则显示提示或通过API下载
    alert(`下载 ${props.file.filename}`)
  }
}

// 处理图片加载事件
const handleImageLoad = () => {
  imageLoadFailed.value = false
}

// 处理图片加载错误
const handleImagePreviewError = () => {
  imageLoadFailed.value = true
}

// 处理复制文本内容
const handleCopyTextContent = async () => {
  if (props.textContent) {
    try {
      await navigator.clipboard.writeText(props.textContent)
      alert('已复制文本内容到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败')
    }
  } else {
    alert('没有可复制的文本内容')
  }
}

// 监听ESC键
const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && event.key === 'Escape') {
    handleClose()
  }
}

// 监听图片缩放
const handleZoom = (delta: number) => {
  zoomScale.value = Math.max(0.1, Math.min(5, zoomScale.value + delta))
  if (imageRef.value && zoomContainerRef.value) {
    imageRef.value.style.transform = `scale(${zoomScale.value})`
  }
}

// 重置缩放
const resetZoom = () => {
  zoomScale.value = 1
  if (imageRef.value) {
    imageRef.value.style.transform = 'scale(1)'
  }
}

// 挂载和卸载事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 监听可见性变化，重置状态
watch(() => props.visible, (newValue) => {
  if (!newValue) {
    resetZoom()
    imageLoadFailed.value = false
  }
})
</script>

<style scoped>
/* 模态框遮罩层 */
.file-preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 模态框主体 */
.file-preview-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 模态框头部 */
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: #f9f9f9;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  flex-shrink: 0;
}

.filename {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.meta-info {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn,
.close-btn {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.action-btn:hover {
  background: #f0f0f0;
  border-color: #ddd;
  color: #333;
}

.close-btn:hover {
  background: #f0f0f0;
  border-color: #ddd;
  color: #333;
}

/* 模态框内容区域 */
.modal-content {
  flex: 1;
  overflow: auto;
  display: flex;
}

/* 图片预览容器 */
.image-preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f5f5;
  position: relative;
}

.image-zoom-container {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

/* 图片预览占位符 */
.image-preview-placeholder,
.no-text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
}

/* 文本文件预览容器 */
.text-preview-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.text-preview-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  flex-shrink: 0;
}

.text-file-type-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.text-preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  padding: 6px 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s ease;
}

.copy-btn:hover {
  background: #1d4ed8;
}

.text-content-wrapper {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background: #f8f9fa;
}

.text-content {
  font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  max-height: 60vh;
  overflow: auto;
}

/* 其他文件预览容器 */
.other-preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.other-preview-placeholder {
  text-align: center;
  max-width: 400px;
}

.file-details {
  text-align: left;
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-details p {
  margin: 8px 0;
  color: #555;
}

.file-details strong {
  color: #333;
  margin-right: 8px;
}

/* 暗色模式支持 */
.dark .file-preview-modal {
  background: #262626;
  color: #e5e5e5;
}

.dark .modal-header {
  background: #1f1f1f;
  border-bottom-color: #404040;
}

.dark .filename {
  color: #f5f5f5;
}

.dark .meta-info {
  color: #a3a3a3;
}

.dark .action-btn,
.dark .close-btn {
  color: #a3a3a3;
}

.dark .action-btn:hover,
.dark .close-btn:hover {
  background: #404040;
  border-color: #555;
  color: #f5f5f5;
}

.dark .image-preview-container {
  background: #1a1a1a;
}

.dark .text-preview-header {
  background: #1f1f1f;
  border-bottom-color: #404040;
}

.dark .text-content-wrapper {
  background: #1a1a1a;
}

.dark .text-content {
  background: #2a2a2a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .other-preview-container {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.dark .file-details {
  background: #2a2a2a;
  color: #e5e5e5;
}

.dark .file-details strong {
  color: #f5f5f5;
}
</style>