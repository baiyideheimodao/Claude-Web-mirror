<template>
  <div
    class="file-card cursor-pointer group"
    @click="$emit('click')"
  >
    <!-- 图片文件缩略图 -->
    <div
      v-if="isImageFile"
      class="image-card"
      :title="`图片: ${file.filename} (${formatSize(file.size)})`"
    >
      <div class="image-thumbnail-container">
        <!-- 如果有预览URL，显示图片缩略图 -->
        <img
          v-if="file.preview_url"
          :src="file.preview_url"
          :alt="file.filename"
          class="image-thumbnail"
          loading="lazy"
          @error="handleImageError"
        />
        <!-- 否则显示图片图标 -->
        <div v-else class="image-placeholder">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
          </svg>
        </div>
      </div>
      <div class="image-info">
        <span class="filename truncate">{{ file.filename }}</span>
        <span class="filesize">{{ formatSize(file.size) }}</span>
      </div>
    </div>

    <!-- 文本文件卡片 -->
    <div
      v-else-if="isTextFile(file.filename)"
      class="text-file-card"
      :title="`文本文件: ${file.filename} (${formatSize(file.size)})`"
    >
      <div class="text-file-icon">
        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 4.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 4.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
        </svg>
      </div>
      <div class="text-file-info">
        <span class="filename truncate">{{ file.filename }}</span>
        <span class="filesize">{{ formatSize(file.size) }}</span>
        <div class="file-type">文本文件</div>
      </div>
    </div>

    <!-- 其他文件卡片 -->
    <div
      v-else
      class="other-file-card"
      :title="`${getFileType(file.filename)}: ${file.filename} (${formatSize(file.size)})`"
    >
      <div class="other-file-icon">
        <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 4.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 4.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
        </svg>
      </div>
      <div class="other-file-info">
        <span class="filename truncate">{{ file.filename }}</span>
        <span class="filesize">{{ formatSize(file.size) }}</span>
        <div class="file-type">{{ getFileType(file.filename) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { MessageFile } from '@/types/api'

const props = defineProps<{
  file: MessageFile
}>()

const emit = defineEmits<{
  click: []
}>()

// 判断是否为图片文件（优先使用 file_type 字段，也用扩展名作为后备）
const isImageFile = computed(() => {
  // 优先使用 file_type 字段
  if (props.file.file_type === 'image') return true
  // 使用扩展名作为后备判断
  const ext = props.file.filename.split('.').pop()?.toLowerCase() || ''
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff']
  return imageExtensions.includes(ext)
})

// 判断是否为文本文件
const isTextFile = (filename: string): boolean => {
  const textExtensions = [
    'txt', 'md', 'html', 'htm', 'css', 'js', 'ts', 'jsx', 'tsx',
    'py', 'java', 'go', 'rs', 'json', 'xml', 'yaml', 'yml', 'csv', 'log',
    'sh', 'bat', 'c', 'cpp', 'h', 'hpp', 'rb', 'php', 'sql', 'env',
    'gitignore', 'toml', 'ini', 'conf', 'proto', 'graphql', 'vue', 'svelte', 'docx'
  ]
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return textExtensions.includes(ext)
}

// 获取文件类型
const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return '文件'
  
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

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `
      <div class="image-placeholder">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
        </svg>
      </div>
    `
  }
}
</script>

<style scoped>
.file-card {
  user-select: none;
  transition: all 0.2s ease;
}

.file-card:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 图片卡片样式 - 优化显示效果 */
.image-card {
  width: 140px;
  min-height: 160px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.image-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.image-thumbnail-container {
  flex: 1;
  min-height: 100px;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  overflow: hidden;
}

.image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.image-card:hover .image-thumbnail {
  transform: scale(1.02);
}

.image-placeholder {
  flex: 1;
  min-height: 100px;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
}

.image-info {
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.image-info .filename {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

.image-info .filesize {
  font-size: 11px;
  color: #666;
  text-align: center;
}

/* 文本文件卡片样式 */
.text-file-card {
  width: 160px;
  height: 60px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.05);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.text-file-card:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);
}

.text-file-info {
  flex: 1;
  min-width: 0;
}

.text-file-info .filename {
  font-size: 13px;
  color: #1e40af;
  font-weight: 500;
  display: block;
  margin-bottom: 2px;
}

.text-file-info .filesize {
  font-size: 11px;
  color: #4b5563;
  display: block;
  margin-bottom: 4px;
}

.text-file-info .file-type {
  font-size: 10px;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 1px 6px;
  border-radius: 10px;
  display: inline-block;
}

/* 其他文件卡片样式 */
.other-file-card {
  width: 160px;
  height: 60px;
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 8px;
  background: rgba(249, 250, 251, 0.8);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.other-file-card:hover {
  background: rgba(243, 244, 246, 0.9);
  border-color: rgba(107, 114, 128, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.other-file-info {
  flex: 1;
  min-width: 0;
}

.other-file-info .filename {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  display: block;
  margin-bottom: 2px;
}

.other-file-info .filesize {
  font-size: 11px;
  color: #6b7280;
  display: block;
  margin-bottom: 4px;
}

.other-file-info .file-type {
  font-size: 10px;
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
  padding: 1px 6px;
  border-radius: 10px;
  display: inline-block;
}

.dark .image-card {
  background: #262626;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .image-thumbnail-container {
  background: #1f1f1f;
}

.dark .image-placeholder {
  background: #1a1a1a;
}

.dark .image-info {
  background: #262626;
}

.dark .image-info .filename {
  color: #e5e5e5;
}

.dark .image-info .filesize {
  color: #a3a3a3;
}

.dark .text-file-card {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.dark .text-file-info .filename {
  color: #93c5fd;
}

.dark .text-file-info .filesize {
  color: #d1d5db;
}

.dark .other-file-card {
  background: rgba(75, 85, 99, 0.1);
  border-color: rgba(75, 85, 99, 0.3);
}

.dark .other-file-info .filename {
  color: #d1d5db;
}

.dark .other-file-info .filesize {
  color: #9ca3af;
}

.dark .other-file-info .file-type {
  color: #9ca3af;
  background: rgba(75, 85, 99, 0.2);
}
</style>