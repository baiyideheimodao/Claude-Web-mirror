/**
 * 文件内容读取工具
 *
 * 支持的文件类型及读取策略：
 *   纯文本直接读取: .txt .md .html .htm .css .js .ts .jsx .tsx .py .java .go .rs .json .xml .yaml .yml .csv .log .sh .bat .c .cpp .h .hpp .rb .php .sql .env .gitignore .toml .ini .conf .proto .graphql .vue .svelte .markdown
 *   二进制解析:     .docx (mammoth) → 提取纯文本
 *   图片/其他:      不读取内容（仅上传文件ID）
 */

import mammoth from 'mammoth'

/** 可直接用 FileReader.readAsText 读取的纯文本扩展名 */
const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'html', 'htm', 'css', 'js', 'ts', 'jsx', 'tsx',
  'py', 'java', 'go', 'rs', 'json', 'xml', 'yaml', 'yml', 'csv', 'log',
  'sh', 'bat', 'c', 'cpp', 'h', 'hpp', 'rb', 'php', 'sql', 'env',
  'gitignore', 'toml', 'ini', 'conf', 'proto', 'graphql', 'vue', 'svelte',
])

/** 需要特殊库解析的二进制文档扩展名 */
const BINARY_DOC_EXTENSIONS = new Set(['docx'])

/** 判断是否为可读文本文件 */
export function isTextReadableFile(filename: string): boolean {
  const ext = extractExt(filename)
  return TEXT_EXTENSIONS.has(ext)
}

/** 判断是否为需要特殊解析的文档 */
export function isBinaryDocFile(filename: string): boolean {
  const ext = extractExt(filename)
  return BINARY_DOC_EXTENSIONS.has(ext)
}

/** 从文件名提取小写扩展名（不含点） */
function extractExt(filename: string): string {
  const dotIndex = filename.lastIndexOf('.')
  return dotIndex > 0 ? filename.slice(dotIndex + 1).toLowerCase() : ''
}

/** 文件读取结果 */
export interface FileReadResult {
  content: string        // 文件文本内容
  truncated: boolean     // 是否被截断（超长）
  originalSize: number   // 原始字节大小
  method: 'text' | 'docx' | null  // 使用的读取方式
}

const MAX_TEXT_BYTES = 100 * 1024  // 纯文本最大读取 100KB
const MAX_DOCX_BYTES = 5 * 1024 * 1024 // docx 最大 5MB
const MAX_CONTENT_CHARS = 50_000     // 注入消息的最大字符数

/**
 * 读取文件内容（自动根据扩展名选择策略）
 *
 * @returns 成功返回 { content, ... }；不可读返回 null
 */
export async function readFileContent(file: File): Promise<FileReadResult | null> {
  const ext = extractExt(file.name)

  // 1) 纯文本文件 → 直接 readAsText
  if (TEXT_EXTENSIONS.has(ext)) {
    if (file.size > MAX_TEXT_BYTES) {
      console.log(`[FILE_READER] ${file.name} (${formatSize(file.size)}) 超过 ${formatSize(MAX_TEXT_BYTES)}，跳过文本读取`)
      return null
    }
    try {
      const text = await readFileAsText(file)
      const truncated = text.length > MAX_CONTENT_CHARS
      return {
        content: truncated ? text.slice(0, MAX_CONTENT_CHARS) + '\n\n[... 内容过长已截断 ...]' : text,
        truncated,
        originalSize: file.size,
        method: 'text',
      }
    } catch (e) {
      console.error(`[FILE_READER] 读取文本失败: ${file.name}`, e)
      return null
    }
  }

  // 2) .docx 文件 → mammoth 解析
  if (ext === 'docx') {
    if (file.size > MAX_DOCX_BYTES) {
      console.log(`[FILE_READER] ${file.name} (${formatSize(file.size)}) 超过 docx 限制，仅上传不读取`)
      return null
    }
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
      const text = result.value || ''
      const truncated = text.length > MAX_CONTENT_CHARS
      return {
        content: truncated ? text.slice(0, MAX_CONTENT_CHARS) + '\n\n[... 内容过长已截断 ...]' : text,
        truncated,
        originalSize: file.size,
        method: 'docx',
      }
    } catch (e) {
      console.error(`[FILE_READER] docx 解析失败: ${file.name}`, e)
      return null
    }
  }

  // 3) 其他类型（图片、pdf 等）→ 不读取内容
  return null
}

/** 封装 FileReader.readAsText 为 Promise */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

/** 格式化文件大小 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1048576).toFixed(1) + 'MB'
}
