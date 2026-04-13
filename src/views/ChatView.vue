<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1a1a1a] text-text-100">
    <!-- 左侧导航栏 -->
    <AppNavigation @sidebar-change="onSidebarChange" />

    <!-- 主聊天区域 -->
    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]', showArtifactPanel ? 'mr-[520px]' : '']">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-24">
        <!-- 对话标题栏 + 返回按钮 -->
        <div v-if="dialogDetail" class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <button
              v-if="!dialogId || messages.length === 0"
              class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors text-[13px] text-[#787774] flex items-center gap-1"
              @click="$router.push('/chats')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              {{ dialogDetail.title }}
            </button>
            <h1 v-else class="text-xl font-semibold text-[#1a1a1a] dark:text-white truncate flex items-center gap-2">
              {{ dialogDetail.title }}
              <button class="p-1 hover:bg-black/[0.04] rounded opacity-60 hover:opacity-100 transition-opacity" title="编辑标题">
                <svg class="w-3.5 h-3.5 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
            </h1>
          </div>

          <div class="flex items-center gap-1">
            <!-- 模型切换（在标题栏右侧） -->
            <div
              v-click-outside="() => showModelMenu = false"
              class="flex items-center gap-1 px-2 py-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded cursor-pointer relative"
              @click="showModelMenu = !showModelMenu"
            >
              <span class="text-[12px] text-[#787774]">{{ appStore.currentModel?.name || 'Sonnet 4d' }}</span>
              <svg class="w-3 h-3 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              <Transition name="dropdown">
                <div v-if="showModelMenu" class="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-lg shadow-claude-md py-1 z-50">
                  <button v-for="model in appStore.models" :key="model.id" class="w-full px-3 py-1.5 text-left text-[12px] flex justify-between hover:bg-black/[0.04] dark:hover:bg-white/5" :class="model.id === appStore.currentModel?.id ? 'text-[#d97757]' : ''" @click.stop="handleSwitchModel(model)">{{ model.name }}</button>
                </div>
              </Transition>

              <!-- 制品卡片（可点击打开右侧面板） -->
              <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                <div class="artifact-card">
                  <div class="artifact-card-header">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                      <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                    </div>
                    <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <div class="artifact-card-body">
                    {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                  </div>
                  <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                    <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group" title="分享" @click="handleShare">
              <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            </button>
            <button class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group" title="删除对话" @click="handleDeleteDialog">
              <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <!-- 消息列表区域 -->
        <div ref="msgContainerRef" class="space-y-6 mb-32">
          <!-- 空状态：无对话时提示 -->
          <div v-if="!dialogId || (!messages.length && !isSending)" class="text-center py-20">
            <p class="text-[15px] text-[#9b9a97]">开始新对话</p>
          </div>

          <!-- 消息列表 -->
          <template v-for="(msg, index) in messages" :key="msg.id">
            <!-- 用户消息 -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="max-w-[80%] bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-2xl rounded-tr-md p-4 shadow-sm">
                <p class="text-[15px] text-[#1a1a1a] dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                <p class="text-[11px] text-[#9b9a97] mt-2 text-right">{{ formatTime(msg.timestamp) }}</p>
              </div>
            </div>

            <!-- AI 消息（无边框纯文字） -->
            <div v-else>
              <div class="max-w-[80%] text-[15px] text-[#1a1a1a] dark:text-gray-200 leading-relaxed prose-sm dark:prose-invert max-w-none" v-html="renderContent(msg.content)"></div>

                <!-- 选项卡片面板 -->
                <div v-if="getChoicePanel(msg.content) && !closedPanels[msg.id]" class="mt-4 max-w-[80%]">
                  <div class="choice-panel">
                    <div class="choice-panel-header">
                      <span class="choice-panel-title">{{ getChoicePanel(msg.content)?.question }}</span>
                      <button class="choice-panel-close" @click="closedPanels[msg.id] = true" title="关闭">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
                    <div class="choice-panel-list">
                      <button v-for="(choice, ci) in getChoicePanel(msg.content)!.choices" :key="ci"
                        :class="['choice-panel-item', selectedChoices[msg.id] === ci ? 'choice-panel-item-active' : '']"
                        @click="handleSelectChoice(msg.id, ci, choice)">
                        <span class="choice-panel-num">{{ ci + 1 }}</span><span>{{ choice }}</span>
                      </button>
                    </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
                    <div class="choice-panel-footer">
                      <button class="choice-skip-btn" @click="handleSkipChoice(msg.id)">Skip</button>
                    </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
                  </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
                </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>

                <!-- AI消息底部操作栏 -->
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-[#f0ede7] dark:border-white/5 max-w-[80%]">
                  <div class="flex items-center gap-1">
                    <p class="text-[11px] text-[#9b9a97] mr-2">{{ formatTime(msg.timestamp) }}</p>
                    <button class="action-btn" title="复制" @click="handleCopy(msg.content)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8z"/></svg>
                    </button>
                    <button class="action-btn" title="好的回复">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                    </button>
                    <button class="action-btn" title="不好的回复">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-5 10h-2m0 0a2 2 0 01-2-2v-6m2 2v4"/></svg>
                    </button>
                    <button class="action-btn" title="转发">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </button>
                  </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
                  <button v-if="index === messages.length - 1 && msg.role === 'ai'" class="action-btn" title="重新生成" :disabled="isSending" @click="handleRegenerate(msg.id)">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  </button>
                </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>

                <!-- AI Logo：仅最后一条AI消息显示，紧贴内容下方 -->
                <div v-if="isLastAiMessage(msg)" class="mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-7 h-7 fill-current text-[#d97757]"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/></svg>
                </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
            </div>
          </template>

        </div>
        <div class="fixed bottom-6 left-0 right-0 z-40" :style="{ marginLeft: isCollapsed ? '48px' : '260px', transition: 'margin-left 200ms ease-in-out' }">
          <div class="max-w-3xl mx-auto px-6">
            <!-- "Want to be notified when Claude responds?" 提示条 -->
            <div v-if="showNotifyBar" class="mb-3 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg shadow-sm">
              <span class="text-[13px] text-[#1a1a1a] dark:text-white">当 Claude 回复完成时需要通知吗？</span>
              <button class="px-3 py-1 bg-[#1a1a1a] text-white rounded text-[12px] font-medium hover:bg-[#333]" @click="showNotifyBar = false">通知我</button>
              <button class="p-1 text-[#9b9a97] hover:text-[#5c5b58]" @click="showNotifyBar = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div
              class="bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-claude-md hover:border-[#cfcfce] dark:hover:border-white/20 transition-colors duration-200 relative"
              :class="{ 'border-[#d97757] ring-2 ring-[#d97757]/20': isDragging }"
              @dragenter.prevent="isDragging = true"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="(e: DragEvent) => { if (!(e.currentTarget as Element)?.contains(e.relatedTarget as Node)) isDragging = false }"
              @drop.prevent="handleDrop"
            >
              <!-- 拖拽提示遮罩 -->
              <div v-if="isDragging" class="absolute inset-0 rounded-xl bg-[#d97757]/5 flex items-center justify-center z-10 pointer-events-none">
                <div class="text-center">
                  <svg class="w-10 h-10 mx-auto text-[#d97757] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p class="text-[14px] font-medium text-[#d97757]">释放以上传附件</p>
                </div>

                <!-- 制品卡片（可点击打开右侧面板） -->
                <div v-if="getArtifact(msg.content)" class="mt-4 max-w-[80%] cursor-pointer group" @click="openArtifactPanel(getArtifact(msg.content)!)">
                  <div class="artifact-card">
                    <div class="artifact-card-header">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                        <span class="artifact-card-title">{{ getArtifact(msg.content)?.title }}</span>
                      </div>
                      <svg class="w-4 h-4 text-[#9b9a97] group-hover:text-[#787774] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="artifact-card-body">
                      {{ getArtifact(msg.content)?.description || '点击查看代码和预览' }}
                    </div>
                    <div v-if="getArtifact(msg.content)?.type" class="artifact-card-type">
                      <span>{{ getArtifactTypeLabel(getArtifact(msg.content)!.type) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <textarea
                ref="inputRef"
                v-model="messageInput"
                rows="1"
                class="w-full bg-transparent border-0 rounded-xl pt-4 pb-14 px-4 text-[15px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] focus:outline-none resize-none min-h-[56px] max-h-[200px] leading-relaxed"
                placeholder="给 Claude 发消息..."
                @input="autoResize"
                @keydown.enter.exact.prevent="handleSend"
              ></textarea>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                <label class="p-1.5 mr-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group cursor-pointer" title="附件">
                  <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" class="hidden" accept="image/*,.pdf,.txt,.md,.doc,.docx" multiple @change="handleFileUpload" />
                </label>

                <button
                  :disabled="isSending || !messageInput.trim()"
                  class="px-4 py-1.5 bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[13px] font-medium ml-2"
                  @click="handleSend"
                >
                  {{ isSending ? '...' : '发送' }}
                </button>
              </div>
            </div>

            <p class="text-center text-[11px] text-[#cfcfce] mt-2">
              Claude 可能会出错。请核实重要信息。
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- 右侧制品预览面板 -->
    <Transition name="panel">
      <div v-if="showArtifactPanel" class="fixed top-0 right-0 w-[520px] h-screen bg-white dark:bg-[#1a1a1a] border-l border-[#e0e0df] dark:border-white/10 z-50 flex flex-col shadow-xl">
        <!-- 面板头部 -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#f0ede7] dark:border-white/5 shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-[#1a1a1a] dark:text-white">{{ currentArtifact?.title || '制品预览' }}</span>
            <button
              class="px-2 py-0.5 text-[11px] rounded-md transition-colors"
              :class="artifactViewMode === 'preview'
                ? 'bg-[#d97757]/10 text-[#d97757]'
                : 'text-[#787774] hover:bg-black/[0.04] dark:hover:bg-white/5'"
              @click="artifactViewMode = 'preview'">预览</button>
            <button
              class="px-2 py-0.5 text-[11px] rounded-md transition-colors"
              :class="artifactViewMode === 'code'
                ? 'bg-[#d97757]/10 text-[#d97757]'
                : 'text-[#787774] hover:bg-black/[0.04] dark:hover:bg-white/5'"
              @click="artifactViewMode = 'code'">代码</button>
            <span v-if="currentArtifact?.type" class="text-[11px] text-[#9b9a97]">{{ getArtifactTypeLabel(currentArtifact.type) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="action-btn" title="复制代码" @click="handleCopyArtifactCode()">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 01-2 2v8z"/></svg>
            </button>
            <button class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors text-[#9b9a97] hover:text-[#5c5b58]" title="关闭" @click="closeArtifactPanel()">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- 面板内容区：预览模式 -->
        <div v-if="artifactViewMode === 'preview'" ref="artifactPreviewRef" class="flex-1 overflow-auto bg-white dark:bg-[#0f0f0f]">
          <iframe
            v-if="currentArtifact && isPreviewable(currentArtifact)"
            :srcdoc="currentArtifact.content"
            class="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
          <div v-else-if="currentArtifact" class="p-6 text-[14px] text-[#5c5b58] dark:text-gray-400">
            <p>此类型的制品暂不支持预览，请切换到「代码」视图查看。</p>
            <pre v-if="!isPreviewable(currentArtifact)" class="mt-4 p-4 bg-[#f5f4f0] dark:bg-[#1a1a1a] rounded-lg overflow-x-auto text-[13px] font-mono whitespace-pre-wrap">{{ currentArtifact.content }}</pre>
          </div>
        </div>

        <!-- 面板内容区：代码模式 -->
        <div v-if="artifactViewMode === 'code'" class="flex-1 overflow-auto bg-[#1a1a1a]">
          <div class="relative min-h-full p-4">
            <div class="absolute top-3 left-4 flex items-center gap-2 z-10">
              <span class="text-[11px] text-[#555] font-mono">{{ getLanguageTag(currentArtifact?.type) }}</span>
            </div>
            <pre class="font-mono text-[13px] leading-relaxed text-gray-200 whitespace-pre-wrap"><code>{{ currentArtifact?.content }}</code></pre>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { dialogApi } from '@/api/dialog'
import { fileApi } from '@/api/file'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const messageInput = ref('')
const isCollapsed = ref(false)
const isSending = ref(false)
const streamingContent = ref('')
const isDragging = ref(false)
let abortController: AbortController | null = null
const inputRef = ref<HTMLTextAreaElement | null>(null)
const msgContainerRef = ref<HTMLElement | null>(null)
const showModelMenu = ref(false)
const showNotifyBar = ref(false)
const selectedChoices = reactive<Record<string, number>>({})
const closedPanels = reactive<Record<string, boolean>>({})

// 制品面板状态
const showArtifactPanel = ref(false)
const currentArtifact = ref<{ title: string; content: string; type: string; description: string } | null>(null)
const artifactViewMode = ref<'code' | 'preview'>('preview')
const artifactPreviewRef = ref<HTMLIFrameElement | null>(null)

const dialogId = computed(() => route.params.id as string | undefined)
const messages = computed(() => appStore.messages)
const dialogDetail = computed(() => appStore.currentDialogDetail)

// 制品模式：从 query 中读取 artifact_type
const artifactType = computed(() => route.query.artifact_type as string | undefined)

const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}

// 加载对话详情
const loadDialog = async (id: string) => {
  if (!id) return
  await appStore.openDialog(id)
}

// 制品模式：保存 artifact_type 到本地变量（避免 router.replace 后丢失）
const savedArtifactType = ref<string | undefined>(undefined)

// 如果URL有query参数 msg 或 artifact_type，自动发送
watch(dialogId, async (newId) => {
  if (newId) {
    await loadDialog(newId)
    const msg = route.query.msg as string
    if (msg) {
      messageInput.value = msg
      setTimeout(() => handleSend(), 300)
      router.replace({ path: `/chat/${newId}` })
    } else if (artifactType.value) {
      // 制品模式：先保存到本地变量，再清除 query
      savedArtifactType.value = artifactType.value
      const typeLabel: Record<string, string> = {
        web: '应用与网站',
        doc: '文档和模板',
        game: '游戏',
        tool: '效率工具',
        creative: '创意项目',
        survey: '问卷或调查',
        code: '从零开始'
      }
      messageInput.value = `我想创建一个「${typeLabel[savedArtifactType.value] || savedArtifactType.value}」类型的制品`
      // 清除 query 参数，避免刷新时重复发送（artifact_type 已保存到 savedArtifactType）
      router.replace({ path: `/chat/${newId}` })
      setTimeout(() => handleSend(), 300)
    }
  }
}, { immediate: true })

/** 从 AI 消息内容中提取选项面板数据 { question, choices[] } */
const getChoicePanel = (content: string): { question: string; choices: string[] } | null => {
  // 匹配 [QUESTION]...[/QUESTION] 后面紧跟的 [CHOICE]...[/CHOICE] 块
  const qMatch = content.match(/\[QUESTION\](.*?)\[\/QUESTION\]/s)
  if (!qMatch) return null
  const question = qMatch[1].trim()
  const choiceMatches = content.match(/\[CHOICE\](.*?)\[\/CHOICE\]/gs)
  const choices = choiceMatches ? choiceMatches.map(m => m.replace(/\[CHOICE\]/g, '').replace(/\[\/CHOICE\]/g, '').trim()) : []
  if (choices.length === 0) return null
  return { question, choices }
}

/** 渲染消息内容时，移除 [QUESTION]、[CHOICE] 和 [ARTIFACT] 标签块 */
const renderContent = (content: string): string => {
  if (!content) return ''
  let html = content
    .replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '')
    .replace(/\[CHOICE\][\s\S]*?\[\/CHOICE\]/g, '')
    .replace(/\[ARTIFACT\][\s\S]*?\[\/ARTIFACT\]/g, '')
    .trim()

  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 代码块 (```language\n...\n```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-[#f5f4f0] dark:bg-[#1a1a1a] rounded-lg p-3 my-3 overflow-x-auto font-mono text-[13px] border border-[#eee] dark:border-white/5"><code>${code}</code></pre>`
  })

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#f5f4f0] dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[13px]">$1</code>')

  // 粗体/斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 链接
  html = html.replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#d97757] underline hover:no-underline">$1</a>')

  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2 border border-[#e5e5e4]" />')

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h4 class="font-semibold text-[15px] mt-3 mb-1">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 class="font-semibold text-base mt-3 mb-1">$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2 class="font-semibold text-lg mt-4 mb-2">$1</h2>')

  // 无序列表
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="list-disc ml-5 my-0.5">$1</li>')

  // 分割线
  html = html.replace(/^---$/gm, '<hr class="border-[#e5e5e4] my-4" />')

  // 引用块
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-[#d97757]/30 pl-3 my-2 text-[#5c5b58] italic">$1</blockquote>')

  return html
}

/** 用户点击选项卡片 */
const handleSelectChoice = async (msgId: string, choiceIndex: number, choiceText: string) => {
  selectedChoices[msgId] = choiceIndex
  const id = dialogId.value
  if (!id || isSending.value) return
  messageInput.value = choiceText
  await handleSend()
}

/** 用户点击跳过按钮 */
const handleSkipChoice = async (msgId: string) => {
  selectedChoices[msgId] = -1 // 标记为已跳过
  const id = dialogId.value
  if (!id || isSending.value) return
  messageInput.value = '跳过此问题'
  await handleSend()
}

/** 判断是否为最后一条 AI 消息（用于显示 logo） */
const isLastAiMessage = (msg: any) => {
  if (msg.role !== 'ai') return false
  const aiMessages = messages.value.filter(m => m.role === 'ai')
  return aiMessages.length > 0 && aiMessages[aiMessages.length - 1].id === msg.id
}

// ============ 制品相关函数 ============

interface ArtifactData {
  title: string
  content: string
  type: string
  description: string
}

/** 从消息内容中提取制品数据 [ARTIFACT]...[/ARTIFACT] */
const getArtifact = (content: string): ArtifactData | null => {
  const match = content.match(/\[ARTIFACT\]([\s\S]*?)\[\/ARTIFACT\]/)
  if (!match) return null
  try {
    // 尝试解析为 JSON 格式：{"title":"...", "content":"...", "type":"web", "description":"..."}
    let parsed: ArtifactData
    try {
      parsed = JSON.parse(match[1].trim())
    } catch {
      // 非 JSON 时，content 就是整个文本，title 取第一行
      const lines = match[1].split('\n').filter(Boolean)
      parsed = {
        title: lines[0] || '未命名制品',
        content: match[1].trim(),
        type: detectArtifactType(lines[0]),
        description: lines.length > 1 ? lines.slice(0, 3).join(' ') : '',
      }
    }
    if (!parsed.title && parsed.content) {
      const firstLine = parsed.content.split('\n')[0]
      parsed.title = firstLine || '未命名制品'
      parsed.type = detectArtifactType(firstLine)
    }
    return parsed
  } catch { return null }
}

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  web: '应用与网站',
  doc: '文档和模板',
  game: '游戏',
  tool: '效率工具',
  creative: '创意项目',
  survey: '问卷或调查',
  code: '从零开始',
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  vue: 'Vue',
  react: 'React',
  md: 'Markdown',
  json: 'JSON',
  python: 'Python',
}

const getArtifactTypeLabel = (type: string): string =>
  ARTIFACT_TYPE_LABELS[type.toLowerCase()] || type.toUpperCase()

const getLanguageTag = (type?: string): string => {
  const map: Record<string, string> = {
    web: 'html', html: 'html', vue: 'vue', react: 'jsx',
    js: 'javascript', javascript: 'javascript', ts: 'typescript', typescript: 'typescript',
    css: 'css', scss: 'scss', md: 'markdown', json: 'json',
    py: 'python', python: 'python',
  }
  return map[type?.toLowerCase() || ''] || 'text'
}

/** 从标题/内容自动检测制品类型 */
const detectArtifactType = (hint: string): string => {
  const h = hint.toLowerCase()
  if (/html|网页|网站|页面|landing|home|app/i.test(h)) return 'web'
  if (/css|样式|style/i.test(h)) return 'css'
  if (/vue|\.vue/i.test(h)) return 'vue'
  if (/react|jsx/i.test(h)) return 'react'
  if (/js|javascript|script|脚本/i.test(h)) return 'javascript'
  if (/ts|typescript/i.test(h)) return 'typescript'
  if (/markdown|md|文档/i.test(h)) return 'md'
  if (/json/i.test(h)) return 'json'
  if (/python|py/i.test(h)) return 'python'
  return 'code'
}

/** 判断制品是否支持 iframe 预览 */
const isPreviewable = (artifact: ArtifactData | null): boolean => {
  if (!artifact) return false
  const type = artifact.type.toLowerCase()
  const previewableTypes = ['web', 'html', 'css', 'vue', 'react']
  // 包含 html 标签的内容也可以预览
  const hasHtmlTag = /<(html|head|body|div|p|h[1-6]|section|nav|footer|header)\b/i.test(artifact.content)
  return previewableTypes.includes(type) || hasHtmlTag
}

/** 打开右侧制品面板 */
const openArtifactPanel = (artifact: ArtifactData) => {
  currentArtifact.value = artifact
  showArtifactPanel.value = true
  artifactViewMode.value = isPreviewable(artifact) ? 'preview' : 'code'
  scrollToBottom()
}

/** 关闭制品面板 */
const closeArtifactPanel = () => {
  showArtifactPanel.value = false
  currentArtifact.value = null
}

/** 复制制品代码 */
const handleCopyArtifactCode = async () => {
  if (!currentArtifact.value?.content) return
  try {
    await navigator.clipboard.writeText(currentArtifact.value.content)
    // TODO: toast "已复制"
  } catch {}
}

/** 停止生成 */
const handleStopGeneration = () => {
  abortController?.abort()
  abortController = null
}

/** 自动滚动到底部（流式输出时持续滚动） */
const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

/** 发送消息（流式） */
const handleSend = async () => {
  const content = messageInput.value.trim()
  const id = dialogId.value

  if (!content || !id || isSending.value) return

  console.log(`[FRONTEND] ====== handleSend START ======`)
  console.log(`[FRONTEND] dialogId: ${id}`)
  console.log(`[FRONTEND] content: ${content.substring(0, 80)}`)

  isSending.value = true
  streamingContent.value = ''
  abortController = new AbortController()
  savedArtifactType.value &&= undefined // 用完即清除

  // 立即清空输入框
  messageInput.value = ''
  autoResizeByRef()

  // 推一条用户消息到列表
  appStore.messages.push({
    id: `user_${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
    status: 'sent', parent_id: null, version: 1,
  })

  // 推一条临时 AI 消息到消息列表（流式内容直接写在这里）
  const tempAiMsgId = `ai_stream_${Date.now()}`
  appStore.messages.push({
    id: tempAiMsgId,
    role: 'ai',
    content: '',
    timestamp: new Date().toISOString(),
    status: 'sent', parent_id: null, version: 1,
  })

  try {
    const effectiveArtifactType = savedArtifactType.value || (route.query.artifact_type as string) || undefined
    console.log(`[FRONTEND] calling dialogApi.sendMessageStream(${id}, ...)`)
    const stream = dialogApi.sendMessageStream(id, content, undefined, effectiveArtifactType)
    console.log(`[FRONTEND] stream object created, type: ${typeof stream}`)

    let eventCount = 0
    const startTime = performance.now()
    // 找到临时消息的引用，用于流式更新
    let tempMsg = appStore.messages.find(m => m.id === tempAiMsgId)
    for await (const event of stream) {
      eventCount++
      const elapsedMs = Math.round(performance.now() - startTime)
      console.log(`[FRONTEND] event #${eventCount} at +${elapsedMs}ms:`, JSON.stringify(event)?.substring(0, 200))

      if (event.type === 'chunk') {
        // 直接更新消息列表中的内容，触发 Vue 响应式渲染
        if (tempMsg) tempMsg.content += event.text
        streamingContent.value = tempMsg?.content ?? ''
        // 每个chunk都滚动到底部
        scrollToBottom()
        if (eventCount % 5 === 1) {
          console.log(`[FRONTEND] streamingContent length now: ${tempMsg?.content?.length} (at +${Math.round(performance.now() - startTime)}ms)`)
        }
      } else if (event.type === 'done') {
        console.log(`[FRONTEND] received DONE event, total events: ${eventCount}, content len: ${tempMsg?.content?.length}`)
        // 流式完成，刷新对话列表（不调用 openDialog 避免清空消息）
        await appStore.fetchDialogList()
        break
      } else if (event.type === 'error') {
        console.error(`[FRONTEND] received ERROR event:`, event.message)
        if (tempMsg) tempMsg.content = event.message || '抱歉，处理请求时出错。'
        break
      }
    }

    console.log(`[FRONTEND] for-await loop ended. total events received: ${eventCount}`)

    showNotifyBar.value = true
    await appStore.fetchDialogList()
  } catch (e: any) {
    console.error(`[FRONTEND] CATCH error:`, e.name, e.message)
    if (e.name !== 'AbortError') {
      console.error('Send stream failed:', e)
      // openDialog 已在 done 时调用；如果异常中断，临时消息保留作为部分结果
      // 不再额外 push，避免重复
    }
  } finally {
    isSending.value = false
    streamingContent.value = ''
    abortController = null
    console.log(`[FRONTEND] ====== handleSend END ======`)
  }
}

/** 重新生成 */
const handleRegenerate = async (messageId: string) => {
  const id = dialogId.value
  if (!id) return
  isSending.value = true
  try {
    // 先删除最后一条AI消息
    const idx = messages.value.findIndex(m => m.id === messageId)
    if (idx !== -1) messages.value.splice(idx, 1)

    // 重新发送上一条用户消息
    const lastUserMsg = [...messages.value].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      const res = await dialogApi.sendMessage(id, lastUserMsg.content)
      if (res.success && res.data) {
        await appStore.openDialog(id)
      }
    } else {
      await appStore.regenerateMessage(id, messageId)
    }
  } catch (e) {
    console.error('Regenerate failed:', e)
  } finally {
    isSending.value = false
  }
}

/** 删除对话 */
const handleDeleteDialog = async () => {
  const id = dialogId.value
  if (!id || !confirm('确定要删除这个对话吗？')) return
  await appStore.deleteDialog(id)
  router.push('/')
}

/** 复制消息 */
const handleCopy = async (content: string) => {
  try {
    // 复制时去除 [QUESTION] 和 [CHOICE] 标签
    const cleanContent = content
      .replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '')
      .replace(/\[CHOICE\][\s\S]*?\[\/CHOICE\]/g, '')
      .trim()
    await navigator.clipboard.writeText(cleanContent)
    // TODO: show toast "Copied!"
  } catch {}
}

/** 分享 */
const handleShare = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    // toast copied
  })
}

/** 切换模型 */
const handleSwitchModel = async (model: any) => {
  showModelMenu.value = false
  await appStore.switchModel(model.id)
}

/** 文件上传 */
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  try {
    let fileNames = ''
    for (let i = 0; i < input.files.length; i++) {
      const res = await fileApi.upload(input.files[i])
      if (res.success && res.data) {
        fileNames += `[附件: ${(res.data as any).filename}] `
      }
    }
    messageInput.value += '\n' + fileNames.trim()
  } catch {
    for (let i = 0; i < input.files.length; i++) {
      messageInput.value += `\n[附件: ${input.files[i].name}]`
    }
  }
  input.value = ''
}

/** 拖拽上传 */
const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files?.length) return

  // 过滤允许的文件类型
  const allowedTypes = ['image/', 'application/pdf', 'text/', '.md', '.doc', '.docx']
  let fileNames = ''
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!allowedTypes.some(t => file.type.startsWith(t) || file.name.endsWith(t))) continue
    try {
      const res = await fileApi.upload(file)
      if (res.success && res.data) {
        fileNames += `[附件: ${(res.data as any).filename}] `
      }
    } catch {
      fileNames += `[附件: ${file.name}] `
    }
  }

  if (fileNames.trim()) {
    messageInput.value += '\n' + fileNames.trim()
    autoResizeByRef()
  }
}

