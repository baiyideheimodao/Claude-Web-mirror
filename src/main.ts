import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import './styles/design-tokens.css'
import './styles/main.css'

import App from './App.vue'

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/chat/:id?', name: 'Chat', component: () => import('@/views/ChatView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
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
