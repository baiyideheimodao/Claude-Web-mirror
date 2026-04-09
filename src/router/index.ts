import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Claude', requiresAuth: true },
  },
  {
    path: '/chat/:id?',
    name: 'Chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: 'Chat', requiresAuth: true }
  },
  {
    path: '/chats',
    name: 'Chats',
    component: () => import('@/views/ChatsView.vue'),
    meta: { title: 'Chats', requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: 'Projects', requiresAuth: true }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { title: 'Project', requiresAuth: true }
  },
  {
    path: '/artifacts',
    name: 'Artifacts',
    component: () => import('@/views/ArtifactsView.vue'),
    meta: { title: 'Artifacts', requiresAuth: true }
  },
  {
    path: '/code',
    name: 'Code',
    component: () => import('@/views/CodeView.vue'),
    meta: { title: 'Code', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || 'Claude'} - Claude Mirror`

  // 已登录用户访问 /login 时重定向到首页
  const token = localStorage.getItem('claude-token')
  if (token && to.path === '/login') {
    return '/'
  }

  // 未登录用户访问需要认证的页面时跳转到登录页
  if (!token && to.meta.requiresAuth) {
    return '/login'
  }
})

export default router
