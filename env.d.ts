/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION?: string
  readonly VITE_APP_VERSION: string
  
  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_CLAUDE_API_KEY: string
  
  // 功能开关
  readonly VITE_USE_MOCK: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEV_TOOLS: string
  
  // UI 配置
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_ENABLE_DARK_MODE: string
  
  // 开发配置
  readonly VITE_DEV_SERVER_PORT: string
  readonly VITE_DEV_SERVER_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}