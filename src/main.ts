import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/design-tokens.css'
import './styles/main.css'

import App from './App.vue'
import router from './router'

// 注册全局指令
import { clickOutside, tooltip } from './directives'

const app = createApp(App)

app.directive('click-outside', clickOutside)
app.directive('tooltip', tooltip)

const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化应用状态（拉取用户/对话/模型等数据）
router.isReady().then(async () => {
  const { useAppStore } = await import('./stores/useAppStore')
  const appStore = useAppStore()
  await appStore.initialize()
})

app.mount('#app')
