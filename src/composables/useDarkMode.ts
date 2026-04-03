import { ref, onMounted, watch } from 'vue'

/**
 * 深色模式组合式函数
 * 遵循 Claude 官网的深色模式设计规范
 */
export function useDarkMode() {
  const isDark = ref(false)
  const isSystemDark = ref(false)
  const preference = ref<'light' | 'dark' | 'system'>('system')

  // 检查系统深色模式
  const checkSystemDark = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 应用深色模式类名
  const applyDarkMode = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
    isDark.value = dark
  }

  // 从 localStorage 读取偏好设置
  const loadPreference = () => {
    const saved = localStorage.getItem('claude-theme')
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      preference.value = saved
    }
    updateTheme()
  }

  // 更新主题
  const updateTheme = () => {
    let dark = false
    
    if (preference.value === 'system') {
      dark = isSystemDark.value
    } else {
      dark = preference.value === 'dark'
    }
    
    applyDarkMode(dark)
  }

  // 设置主题偏好
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    preference.value = theme
    localStorage.setItem('claude-theme', theme)
    updateTheme()
  }

  // 切换深色模式
  const toggleDarkMode = () => {
    if (preference.value === 'system') {
      // 如果当前是系统模式，切换到用户选择的明暗模式
      setTheme(isSystemDark.value ? 'light' : 'dark')
    } else {
      // 如果当前是用户选择模式，切换到相反模式
      setTheme(preference.value === 'dark' ? 'light' : 'dark')
    }
  }

  // 初始化
  onMounted(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    isSystemDark.value = checkSystemDark()
    
    const handleChange = (e: MediaQueryListEvent) => {
      isSystemDark.value = e.matches
      if (preference.value === 'system') {
        updateTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // 加载用户偏好
    loadPreference()
    
    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  })

  // 监听偏好变化
  watch(preference, updateTheme)

  return {
    isDark,
    isSystemDark,
    preference,
    setTheme,
    toggleDarkMode
  }
}

/**
 * 深色模式 CSS 变量
 * Claude 官网的深色模式设计令牌
 */
export const darkModeTokens = {
  colors: {
    'bg-000': '0 0% 7%',
    'bg-100': '0 0% 10%',
    'bg-200': '0 0% 14%',
    'bg-300': '0 0% 18%',
    'bg-400': '0 0% 22%',
    'text-000': '0 0% 98%',
    'text-100': '0 0% 90%',
    'text-200': '0 0% 80%',
    'text-300': '0 0% 70%',
    'text-400': '0 0% 60%',
    'border-100': '0 0% 25%',
    'border-200': '0 0% 30%',
    'border-300': '0 0% 35%',
    'border-400': '0 0% 40%'
  }
}