<template>
  <nav
    :class="[
      'fixed top-0 left-0 h-[100vh] z-50 flex flex-col transition-all duration-200 ease-in-out',
      isCollapsed ? 'w-[48px]' : 'w-[260px]',
      'bg-[#fafaf8] border-r border-[#e5e5e4]'
    ]"
  >

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
        <!-- 收起按钮 -->
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
        <button class="w-full py-[7px] px-3 bg-[#d97757] hover:bg-[#c96a4a] text-white rounded-lg transition-colors duration-150 flex items-center gap-2 text-[13px] font-medium">
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

      <!-- 分割线 -->
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

      <!-- 分割线 -->
      <div class="mx-2.5 border-t border-[#e5e5e4]/70 my-1.5 shrink-0"></div>

      <!-- 最近聊天列表 -->
      <div class="flex-1 overflow-y-auto min-h-0 px-1 nav-scrollbar">
        <h3 class="text-[11px] font-medium text-[#787774] uppercase tracking-wide px-2.5 mb-1.5 mt-0.5">Recent</h3>
        <ul class="space-y-[1px]">
          <li v-for="chat in recentChats" :key="chat.id">
            <button class="w-full text-left px-2.5 py-[5px] rounded-md text-[13px] text-[#5c5b58] hover:text-[#3d3c3a] hover:bg-black/[0.04] transition-colors duration-150 truncate">
              {{ chat.title }}
            </button>
          </li>
        </ul>
      </div>

      <!-- 底部用户区域 -->
      <div class="border-t border-[#e5e5e4]/70 p-2 shrink-0">
        <div class="flex items-center gap-2 px-2 py-1.5 hover:bg-black/[0.04] rounded-md cursor-pointer transition-colors duration-150">
          <div class="w-7 h-7 rounded-full bg-[#e8e6df] flex items-center justify-center text-[11px] font-medium text-[#1a1a1a] shrink-0">IF</div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-[#1a1a1a] truncate leading-tight">Isharaoy Fullerjr</p>
            <p class="text-[11px] text-[#9b9a97] truncate leading-tight">Pro plan</p>
          </div>
          <div class="flex items-center gap-0.5 shrink-0 ml-1">
            <button class="p-1 -mr-1 hover:bg-black/[0.06] rounded transition-colors duration-150" title="Attachments">
              <svg class="w-3.5 h-3.5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button class="p-1 hover:bg-black/[0.06] rounded transition-colors duration-150" title="More options">
              <svg class="w-3.5 h-3.5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== 收起状态 ========== -->
    <template v-else>
      <!-- 收起状态的图标栏 -->
      <div class="flex flex-col h-full items-center pt-2 pb-2 gap-1">

        <!-- Open sidebar 按钮（带tooltip样式） -->
        <button
          @click="toggleCollapse"
          class="group relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 mb-1"
          title="Open sidebar"
        >
          <svg class="w-[18px] h-[18px] text-[#5c5b58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <!-- tooltip -->
          <span class="absolute left-full ml-2 px-2.5 py-1 bg-[#2f2f2f] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
            Open sidebar
            <kbd class="ml-1.5 px-1.5 py-0.5 bg-white/15 rounded text-[10px] font-normal">Ctrl+\</kbd>
          </span>
        </button>

        <!-- 图标菜单项 - 竖向排列 -->
        <button class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors duration-150 group" title="New chat">
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

        <!-- 分隔线 -->
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

        <!-- 弹性空间 -->
        <div class="flex-1 min-h-[8px]"></div>

        <!-- 底部用户头像 -->
        <button class="w-8 h-8 rounded-full bg-[#e8e6df] flex items-center justify-center text-[10px] font-medium text-[#1a1a1a] hover:ring-2 hover:ring-[#d97757]/30 transition-all" title="Isharaoy Fullerjr">
          IF
        </button>
      </div>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'sidebar-change', collapsed: boolean): void
}>()

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

watch(isCollapsed, (val) => {
  emit('sidebar-change', val)
})

const recentChats = [
  { id: 1, title: '在newapi上接入千问官网API' },
  { id: 2, title: 'WorkBuddy第三方API对接错误' },
  { id: 3, title: 'CCSwitch对接第三方按次API' },
  { id: 4, title: '通过兑换码追踪用户退款信息' },
  { id: 5, title: '请求头类型错误导致API调用失败' },
  { id: 6, title: '为灵识MAX生成自定义首页HTML' },
  { id: 7, title: 'Integer length error troubleshoo...' },
  { id: 8, title: '使用artifact编辑代码' },
  { id: 9, title: '灵识AI首页HTML自定义' },
  { id: 10, title: 'GPT-image-1.5 unsupported oper...' },
  { id: 11, title: 'Newapi网站节点监控部署' },
  { id: 12, title: 'Database query type conversion...' },
  { id: 13, title: 'Cookie字符串格式错误' },
  { id: 14, title: '从JSON数据提取装备属性' },
  { id: 15, title: 'Documents and templates' },
  { id: 16, title: 'Apps and websites' },
  { id: 17, title: 'Claude artifacts的用途' },
  { id: 18, title: 'Claude项目的实际应用' },
  { id: 19, title: 'How compound interest works' },
  { id: 20, title: 'Claude的桌面端和CLI选项' },
  { id: 21, title: 'VSCode中Claude扩展接入第三方...' },
  { id: 22, title: '完全删除openclaw的方法' },
  { id: 23, title: '文本转换为表格' },
  { id: 24, title: 'newapi平台兑换码管理员配置' },
  { id: 25, title: 'Cline对接第三方API' },
  { id: 26, title: 'Claude Pro官网使用量查询' },
  { id: 27, title: '第三方API生图软件对接方案' }
]
</script>