/** 格式化时间 */
const formatTime = (timestamp: string) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`
  return date.toLocaleDateString()
}

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const autoResizeByRef = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 200) + 'px'
  }
}

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 300)
})
</script>

<style scoped>
.action-btn {
  @apply p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded transition-colors;
}
.action-btn svg {
  @apply w-3.5 h-3.5 text-[#9b9a97] hover:text-[#787774];
}
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}
/* dropdown animation reused from nav */
.dropdown-enter-active { transition: all 0.15s ease-out; }
.dropdown-leave-active { transition: all 0.1s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(4px); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px); }

/* 选项面板样式 - 模仿截图中的独立卡片面板 */
.choice-panel {
  @apply bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm overflow-hidden;
}
.choice-panel-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-[#f0ede7] dark:border-white/5;
}
.choice-panel-title {
  @apply text-[14px] font-medium text-[#1a1a1a] dark:text-white;
}
.choice-panel-close {
  @apply p-0.5 text-[#9b9a97] hover:text-[#5c5b58] transition-colors;
}
.choice-panel-list {
  @apply p-2;
}
.choice-panel-item {
  @apply w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] text-[#5c5b58] dark:text-gray-300
    rounded-lg cursor-pointer transition-all duration-150
    hover:bg-black/[0.03] dark:hover:bg-white/5;
}
.choice-panel-item-active {
  @apply bg-[#fef8f5] text-[#d97757] font-medium;
}
.choice-panel-num {
  @apply w-5 h-5 flex items-center justify-center text-[11px] font-semibold text-[#9b9a97]
    bg-[#f5f4f0] dark:bg-white/5 rounded-full shrink-0;
}
.choice-panel-item-active .choice-panel-num {
  @apply bg-[#d97757]/10 text-[#d97757];
}
.choice-panel-footer {
  @apply flex items-center justify-end px-4 py-2.5 border-t border-[#f0ede7] dark:border-white/5;
}
.choice-skip-btn {
  @apply px-3 py-1 text-[12px] font-medium text-[#787774] dark:text-gray-400 border border-[#e5e5e4] dark:border-white/10
    rounded-md transition-colors duration-150
    hover:bg-black/[0.04] dark:hover:bg-white/5 hover:text-[#1a1a1a] dark:hover:text-white;
}

/* 制品卡片样式 */
.artifact-card {
  @apply bg-white dark:bg-[#2a2a2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm overflow-hidden;
}
.artifact-card-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-[#f0ede7] dark:border-white/5 cursor-pointer;
}
.artifact-card-title {
  @apply text-[14px] font-medium text-[#1a1a1a] dark:text-white truncate max-w-[280px];
}
.artifact-card-body {
  @apply px-4 py-2.5 text-[13px] text-[#5c5b58] dark:text-gray-400 line-clamp-2 min-h-[40px];
}
.artifact-card-type {
  @apply px-4 py-2 flex items-center;
}
.artifact-card-type span {
  @apply inline-block px-2 py-0.5 text-[11px] font-mono bg-[#f5f4f0] dark:bg-white/5 text-[#787774] rounded;
}

/* 右侧面板动画 */
.panel-enter-active { transition: transform 0.25s ease-out, opacity 0.25s ease-out; }
.panel-leave-active { transition: transform 0.15s ease-in, opacity 0.15s ease-in; }
.panel-enter-from { transform: translateX(100%); opacity: 0; }
.panel-leave-to { transform: translateX(100%); opacity: 0; }

/* 预览面板代码区 */
pre code { font-family: 'SF Mono', Menlo, Consolas, monospace; }
</style>
