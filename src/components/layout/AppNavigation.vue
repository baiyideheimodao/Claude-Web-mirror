<template>
  <nav
    :class="[
      'fixed top-0 left-0 h-[100vh] z-50 flex flex-col transition-all duration-200 ease-in-out',
      isCollapsed ? 'w-[48px]' : 'w-[260px]',
      'bg-[#fafaf8] border-r border-[#e5e5e4]'
    ]">

    <!-- ========== 展开状态 ========== -->
    <template v-if="!isCollapsed">
      <!-- Logo 区域 -->
      <div class="h-11 px-3 flex items-center justify-between border-b border-[#e5e5e4]/70 shrink-0">
        <div class="flex items-center gap-1.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="22" height="22" x="1" y="1" rx="6" fill="#d97757"/>
            <path d="M7.8 16V9c0-.65.28-1.22.75-1.68C9 6.86 9.64 6.55 10.4 6.55h2.3c1.45 0 2.7 1.18 2.7 2.7 0 .67-.29 1.35-.78 1.83l-2.9 2.92h3.08V16H7.8z" fill="white"/>
          </svg>
          <span class="text-text-100 text-[15px] font-semibold tracking-tight">Claude</span>
        </div>
        <button
          @click="toggleCollapse"
          class="p-1 hover:bg-black/[0.04] rounded transition-colors duration-150"
          title="Close sidebar"
        >
          <svg class="w-[17px] h-[17px] text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- 新建聊天按钮 -->
      <div class="p-2 shrink-0">
        <button
          class="w-full py-[7px] px-3 bg-[#d97757] hover:bg-[#c96a4a] text-white rounded-lg transition-colors duration-150 flex items-center gap-2 text-[13px] font-medium"
          @click="handleNewChat"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>

      <!-- 搜索和自定义 -->
      <div class="px-2 space-y-0.5 mb-1.5 shrink-0">
        <button class="w-full py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] rounded-md transition-colors duration-150 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
        <button class="w-full py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] rounded-md transition-colors duration-150 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          Customize
        </button>
      </div>

      <div class="mx-2.5 border-t border-[#e5e5e4]/70 my-1.5 shrink-0"></div>

      <!-- 主菜单项 -->
      <div class="px-2 space-y-0.5 mb-1.5 shrink-0">
        <button class="w-full py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] rounded-md transition-colors duration-150 flex items-center gap-2">
          <svg class="w-[17px] h-[17px] text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Chats
        </button>
        <button class="w-full py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] rounded-md transition-colors duration-150 flex items-center gap-2">
          <svg class="w-[17px] h-[17px] text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Projects
        </button>
        <button class="w-full py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] rounded-md transition-colors duration-150 flex items-center gap-2">
          <svg class="w-[17px] h-[17px] text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Artifacts
        </button>
        <button class="w-full py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] rounded-md transition-colors duration-150 flex items-center gap-2">
          <svg class="w-[17px] h-[17px] text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code
        </button>
      </div>

      <div class="mx-2.5 border-t border-[#e5e5e4]/70 my-1.5 shrink-0"></div>

      <!-- 最近聊天列表 - 从store获取 -->
      <div class="flex-1 overflow-y-auto min-h-0 px-1 nav-scrollbar">
        <h3 class="text-[11px] font-medium text-[#787774] uppercase tracking-wide px-2.5 mb-1.5 mt-0.5">Recent</h3>
        <ul class="space-y-[1px]">
          <li v-for="chat in recentChatsList" :key="chat.id">
            <button
              class="w-full text-left px-2.5 py-[5px] rounded-md text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] transition-colors duration-150 truncate"
              @click="handleOpenChat(chat)"
            >
              {{ chat.title }}
            </button>
          </li>
          <li v-if="recentChatsList.length === 0">
            <p class="px-2.5 py-[5px] text-[12px] text-[#cfcfce]">No conversations yet</p>
          </li>
        </ul>
      </div>

      <!-- 底部用户区域 -->
      <div class="border-t border-[#e5e5e4]/70 p-2 shrink-0">
        <div class="flex items-center gap-2 px-2 py-1.5 hover:bg-black/[0.04] rounded-md cursor-pointer transition-colors duration-150">
          <div class="w-7 h-7 rounded-full bg-[#e8e6df] flex items-center justify-center text-[11px] font-medium text-[#1a1a1a] shrink-0">
            {{ appStore.userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-[#1a1a1a] truncate leading-tight">{{ appStore.displayName }}</p>
            <p class="text-[11px] text-[#9b9a97] truncate leading-tight">{{ appStore.planName }}</p>
          </div>
          <div class="flex items-center gap-0.5 shrink-0 ml-1">
            <button class="p-1 -mr-1 hover:bg-black/[0.06] rounded transition-colors duration-150" title="Attachments">
              <svg class="w-3.5 h-3.5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button class="p-1 hover:bg-black/[0.06] rounded transition-colors duration-150" title="More options" @click="showUserMenu = !showUserMenu">
              <svg class="w-3.5 h-3.5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- 用户菜单 -->
            <div
              v-if="showUserMenu"
              class="absolute bottom-14 right-2 w-52 bg-white border border-[#e0e0df] rounded-lg shadow-claude-md py-1 z-50"
              style="width: 260px;"
            >
              <div class="px-3 py-2 border-b border-[#e5e5e4]/70">
                <p class="text-[13px] font-medium text-[#1a1a1a]">{{ appStore.displayName }}</p>
                <p class="text-[11px] text-[#9b9a97]">{{ appStore.user?.email || '' }}</p>
              </div>
              <template v-if="appStore.isAuthenticated">
                <button class="w-full px-3 py-2 text-left text-[13px] text-[#5c5b58] hover:bg-black/[0.04] transition-colors" @click="handleSettings">
                  Settings
                </button>
                <button
                  class="w-full px-3 py-2 text-left text-[13px] text-[#d97757] hover:bg-red-50 transition-colors"
                  @click="handleLogout"
                >
                  Sign out
                </button>
              </template>
              <template v-else>
                <button
                  class="w-full px-3 py-2 text-left text-[13px] text-[#d97757] hover:bg-black/[0.04] transition-colors"
                  @click="showLoginModal = true"
                >
                  Sign in
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== 收起状态 ========== -->
    <template v-else>
      <div class="flex flex-col h-full items-center pt-2 pb-2 gap-1">
        <button
          @click="toggleCollapse"
          class="group relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 mb-1"
          title="Open sidebar"
        >
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span class="absolute left-full ml-2 px-2.5 py-1 bg-[#2f2f2f] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
            Open sidebar
            <kbd class="ml-1.5 px-1.5 py-0.5 bg-white/15 rounded text-[10px] font-normal">Ctrl+\</kbd>
          </span>
        </button>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="New chat" @click="handleNewChat">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="Search">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="Customize">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        </button>

        <div class="w-6 border-t border-[#e5e5e4] my-1"></div>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="Chats">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="Projects">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </button>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="Artifacts">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>

        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="Code">
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>

        <div class="flex-1 min-h-[8px]"></div>

        <button class="w-8 h-8 rounded-full bg-[#e8e6df] flex items-center justify-center text-[10px] font-medium text-[#1a1a1a] hover:ring-2 hover:ring-[#d97757]/30 transition-all" :title="appStore.displayName">
          {{ appStore.userInitials }}
        </button>
      </div>
    </template>

    <!-- 登录弹窗 -->
    <div v-if="showLoginModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30" @click.self="showLoginModal = false">
      <div class="bg-white rounded-xl shadow-claude-lg w-[400px] max-w-[90vw] p-6 relative">
        <button class="absolute top-4 right-4 p-1 hover:bg-black/[0.04] rounded" @click="showLoginModal = false">
          <svg class="w-5 h-5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h2 class="text-xl font-semibold text-[#1a1a1a] mb-1">Sign in to Claude</h2>
        <p class="text-[13px] text-[#9b9a97] mb-6">Enter your credentials to continue</p>

        <div class="space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-1">Username / Email</label>
            <input
              v-model="loginForm.username"
              type="text"
              class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[14px] text-[#1a1a1a] placeholder-[#cfcfce] focus:outline-none focus:border-[#d97757] transition-colors"
              placeholder="Enter username or email"
              @keydown.enter="handleLogin"
            />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-1">Password</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[14px] text-[#1a1a1a] placeholder-[#cfcfce] focus:outline-none focus:border-[#d97757] transition-colors"
              placeholder="Enter password"
              @keydown.enter="handleLogin"
            />
          </div>
          <p v-if="loginError" class="text-[13px] text-red-500">{{ loginError }}</p>
          <button
            :disabled="isLoggingIn"
            class="w-full py-2.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:opacity-50 text-white rounded-lg transition-colors duration-150 text-[14px] font-medium"
            @click="handleLogin"
          >
            {{ isLoggingIn ? 'Signing in...' : 'Sign in' }}
          </button>
          <p class="text-center text-[12px] text-[#9b9a97]">
            Don't have an account?
            <button class="text-[#d97757] hover:underline" @click="showRegisterMode = true; showLoginModal = false">Sign up</button>
          </p>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegisterModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30" @click.self="showRegisterModal = false">
      <div class="bg-white rounded-xl shadow-claude-lg w-[420px] max-w-[90vw] p-6 relative">
        <button class="absolute top-4 right-4 p-1 hover:bg-black/[0.04] rounded" @click="showRegisterModal = false">
          <svg class="w-5 h-5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h2 class="text-xl font-semibold text-[#1a1a1a] mb-1">Create your account</h2>
        <p class="text-[13px] text-[#9b9a97] mb-6">Join Claude Mirror to start chatting</p>

        <div class="space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-1">Username</label>
            <input v-model="registerForm.username" type="text" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[14px] text-[#1a1a1a] placeholder-[#cfcfce] focus:outline-none focus:border-[#d97757] transition-colors" placeholder="Choose a username" />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-1">Email</label>
            <input v-model="registerForm.email" type="email" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[14px] text-[#1a1a1a] placeholder-[#cfcfce] focus:outline-none focus:border-[#d97757] transition-colors" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#5c5b58] mb-1">Password</label>
            <input v-model="registerForm.password" type="password" class="w-full px-3 py-2 border border-[#e0e0df] rounded-lg text-[14px] text-[#1a1a1a] placeholder-[#cfcfce] focus:outline-none focus:border-[#d97757] transition-colors" placeholder="At least 8 characters" />
          </div>
          <p v-if="registerError" class="text-[13px] text-red-500">{{ registerError }}</p>
          <button
            :disabled="isRegistering"
            class="w-full py-2.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:opacity-50 text-white rounded-lg transition-colors duration-150 text-[14px] font-medium"
            @click="handleRegister"
          >
            {{ isRegistering ? 'Creating...' : 'Create account' }}
          </button>
          <p class="text-center text-[12px] text-[#9b9a97]">
            Already have an account?
            <button class="text-[#d97757] hover:underline" @click="showLoginModal = true; showRegisterModal = false">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import type { Dialog } from '@/types/api'

const emit = defineEmits<{
  (e: 'sidebar-change', collapsed: boolean): void
}>()

const router = useRouter()
const appStore = useAppStore()

const isCollapsed = ref(false)
const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value }
watch(isCollapsed, (val) => { emit('sidebar-change', val) })

// UI状态
const showUserMenu = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showRegisterMode = ref(false)
const isLoggingIn = ref(false)
const isRegistering = ref(false)
const loginError = ref('')
const registerError = ref('')

// 表单数据
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '' })

// 从store获取最近聊天列表
const recentChatsList = computed<Dialog[]>(() => {
  if (appStore.recentChatsFlat.length > 0) return appStore.recentChatsFlat as any
  return []
})

/** 打开聊天 */
const handleOpenChat = async (chat: Dialog) => {
  router.push(`/chat/${chat.id}`)
}

/** 新建聊天 */
const handleNewChat = () => {
  router.push('/')
}

/** 登录 */
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) return
  isLoggingIn.value = true
  loginError.value = ''
  const result = await appStore.login(loginForm.value.username, loginForm.value.password)
  if (result.success) {
    showLoginModal.value = false
    loginForm.value = { username: '', password: '' }
  } else {
    loginError.value = result.message || '登录失败，请检查用户名和密码'
  }
  isLoggingIn.value = false
}

/** 注册 */
const handleRegister = async () => {
  const form = registerForm.value
  if (!form.username || !form.email || !form.password) return
  if (form.password.length < 8) { registerError.value = '密码至少需要8位'; return }

  isRegistering.value = true
  registerError.value = ''
  const result = await appStore.register(form)
  if (result.success) {
    showRegisterModal.value = false
    showLoginModal.value = true
    loginForm.value.username = form.username
    registerForm.value = { username: '', email: '', password: '' }
  } else {
    registerError.value = result.message || '注册失败'
  }
  isRegistering.value = false
}

/** 登出 */
const handleLogout = () => {
  showUserMenu.value = false
  appStore.logout()
  router.push('/')
}

/** 设置（预留） */
const handleSettings = () => {
  showUserMenu.value = false
}
</script>
