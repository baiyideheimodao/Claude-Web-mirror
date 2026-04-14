<template>
  <nav
    :class="[
      'fixed top-0 left-0 h-[100vh] z-50 flex flex-col transition-all duration-200 ease-in-out',
      isCollapsed ? 'w-[48px]' : 'w-[260px]',
      'bg-[#fafaf8] border-r border-[#e5e5e4] dark:bg-[#1a1a1a] dark:border-white/10'
    ]">

    <!-- ========== 展开状态 ========== -->
    <template v-if="!isCollapsed">
      <!-- Logo 区域 -->
      <div class="h-11 px-3 flex items-center justify-between border-b border-[#e5e5e4]/70 dark:border-white/10 shrink-0">
        <div class="flex items-center gap-1.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="22" height="22" x="1" y="1" rx="6" fill="#d97757"/>
            <path d="M7.8 16V9c0-.65.28-1.22.75-1.68C9 6.86 9.64 6.55 10.4 6.55h2.3c1.45 0 2.7 1.18 2.7 2.7 0 .67-.29 1.35-.78 1.83l-2.9 2.92h3.08V16H7.8z" fill="white"/>
          </svg>
          <span class="text-text-100 text-[15px] font-semibold tracking-tight">Claude</span>
        </div>
        <button
          @click="toggleCollapse"
          class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded transition-colors duration-150"
          title="关闭侧边栏 (Ctrl+\)"
        >
          <svg class="w-[17px] h-[17px] text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- 新建聊天按钮 -->
      <div class="p-2 shrink-0">
        <router-link
          to="/"
          class="nav-item-btn w-full"
          @click="handleNewChat"
        >
          <svg class="w-4 h-4 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          新建聊天
        </router-link>
      </div>

      <!-- 搜索和自定义 -->
      <div class="px-2 space-y-0.5 mb-1.5 shrink-0">
        <button
          class="nav-item-btn w-full"
          title="搜索 (Ctrl+K)"
          @click="handleSearch"
        >
          <svg class="w-4 h-4 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          搜索
        </button>
        <button
          class="nav-item-btn w-full"
          title="自定义"
          @click="$router.push('/settings')"
        >
          <svg class="w-4 h-4 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          自定义
        </button>
      </div>

      <div class="mx-2.5 border-t border-[#e5e5e4]/70 dark:border-white/10 my-1.5 shrink-0"></div>

      <!-- 主菜单项 - 全部可点击路由 -->
      <div class="px-2 space-y-0.5 mb-1.5 shrink-0">
        <router-link to="/chats" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            对话
          </button>
        </router-link>
        <router-link to="/projects" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            项目
          </button>
        </router-link>
        <router-link to="/artifacts" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            制品
          </button>
        </router-link>
        <router-link to="/code" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            代码
          </button>
        </router-link>
      </div>

      <div class="mx-2.5 border-t border-[#e5e5e4]/70 dark:border-white/10 my-1.5 shrink-0"></div>

      <!-- 最近聊天列表 -->
      <div class="flex-1 overflow-y-auto min-h-0 px-1 nav-scrollbar">
        <h3 class="text-[11px] font-medium text-[#787774] uppercase tracking-wide px-2.5 mb-1.5 mt-0.5">最近对话</h3>
        <ul class="space-y-[1px]">
          <li v-for="chat in recentChatsList" :key="chat.id">
            <router-link :to="`/chat/${chat.id}`" custom v-slot="{ navigate }">
              <button
                class="w-full text-left px-2.5 py-[5px] rounded-md text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] dark:text-gray-400 dark:hover:text-gray-200 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors duration-150 truncate"
                @click="navigate"
              >{{ chat.title }}</button>
            </router-link>
          </li>
          <li v-if="recentChatsList.length === 0 && appStore.isAuthenticated">
            <p class="px-2.5 py-[5px] text-[12px] text-[#cfcfce]">暂无对话</p>
          </li>
          <li v-if="!appStore.isAuthenticated">
            <p class="px-2.5 py-[5px] text-[12px] text-[#cfcfce]">
              <button class="text-[#d97757] hover:underline" @click="$router.push('/login')">登录</button> 后查看对话
            </p>
          </li>
        </ul>
      </div>

      <!-- 底部用户区域 -->
      <div class="border-t border-[#e5e5e4]/70 dark:border-white/10 p-2 shrink-0 relative">
        <div class="flex items-center gap-2 px-2 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md cursor-pointer transition-colors duration-150" @click="showUserMenu = !showUserMenu">
          <div class="w-7 h-7 rounded-full bg-[#e8e6df] dark:bg-white/10 flex items-center justify-center text-[11px] font-medium text-[#1a1a1a] dark:text-white shrink-0">
            {{ appStore.userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-[#1a1a1a] dark:text-white truncate leading-tight">{{ appStore.displayName }}</p>
            <p class="text-[11px] text-[#9b9a97] dark:text-gray-500 truncate leading-tight">{{ appStore.planName }}</p>
          </div>
          <div class="flex items-center gap-0.5 shrink-0 ml-1">
            <button class="p-1 -mr-1 hover:bg-black/[0.06] dark:hover:bg-white/5 rounded transition-colors duration-150" title="Attachments" @click.stop>
              <svg class="w-3.5 h-3.5 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button class="p-1 hover:bg-black/[0.06] dark:hover:bg-white/5 rounded transition-colors duration-150" title="More options" @click.stop="showUserMenu = !showUserMenu">
              <svg class="w-3.5 h-3.5 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 用户下拉菜单 -->
        <Transition name="dropdown">
          <div
            v-if="showUserMenu"
            class="absolute bottom-full left-2 right-2 mb-1 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-lg shadow-claude-md py-1 z-50"
          >
            <div class="px-3 py-2 border-b border-[#e5e5e4]/70 dark:border-white/10">
              <p class="text-[13px] font-medium text-[#1a1a1a] dark:text-white">{{ appStore.displayName }}</p>
              <p class="text-[11px] text-[#9b9a97] dark:text-gray-500">{{ appStore.user?.email || '' }}</p>
            </div>
            <template v-if="appStore.isAuthenticated">
              <button class="w-full px-3 py-2 text-left text-[13px] text-[#5c5b58] dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors flex items-center gap-2" @click="handleSettings">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                设置
              </button>
              <button
                class="w-full px-3 py-2 text-left text-[13px] text-[#d97757] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                @click="handleLogout"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                退出登录
              </button>
            </template>
            <template v-else>
              <button
                class="w-full px-3 py-2 text-left text-[13px] text-[#d97757] hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors"
                @click="$router.push('/login'); showUserMenu = false"
              >
                登录
              </button>
            </template>
          </div>
        </Transition>
      </div>
    </template>

    <!-- ========== 收起状态 ========== -->
    <template v-else>
      <div class="flex flex-col h-full items-center pt-2 pb-2 gap-1">
        <button
          @click="toggleCollapse"
          class="icon-btn group relative"
          title="打开侧边栏 (Ctrl+\\)"
        >
          <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span class="tooltip">打开侧边栏 <kbd class="kbd">Ctrl+\</kbd></span>
        </button>

        <router-link to="/" custom v-slot="{ navigate }">
          <button class="icon-btn" title="新建聊天" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </router-link>

        <button class="icon-btn" title="搜索" @click="handleSearch">
          <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <button class="icon-btn" title="自定义" @click="$router.push('/settings')">
          <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        </button>

        <div class="w-6 border-t border-[#e5e5e4] dark:border-white/10 my-1"></div>

        <router-link to="/chats" custom v-slot="{ navigate }">
          <button class="icon-btn" title="对话" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </router-link>

        <router-link to="/projects" custom v-slot="{ navigate }">
          <button class="icon-btn" title="项目" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
        </router-link>

        <router-link to="/artifacts" custom v-slot="{ navigate }">
          <button class="icon-btn" title="制品" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
        </router-link>

        <router-link to="/code" custom v-slot="{ navigate }">
          <button class="icon-btn" title="代码" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </router-link>

        <div class="flex-1 min-h-[8px]"></div>

        <button
          class="w-8 h-8 rounded-full bg-[#e8e6df] dark:bg-white/10 flex items-center justify-center text-[10px] font-medium text-[#1a1a1a] dark:text-white hover:ring-2 hover:ring-[#d97757]/30 transition-all cursor-pointer"
          :title="appStore.displayName"
          @click="showUserMenu = true; toggleCollapse()"
        >
          {{ appStore.userInitials }}
        </button>
      </div>
    </template>

    <!-- 登录弹窗 -->
    <Teleport to="body">
      <div v-if="showLoginModal" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="showLoginModal = false">
        <div class="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-claude-lg w-[400px] max-w-[90vw] p-6 relative animate-in">
          <button class="absolute top-4 right-4 p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded" @click="showLoginModal = false">
            <svg class="w-5 h-5 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <h2 class="text-xl font-semibold text-[#1a1a1a] dark:text-white mb-1">登录 Claude</h2>
          <p class="text-[13px] text-[#9b9a97] dark:text-gray-500 mb-6">请输入您的凭据以继续</p>

          <div class="space-y-4">
            <div>
              <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">用户名 / 邮箱</label>
              <input
                v-model="loginForm.username"
                type="text"
                class="modal-input"
                placeholder="输入用户名或邮箱"
                @keydown.enter="handleLogin"
              />
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">密码</label>
              <input
                v-model="loginForm.password"
                type="password"
                class="modal-input"
                placeholder="输入密码"
                @keydown.enter="handleLogin"
              />
            </div>
            <p v-if="loginError" class="text-[13px] text-red-500">{{ loginError }}</p>
            <button
              :disabled="isLoggingIn"
              class="w-full py-2.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:opacity-50 text-white rounded-lg transition-colors duration-150 text-[14px] font-medium"
              @click="handleLogin"
            >
              {{ isLoggingIn ? '登录中...' : '登录' }}
            </button>
            <p class="text-center text-[12px] text-[#9b9a97] dark:text-gray-500">
              还没有账号？
              <button class="text-[#d97757] hover:underline" @click="switchToRegister">注册</button>
            </p>
          </div>
        </div>
      </div>

      <!-- 注册弹窗 -->
      <div v-if="showRegisterModal" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="showRegisterModal = false">
        <div class="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-claude-lg w-[420px] max-w-[90vw] p-6 relative animate-in">
          <button class="absolute top-4 right-4 p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded" @click="showRegisterModal = false">
            <svg class="w-5 h-5 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <h2 class="text-xl font-semibold text-[#1a1a1a] dark:text-white mb-1">创建您的账号</h2>
          <p class="text-[13px] text-[#9b9a97] dark:text-gray-500 mb-6">加入 Claude Mirror，开始聊天</p>

          <div class="space-y-4">
            <div>
              <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">用户名</label>
              <input v-model="registerForm.username" type="text" class="modal-input" placeholder="选择用户名" />
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">邮箱</label>
              <input v-model="registerForm.email" type="email" class="modal-input" placeholder="you@example.com" />
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">Password</label>
              <input v-model="registerForm.password" type="password" class="modal-input" placeholder="至少8位字符" />
            </div>
            <p v-if="registerError" class="text-[13px] text-red-500">{{ registerError }}</p>
            <button
              :disabled="isRegistering"
              class="w-full py-2.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:opacity-50 text-white rounded-lg transition-colors duration-150 text-[14px] font-medium"
              @click="handleRegister"
            >
              {{ isRegistering ? '创建中...' : '创建账号' }}
            </button>
            <p class="text-center text-[12px] text-[#9b9a97] dark:text-gray-500">
              已有账号？
              <button class="text-[#d97757] hover:underline" @click="showLoginModal = true; showRegisterModal = false">登录</button>
            </p>
          </div>
        </div>
      </div>

      <!-- 搜索弹窗 -->
      <div v-if="showSearchModal" class="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/30 backdrop-blur-sm" @click.self="showSearchModal = false">
        <div class="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-claude-lg w-[560px] max-w-[90vw] overflow-hidden animate-in">
          <div class="flex items-center border-b border-[#e5e5e4] dark:border-white/10 px-4">
            <svg class="w-5 h-5 text-[#9b9a97] dark:text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              autofocus
              class="flex-1 py-3 bg-transparent border-none outline-none text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] dark:placeholder-gray-500"
              placeholder="搜索对话和项目..."
              @keydown.escape="showSearchModal = false"
              @input="handleSearchInput"
            />
            <button class="ml-2 p-1 hover:bg-black/[0.04] rounded" @click="showSearchModal = false">
              <svg class="w-4 h-4 text-[#9b9a97] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <kbd class="ml-2 px-1.5 py-0.5 bg-[#f0ede7] dark:bg-white/10 rounded text-[11px] text-[#787774] font-mono">Esc</kbd>
          </div>
          <div v-if="searchResults.length > 0" class="max-h-[360px] overflow-y-auto">
            <div
              v-for="(item, idx) in searchResults"
              :key="idx"
              :class="['flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/5', searchIdx === idx ? 'bg-[#f5f4f0] dark:bg-white/5' : '']"
              @click="selectResult(item)"
              @mouseenter="searchIdx = idx"
            >
              <svg class="w-4 h-4 text-[#cfcfce] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path v-if="item.type === 'chat'" stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-medium text-[#1a1a1a] dark:text-white truncate">{{ item.title }}</p>
                <p class="text-[11px] text-[#cfcfce]">{{ item.type === 'chat' ? '对话' : '项目' }} · {{ formatTime(item.time) }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="searchQuery && searchResults.length === 0" class="py-8 text-center">
            <p class="text-[13px] text-[#9b9a97] dark:text-gray-500">未找到 "{{ searchQuery }}" 的结果</p>
          </div>
          <div v-else class="py-6 text-center">
            <p class="text-[13px] text-[#9b9a97] dark:text-gray-500">输入内容以搜索...</p>
          </div>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'

const emit = defineEmits<{
  (e: 'sidebar-change', collapsed: boolean): void
}>()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isCollapsed = ref(false)
const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value }
watch(isCollapsed, (val) => { emit('sidebar-change', val) })

// UI状态
const showUserMenu = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const isLoggingIn = ref(false)
const isRegistering = ref(false)
const loginError = ref('')
const registerError = ref('')

// 搜索
const showSearchModal = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchResults = ref<any[]>([])
const searchIdx = ref(0)

// 表单数据
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '' })

// 从store获取最近聊天列表
const recentChatsList = computed(() => {
  if (appStore.recentChatsFlat.length > 0) return appStore.recentChatsFlat as any
  return []
})

/** 新建聊天 */
const handleNewChat = () => {
  router.push('/')
}

/** 搜索 */
const handleSearch = async () => {
  showSearchModal.value = true
  await nextTick()
  searchInputRef.value?.focus()
}

const handleSearchInput = () => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) {
    searchResults.value = []
    return
  }
  const chats = appStore.recentChatsFlat as any[]
  const results = chats.filter(c => c.title?.toLowerCase().includes(q)).map(c => ({ ...c, type: 'chat' }))
  // TODO: also search projects
  searchResults.value = results.slice(0, 20)
  searchIdx.value = 0
}

const selectResult = (item: any) => {
  showSearchModal.value = false
  searchQuery.value = ''
  if (item.type === 'chat') {
    router.push(`/chat/${item.id}`)
  } else {
    router.push(`/project/${item.id}`)
  }
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

/** 注册切换 */
const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
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

/** 设置 */
const handleSettings = () => {
  showUserMenu.value = false
  router.push('/settings')
}

/** 格式化时间 */
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffMin < 1440) return `今天`
  if (diffMin < 2880) return `昨天`
  return `${Math.floor(diffMin / 1440)} 天前`
}

// 全局快捷键
onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // Ctrl+\ 切换侧栏
  if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
    e.preventDefault()
    toggleCollapse()
  }
  // Ctrl+K 搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    handleSearch()
  }
}
const handleGlobalKeydown = handleGlobalKeyDown

