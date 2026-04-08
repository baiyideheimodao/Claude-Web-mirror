import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Claude' }
  },
  {
    path: '/chat/:id?',
    name: 'Chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: 'Chat' }
  },
  {
    path: '/chats',
    name: 'Chats',
    component: () => import('@/views/ChatsView.vue'),
    meta: { title: 'Chats' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: 'Projects' }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { title: 'Project' }
  },
  {
    path: '/artifacts',
    name: 'Artifacts',
    component: () => import('@/views/ArtifactsView.vue'),
    meta: { title: 'Artifacts' }
  },
  {
    path: '/code',
    name: 'Code',
    component: () => import('@/views/CodeView.vue'),
    meta: { title: 'Code' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Settings' }
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
})

export default router
