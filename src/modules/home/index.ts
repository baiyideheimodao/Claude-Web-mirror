/**
 * 首页模块
 * 包含首页相关的组件、API、状态管理等
 */

// 导出组件
export { default as HomeView } from '@/views/HomeView.vue'

// 导出组合式函数
export { useHomeFeatures } from './composables/useHomeFeatures'

// 导出类型
export type { Feature, Example } from './types/home'

// 导出 API
export { getFeatures, getExamples } from './api/homeApi'

/**
 * 模块配置
 */
export const homeModuleConfig = {
  name: 'home',
  version: '1.0.0',
  dependencies: ['auth', 'chat']
}

/**
 * 初始化首页模块
 */
export function initializeHomeModule() {
  console.log('首页模块初始化完成')
  
  // 模块初始化逻辑
  return {
    config: homeModuleConfig,
    ready: true
  }
}