// 点击外部关闭用户菜单
watch(showUserMenu, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener('click', closeUserMenuOnClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', closeUserMenuOnClickOutside)
  }
})

const closeUserMenuOnClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (showUserMenu.value && !target.closest('.relative') && !target.closest('[class*="bottom"]')) {
    // 延迟关闭以避免与点击事件冲突
    setTimeout(() => { showUserMenu.value = false }, 50)
  }
}
</script>

<style scoped>
.nav-item-btn {
  @apply py-[6px] px-2.5 text-left text-[13px] text-[#5c5b58] dark:text-gray-400 hover:text-[#3d3c3a] dark:hover:text-gray-200 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors duration-150 flex items-center gap-2;
}
.nav-icon { color: #787774; }
.dark .nav-icon { color: #6b6a67; }
.icon-btn {
  @apply w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] dark:hover:bg-white/5 transition-colors duration-150;
}
.icon-svg { color: #5c5b58; }
.dark .icon-svg { color: #9b9a97; }
.tooltip {
  @apply absolute left-full ml-2 px-2.5 py-1 bg-[#2f2f2f] text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg rounded-md;
}
.kbd {
  @apply px-1.5 py-0.5 bg-[#f0ede7] dark:bg-white/10 rounded text-[10px] text-[#787774] font-mono;
}
.modal-input {
  @apply w-full px-3 py-2 border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] dark:placeholder-gray-500 focus:outline-none focus:border-[#d97757];
}
.nav-scrollbar::-webkit-scrollbar { width: 4px; }
.nav-scrollbar::-webkit-scrollbar-track { background: transparent; }
.nav-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e4; border-radius: 4px; }
.dark .nav-scrollbar::-webkit-scrollbar-thumb { background: #3a3a3a; }

/* Dropdown animation */
.dropdown-enter-active { transition: all 0.15s ease-out; }
.dropdown-leave-active { transition: all 0.1s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(8px); }
.dropdown-leave-to { opacity: 0; transform: translateY(4px); }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-in { animation: fadeIn 0.15s ease-out; }
</style>
