<template>
  <nav
    :class="[
      'fixed top-0 left-0 h-[100vh] z-50 flex flex-col transition-all duration-200 ease-in-out',
      isCollapsed ? 'w-[48px]' : 'w-[288px]',
      'bg-[#fafaf8] border-r border-[#e5e5e4] dark:bg-[#1f1f1e] dark:border-white/10'
    ]">

    <!-- ========== 展开状态 ========== -->
    <template v-if="!isCollapsed">
      <!-- Logo 区域 -->
      <div class="h-12 px-3 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 16" class="h-4 flex-shrink-0 text-text-100" height="16" fill="currentColor" aria-label="Claude">
            <path d="M7.98 15.73C6.50667 15.73 5.17667 15.4367 3.99 14.85C2.81 14.2567 1.88 13.4167 1.2 12.33C0.526669 11.2367 0.190002 9.96334 0.190002 8.51001C0.190002 7.01001 0.526669 5.67334 1.2 4.50001C1.87334 3.32668 2.8 2.41668 3.98 1.77001C5.16667 1.11668 6.49334 0.790009 7.96 0.790009C8.88667 0.790009 9.81667 0.896676 10.75 1.11001C11.69 1.32334 12.5033 1.64001 13.19 2.06001V5.36001H12.29C12.05 4.22668 11.5867 3.36334 10.9 2.77001C10.2133 2.17668 9.24 1.88001 7.98 1.88001C6.85334 1.88001 5.91334 2.15334 5.16 2.70001C4.40667 3.24001 3.84667 3.98334 3.48 4.93001C3.12 5.87001 2.94 6.94668 2.94 8.16001C2.94 9.37334 3.14667 10.4733 3.56 11.46C3.97334 12.44 4.57667 13.2167 5.37 13.79C6.16334 14.3567 7.11 14.64 8.21 14.64C8.97667 14.64 9.63667 14.4733 10.19 14.14C10.75 13.8 11.2167 13.3533 11.59 12.8C11.97 12.2467 12.3367 11.5667 12.69 10.76H13.63L12.99 14.43C12.35 14.8567 11.5733 15.18 10.66 15.4C9.75334 15.62 8.86 15.73 7.98 15.73ZM15.15 14.63C15.4833 14.5833 15.7433 14.53 15.93 14.47C16.1167 14.41 16.2633 14.3167 16.37 14.19C16.4767 14.0567 16.53 13.8733 16.53 13.64V2.96001L15.15 2.31001V1.65001L18.12 0.26001H18.91V13.64C18.91 13.8733 18.9633 14.0567 19.07 14.19C19.1767 14.3167 19.3233 14.41 19.51 14.47C19.6967 14.53 19.96 14.5833 20.3 14.63V15.5H15.15V14.63ZM24.44 15.73C23.8867 15.73 23.39 15.6167 22.95 15.39C22.51 15.1567 22.1667 14.8367 21.92 14.43C21.68 14.0233 21.56 13.5567 21.56 13.03C21.56 12.2633 21.7967 11.6233 22.27 11.11C22.75 10.5967 23.47 10.2033 24.43 9.93001L27.87 8.96001V7.56001C27.87 6.85334 27.7033 6.31668 27.37 5.95001C27.0433 5.58334 26.5633 5.40001 25.93 5.40001C25.37 5.40001 24.93 5.57668 24.61 5.93001C24.2967 6.27668 24.14 6.75668 24.14 7.37001V8.35001H22.47C22.2833 8.23001 22.1367 8.06334 22.03 7.85001C21.93 7.63668 21.88 7.40334 21.88 7.15001C21.88 6.67668 22.06 6.24001 22.42 5.84001C22.78 5.43334 23.2633 5.11334 23.87 4.88001C24.4833 4.64668 25.16 4.53001 25.9 4.53001C26.8133 4.53001 27.5933 4.67334 28.24 4.96001C28.8933 5.24668 29.39 5.66668 29.73 6.22001C30.0767 6.77334 30.25 7.43668 30.25 8.21001V13.5C30.25 13.7333 30.29 13.9133 30.37 14.04C30.45 14.1667 30.5867 14.2667 30.78 14.34C30.98 14.4133 31.2633 14.4767 31.63 14.53V15.39C31.0967 15.5967 30.5633 15.7 30.03 15.7C29.4367 15.7 28.9567 15.56 28.59 15.28C28.23 15 28.0067 14.6 27.92 14.08C27.44 14.62 26.9067 15.03 26.32 15.31C25.7333 15.59 25.1067 15.73 24.44 15.73ZM25.62 14.13C26.0067 14.13 26.3967 14.0433 26.79 13.87C27.1833 13.69 27.5433 13.4433 27.87 13.13V9.87001L25.43 10.61C24.9233 10.7567 24.5433 10.99 24.29 11.31C24.0433 11.6233 23.92 12.0267 23.92 12.52C23.92 12.8267 23.9933 13.1033 24.14 13.35C24.2867 13.59 24.49 13.78 24.75 13.92C25.01 14.06 25.3 14.13 25.62 14.13ZM36.56 15.73C35.48 15.73 34.68 15.4467 34.16 14.88C33.6467 14.3133 33.39 13.53 33.39 12.53V6.91001L32.01 6.37001V5.70001L34.98 4.53001H35.77V12.12C35.77 12.7533 35.9233 13.2233 36.23 13.53C36.5433 13.8367 37.0133 13.99 37.64 13.99C38.0533 13.99 38.4833 13.8967 38.93 13.71C39.3833 13.5167 39.8 13.27 40.18 12.97V6.91001L38.8 6.37001V5.70001L41.77 4.53001H42.56V12.91C42.56 13.17 42.6133 13.37 42.72 13.51C42.8333 13.65 42.9833 13.7533 43.17 13.82C43.3567 13.88 43.6167 13.9333 43.95 13.98V14.84L40.97 15.69H40.18V13.96C39.6667 14.4933 39.0867 14.9233 38.44 15.25C37.8 15.57 37.1733 15.73 36.56 15.73ZM49.61 15.73C48.7367 15.73 47.9567 15.51 47.27 15.07C46.5833 14.6233 46.0467 14.02 45.66 13.26C45.28 12.5 45.09 11.66 45.09 10.74C45.09 9.56668 45.3167 8.51001 45.77 7.57001C46.2233 6.63001 46.8733 5.89001 47.72 5.35001C48.5733 4.80334 49.5767 4.53001 50.73 4.53001C51.0767 4.53001 51.43 4.56668 51.79 4.64001C52.15 4.70668 52.4967 4.81001 52.83 4.95001V2.96001L51.45 2.31001V1.65001L54.42 0.26001H55.21V12.91C55.21 13.17 55.2633 13.37 55.37 13.51C55.4833 13.65 55.6333 13.7533 55.82 13.82C56.0067 13.88 56.2667 13.9333 56.6 13.98V14.84L53.62 15.69H52.83V14.39C52.3833 14.8167 51.8867 15.1467 51.34 15.38C50.7933 15.6133 50.2167 15.73 49.61 15.73ZM50.6 14.12C50.9867 14.12 51.3733 14.0467 51.76 13.9C52.1467 13.7467 52.5033 13.5367 52.83 13.27V6.38001C52.2567 5.92001 51.6167 5.69001 50.91 5.69001C50.1767 5.69001 49.5567 5.89001 49.05 6.29001C48.55 6.68334 48.1767 7.21334 47.93 7.88001C47.69 8.54668 47.57 9.28334 47.57 10.09C47.57 10.8567 47.6767 11.5433 47.89 12.15C48.11 12.7567 48.4467 13.2367 48.9 13.59C49.3533 13.9433 49.92 14.12 50.6 14.12ZM62.93 15.73C61.9433 15.73 61.0533 15.4967 60.26 15.03C59.4733 14.5567 58.8567 13.9033 58.41 13.07C57.9633 12.2367 57.74 11.3 57.74 10.26C57.74 9.18001 57.9667 8.20334 58.42 7.33001C58.88 6.45668 59.51 5.77334 60.31 5.28001C61.1167 4.78001 62.0167 4.53001 63.01 4.53001C63.77 4.53001 64.4667 4.68668 65.1 5.00001C65.7333 5.31334 66.2567 5.76001 66.67 6.34001C67.09 6.92001 67.37 7.59001 67.51 8.35001L60.14 10.66C60.3333 11.62 60.7267 12.38 61.32 12.94C61.92 13.4933 62.67 13.77 63.57 13.77C64.31 13.77 64.9767 13.5733 65.57 13.18C66.17 12.78 66.7 12.18 67.16 11.38L67.93 11.63C67.7633 12.4433 67.44 13.16 66.96 13.78C66.4867 14.4 65.9 14.88 65.2 15.22C64.5067 15.56 63.75 15.73 62.93 15.73ZM64.95 8.03001C64.8567 7.55668 64.6933 7.14001 64.46 6.78001C64.2267 6.42001 63.94 6.14001 63.6 5.94001C63.2667 5.74001 62.9033 5.64001 62.51 5.64001C62.01 5.64001 61.57 5.79334 61.19 6.10001C60.8167 6.40001 60.5267 6.83001 60.32 7.39001C60.1133 7.95001 60.01 8.60001 60.01 9.34001C60.01 9.46668 60.0133 9.56334 60.02 9.63001L64.95 8.03001Z"/>
          </svg>
        </div>
        <button
          @click="toggleCollapse"
          class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded transition-colors duration-150"
          title="关闭侧边栏 (Ctrl+\)"
        >
          <svg class="w-[17px] h-[17px] text-[#9b9a97] dark:text-[#97958c]" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M16.5 4A1.5 1.5 0 0 1 18 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5v-9A1.5 1.5 0 0 1 3.5 4zM7 15h9.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7zM3.5 5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H6V5z"/></svg>
        </button>
      </div>

      <!-- 新建聊天按钮 -->
      <div class="p-2 shrink-0">
        <router-link
          to="/"
          class="nav-item-btn w-full"
          @click="handleNewChat"
        >
          <svg class="w-4 h-4 nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 .077 1.496l-.077.004h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3"/></svg>
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
          <svg class="w-4 h-4 nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 2a6.5 6.5 0 0 1 4.935 10.728l4.419 4.419.064.078a.5.5 0 0 1-.693.693l-.079-.064-4.419-4.42A6.5 6.5 0 1 1 8.5 2m0 1a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11"/></svg>
          搜索
        </button>
        <button
          class="nav-item-btn w-full"
          title="自定义"
          @click="$router.push('/settings')"
        >
          <svg class="w-4 h-4 nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M12.5 3A1.5 1.5 0 0 1 14 4.5V6h.5A3.5 3.5 0 0 1 18 9.5v6a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.492-1.347L2 15.5v-6A3.5 3.5 0 0 1 5.5 6H6V4.5A1.5 1.5 0 0 1 7.5 3zM3 15.5l.01.1a.5.5 0 0 0 .49.4h13a.5.5 0 0 0 .5-.5V12h-4v.5a.5.5 0 0 1-1 0V12H8v.5a.5.5 0 0 1-1 0V12H3zM5.5 7A2.5 2.5 0 0 0 3 9.5V11h4v-.5a.5.5 0 0 1 1 0v.5h4v-.5a.5.5 0 0 1 1 0v.5h4V9.5A2.5 2.5 0 0 0 14.5 7zm2-3a.5.5 0 0 0-.5.5V6h6V4.5a.5.5 0 0 0-.5-.5z"/></svg>
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
            <svg class="w-[17px] h-[17px] nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M8.99962 2C12.3133 2 14.9996 4.68629 14.9996 8C14.9996 11.3137 12.3133 14 8.99962 14H2.49962C2.30105 13.9998 2.12113 13.8821 2.04161 13.7002C1.96224 13.5181 1.99835 13.3058 2.1334 13.1602L3.93516 11.2178C3.34317 10.2878 2.99962 9.18343 2.99962 8C2.99962 4.68643 5.68609 2.00022 8.99962 2ZM8.99962 3C6.23838 3.00022 3.99961 5.23871 3.99961 8C3.99961 9.11212 4.36265 10.1386 4.97618 10.9688C5.11884 11.1621 5.1035 11.4293 4.94004 11.6055L3.64512 13H8.99962C11.761 13 13.9996 10.7614 13.9996 8C13.9996 5.23858 11.761 3 8.99962 3Z"/><path d="M16.5445 9.72754C16.4182 9.53266 16.1678 9.44648 15.943 9.53418C15.7183 9.62215 15.5932 9.85502 15.6324 10.084L15.7369 10.3955C15.9073 10.8986 16.0006 11.438 16.0006 12C16.0006 13.1123 15.6376 14.1386 15.024 14.9687C14.8811 15.1621 14.8956 15.4302 15.0592 15.6064L16.3531 17H11.0006C9.54519 17 8.23527 16.3782 7.32091 15.3848L7.07091 15.1103C6.88996 14.9645 6.62535 14.9606 6.43907 15.1143C6.25267 15.2682 6.20668 15.529 6.31603 15.7344L6.58458 16.0625C7.68048 17.253 9.25377 18 11.0006 18H17.5006C17.6991 17.9998 17.8791 17.8822 17.9586 17.7002C18.038 17.5181 18.0018 17.3058 17.8668 17.1602L16.0631 15.2178C16.6554 14.2876 17.0006 13.1837 17.0006 12C17.0006 11.3271 16.8891 10.6792 16.6842 10.0742L16.5445 9.72754Z"/></svg>
            对话
          </button>
        </router-link>
        <router-link to="/projects" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M15.8198 7C16.6885 7.00025 17.3624 7.73158 17.3178 8.57617L17.2993 8.74707L16.1332 15.7471C16.0126 16.4699 15.3865 16.9996 14.6538 17H5.34711C4.6142 16.9998 3.98833 16.47 3.86762 15.7471L2.7016 8.74707C2.54922 7.83277 3.25418 7 4.18109 7H15.8198ZM4.18109 8C3.87216 8 3.63722 8.27731 3.68793 8.58203L4.85394 15.582C4.89413 15.8229 5.10291 15.9998 5.34711 16H14.6538C14.8978 15.9996 15.1068 15.8228 15.1469 15.582L16.3129 8.58203L16.3188 8.46973C16.3036 8.21259 16.0899 8.00023 15.8198 8H4.18109Z"/><path d="M16.0004 5.5C16.0004 5.224 15.7764 5.00024 15.5004 5H4.50043C4.22428 5 4.00043 5.22386 4.00043 5.5C4.00043 5.77614 4.22428 6 4.50043 6H15.5004C15.7764 5.99976 16.0004 5.776 16.0004 5.5Z"/><path d="M14.5004 3.5C14.5004 3.224 14.2764 3.00024 14.0004 3H6.00043C5.72428 3 5.50043 3.22386 5.50043 3.5C5.50043 3.77614 5.72428 4 6.00043 4H14.0004C14.2764 3.99976 14.5004 3.776 14.5004 3.5Z"/></svg>
            项目
          </button>
        </router-link>
        <router-link to="/artifacts" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.35352 3.1464L9.35352 6.14642C9.43935 6.25103 9.5 6.36003 9.5 6.50091C9.4998 6.6332 9.44704 6.75988 9.35352 6.85346L6.35352 9.85347C6.14584 10.0609 5.85611 10.0243 5.64648 9.85347L2.64648 6.85346C2.55296 6.75988 2.5002 6.6332 2.5 6.50091C2.5 6.36841 2.55285 6.24017 2.64648 6.14642L5.64648 3.1464C5.8552 2.97421 6.14635 2.93936 6.35352 3.1464ZM6 8.79194L3.70703 6.49994L6 4.20696L8.29297 6.49994L6 8.79194Z"/><path d="M16.8984 3.7509C16.9875 3.90632 16.986 4.09826 16.8955 4.25286L15.5791 6.49994L16.8955 8.74702C16.986 8.90159 16.9874 9.09354 16.8984 9.24898C16.8093 9.40436 16.643 9.49996 16.4638 9.49996H11.5C11.3198 9.49996 11.1532 9.4028 11.0644 9.24605C10.976 9.08949 10.9789 8.89736 11.0713 8.74312L12.417 6.49994L11.0713 4.25676C10.9789 4.1025 10.976 3.91037 11.0644 3.75383C11.1532 3.59717 11.3199 3.49992 11.5 3.49992H16.4638C16.6429 3.51309 16.8055 3.58909 16.8984 3.7509Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 11C15.6568 11 16.9999 12.3432 17 14C17 15.6568 15.6569 17 14 17C12.3431 17 11 15.6568 11 14C11.0001 12.3432 12.3432 11 14 11ZM12 14C12.0001 12.8955 12.8955 12 14 12C15.1045 12 15.9999 12.8955 16 14C16 15.1045 15.1046 16 14 16C12.8954 16 12 15.1045 12 14Z"/></svg>
            制品
          </button>
        </router-link>
        <router-link to="/code" custom v-slot="{ navigate, isActive }">
          <button
            :class="['nav-item-btn w-full', { 'bg-black/[0.06] text-[#1a1a1a] dark:text-white': isActive }]"
            @click="navigate"
          >
            <svg class="w-[17px] h-[17px] nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M11.6318 4.01757C11.898 4.09032 12.055 4.36555 11.9824 4.63183L8.98242 15.6318C8.90966 15.8981 8.63449 16.0551 8.36816 15.9824C8.10193 15.9097 7.94495 15.6345 8.01758 15.3682L11.0176 4.36816C11.0903 4.10193 11.3655 3.94495 11.6318 4.01757ZM14.5 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6.707l-8.147 8.147a.5.5 0 0 1-.707-.707L13.293 6H7.5a.5.5 0 0 1 0-1z"/></svg>
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
                class="w-full text-left px-4 py-1.5 rounded-md text-[12px] text-[#c3c2b7] hover:text-[#e8e7e0] dark:text-[#c3c2b7] dark:hover:text-[#e8e7e0] hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors duration-150 truncate leading-normal"
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
          <svg class="w-[18px] h-[18px] icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 2a6.5 6.5 0 0 1 4.935 10.728l4.419 4.419.064.078a.5.5 0 0 1-.693.693l-.079-.064-4.419-4.42A6.5 6.5 0 1 1 8.5 2m0 1a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11"/></svg>
        </button>

        <button class="icon-btn" title="自定义" @click="$router.push('/settings')">
          <svg class="w-[18px] h-[18px] icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M12.5 3A1.5 1.5 0 0 1 14 4.5V6h.5A3.5 3.5 0 0 1 18 9.5v6a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.492-1.347L2 15.5v-6A3.5 3.5 0 0 1 5.5 6H6V4.5A1.5 1.5 0 0 1 7.5 3zM3 15.5l.01.1a.5.5 0 0 0 .49.4h13a.5.5 0 0 0 .5-.5V12h-4v.5a.5.5 0 0 1-1 0V12H8v.5a.5.5 0 0 1-1 0V12H3zM5.5 7A2.5 2.5 0 0 0 3 9.5V11h4v-.5a.5.5 0 0 1 1 0v.5h4v-.5a.5.5 0 0 1 1 0v.5h4V9.5A2.5 2.5 0 0 0 14.5 7zm2-3a.5.5 0 0 0-.5.5V6h6V4.5a.5.5 0 0 0-.5-.5z"/></svg>
        </button>

        <div class="w-6 border-t border-[#e5e5e4] dark:border-white/10 my-1"></div>

        <router-link to="/chats" custom v-slot="{ navigate }">
          <button class="icon-btn" title="对话" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M8.99962 2C12.3133 2 14.9996 4.68629 14.9996 8C14.9996 11.3137 12.3133 14 8.99962 14H2.49962C2.30105 13.9998 2.12113 13.8821 2.04161 13.7002C1.96224 13.5181 1.99835 13.3058 2.1334 13.1602L3.93516 11.2178C3.34317 10.2878 2.99962 9.18343 2.99962 8C2.99962 4.68643 5.68609 2.00022 8.99962 2ZM8.99962 3C6.23838 3.00022 3.99961 5.23871 3.99961 8C3.99961 9.11212 4.36265 10.1386 4.97618 10.9688C5.11884 11.1621 5.1035 11.4293 4.94004 11.6055L3.64512 13H8.99962C11.761 13 13.9996 10.7614 13.9996 8C13.9996 5.23858 11.761 3 8.99962 3Z"/><path d="M16.5445 9.72754C16.4182 9.53266 16.1678 9.44648 15.943 9.53418C15.7183 9.62215 15.5932 9.85502 15.6324 10.084L15.7369 10.3955C15.9073 10.8986 16.0006 11.438 16.0006 12C16.0006 13.1123 15.6376 14.1386 15.024 14.9687C14.8811 15.1621 14.8956 15.4302 15.0592 15.6064L16.3531 17H11.0006C9.54519 17 8.23527 16.3782 7.32091 15.3848L7.07091 15.1103C6.88996 14.9645 6.62535 14.9606 6.43907 15.1143C6.25267 15.2682 6.20668 15.529 6.31603 15.7344L6.58458 16.0625C7.68048 17.253 9.25377 18 11.0006 18H17.5006C17.6991 17.9998 17.8791 17.8822 17.9586 17.7002C18.038 17.5181 18.0018 17.3058 17.8668 17.1602L16.0631 15.2178C16.6554 14.2876 17.0006 13.1837 17.0006 12C17.0006 11.3271 16.8891 10.6792 16.6842 10.0742L16.5445 9.72754Z"/></svg>
          </button>
        </router-link>

        <router-link to="/projects" custom v-slot="{ navigate }">
          <button class="icon-btn" title="项目" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M15.8198 7C16.6885 7.00025 17.3624 7.73158 17.3178 8.57617L17.2993 8.74707L16.1332 15.7471C16.0126 16.4699 15.3865 16.9996 14.6538 17H5.34711C4.6142 16.9998 3.98833 16.47 3.86762 15.7471L2.7016 8.74707C2.54922 7.83277 3.25418 7 4.18109 7H15.8198ZM4.18109 8C3.87216 8 3.63722 8.27731 3.68793 8.58203L4.85394 15.582C4.89413 15.8229 5.10291 15.9998 5.34711 16H14.6538C14.8978 15.9996 15.1068 15.8228 15.1469 15.582L16.3129 8.58203L16.3188 8.46973C16.3036 8.21259 16.0899 8.00023 15.8198 8H4.18109Z"/><path d="M16.0004 5.5C16.0004 5.224 15.7764 5.00024 15.5004 5H4.50043C4.22428 5 4.00043 5.22386 4.00043 5.5C4.00043 5.77614 4.22428 6 4.50043 6H15.5004C15.7764 5.99976 16.0004 5.776 16.0004 5.5Z"/><path d="M14.5004 3.5C14.5004 3.224 14.2764 3.00024 14.0004 3H6.00043C5.72428 3 5.50043 3.22386 5.50043 3.5C5.50043 3.77614 5.72428 4 6.00043 4H14.0004C14.2764 3.99976 14.5004 3.776 14.5004 3.5Z"/></svg>
          </button>
        </router-link>

        <router-link to="/artifacts" custom v-slot="{ navigate }">
          <button class="icon-btn" title="制品" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.35352 3.1464L9.35352 6.14642C9.43935 6.25103 9.5 6.36003 9.5 6.50091C9.4998 6.6332 9.44704 6.75988 9.35352 6.85346L6.35352 9.85347C6.14584 10.0609 5.85611 10.0243 5.64648 9.85347L2.64648 6.85346C2.55296 6.75988 2.5002 6.6332 2.5 6.50091C2.5 6.36841 2.55285 6.24017 2.64648 6.14642L5.64648 3.1464C5.8552 2.97421 6.14635 2.93936 6.35352 3.1464ZM6 8.79194L3.70703 6.49994L6 4.20696L8.29297 6.49994L6 8.79194Z"/><path d="M16.8984 3.7509C16.9875 3.90632 16.986 4.09826 16.8955 4.25286L15.5791 6.49994L16.8955 8.74702C16.986 8.90159 16.9874 9.09354 16.8984 9.24898C16.8093 9.40436 16.643 9.49996 16.4638 9.49996H11.5C11.3198 9.49996 11.1532 9.4028 11.0644 9.24605C10.976 9.08949 10.9789 8.89736 11.0713 8.74312L12.417 6.49994L11.0713 4.25676C10.9789 4.1025 10.976 3.91037 11.0644 3.75383C11.1532 3.59717 11.3199 3.49992 11.5 3.49992H16.4638C16.6429 3.51309 16.8055 3.58909 16.8984 3.7509Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 11C15.6568 11 16.9999 12.3432 17 14C17 15.6568 15.6569 17 14 17C12.3431 17 11 15.6568 11 14C11.0001 12.3432 12.3432 11 14 11ZM12 14C12.0001 12.8955 12.8955 12 14 12C15.1045 12 15.9999 12.8955 16 14C16 15.1045 15.1046 16 14 16C12.8954 16 12 15.1045 12 14Z"/></svg>
          </button>
        </router-link>

        <router-link to="/code" custom v-slot="{ navigate }">
          <button class="icon-btn" title="代码" @click="navigate">
            <svg class="w-[18px] h-[18px] icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M11.6318 4.01757C11.898 4.09032 12.055 4.36555 11.9824 4.63183L8.98242 15.6318C8.90966 15.8981 8.63449 16.0551 8.36816 15.9824C8.10193 15.9097 7.94495 15.6345 8.01758 15.3682L11.0176 4.36816C11.0903 4.10193 11.3655 3.94495 11.6318 4.01757ZM14.5 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6.707l-8.147 8.147a.5.5 0 0 1-.707-.707L13.293 6H7.5a.5.5 0 0 1 0-1z"/></svg>
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

// 全局快捷键 + 侧边栏挂载时确保加载对话列表
onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  // 每次侧边栏挂载时，已登录则刷新对话列表（解决路由切换/刷新后列表消失的问题）
  if (appStore.isAuthenticated) {
    appStore.fetchDialogList()
  }
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

// 监听登录状态变化：用户登录后自动拉取对话列表
watch(() => appStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    appStore.fetchDialogList()
  }
})
</script>

<style scoped>
.nav-item-btn {
  @apply py-[6px] px-[16px] text-left text-[12px] text-[#c3c2b7] dark:text-[#c3c2b7] hover:text-[#e8e7e0] dark:hover:text-[#e8e7e0] hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors duration-150 flex items-center gap-2;
}
.nav-icon { color: #787774; }
.dark .nav-icon { color: #9b9a97; }
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
