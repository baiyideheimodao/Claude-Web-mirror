<template>
  <div class="h-screen bg-[#f9f8f5] dark:bg-[#1f1f1e] text-[#1a1a1a] dark:text-gray-200 flex overflow-hidden">
    <!-- 左侧导航栏（可拖拽调整宽度） -->
    <AppNavigation
      :sidebar-width="sidebarWidth"
      @sidebar-change="onSidebarChange"
      @resize="onSidebarResize"
      @resizing="onSidebarResizing"
    />

    <!-- 主聊天区域（独立滚动，侧边栏悬浮不影响） -->
    <main :class="['h-full flex-1 min-w-0 overflow-y-auto', isSidebarResizing ? '' : 'transition-all duration-200 ease-in-out', showArtifactPanel ? '' : '']"
          :style="{ marginLeft: sidebarWidth + 'px' }">
      <!-- 标题栏（官网风格：独立于消息容器，撑满内容区宽度，标题左 + Share右边缘） -->
      <div class="px-6 pt-6 mb-4">
        <div class="flex items-center justify-between">
          <button
            class="flex items-center gap-1 text-[13px] text-[#787774] dark:text-[#9b9a97] hover:text-[#5c5b58] dark:hover:text-[#e8e7e0] transition-colors cursor-pointer"
            @click="!dialogId || messages.length === 0 ? $router.push('/chats') : null"
          >
            <svg v-if="!dialogId || messages.length === 0" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            {{ dialogDetail?.title || '今天有什么可以帮我的' }}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <!-- 官网风格：Share 文字按钮（带边框） -->
          <button class="px-3 py-1 text-[12px] font-medium text-[#787774] dark:text-[#b8b7b4] border border-[#e5e5e4] dark:border-white/10 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors" @click="handleShare">
            Share
          </button>
        </div>
      </div>

      <!-- 消息列表容器 -->
      <div class="max-w-3xl mx-auto px-6 pb-24">

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
              <!-- 用户消息（官网风格：无边框无阴影，深色背景，圆角，无时间戳） -->
              <div class="max-w-[80%] bg-[#121212] dark:bg-[#121212] rounded-xl px-4 py-2.5">
                <!-- 附件列表 -->
                <div v-if="msg.files && msg.files.length > 0" class="flex flex-wrap gap-1.5 mb-1.5">
                  <div
                    v-for="file in msg.files"
                    :key="file.id"
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-lg border border-white/10"
                  >
                    <svg v-if="file.file_type === 'image'" class="w-3.5 h-3.5 text-[#d97757] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/></svg>
                    <svg v-else class="w-3.5 h-3.5 text-[#9b9a97] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
                    <span class="text-[12px] text-[#e5e5e5] truncate max-w-[120px]">{{ file.filename }}</span>
                  </div>
                </div>
                <p v-if="stripAttachmentContent(msg.content)" class="text-[15px] text-[#f8f8f6] leading-relaxed whitespace-pre-wrap">{{ stripAttachmentContent(msg.content) }}</p>
              </div>
            </div>

            <!-- AI 消息（无边框纯文字） -->
            <div v-else>
              <div class="text-[16px] text-[#f8f8f6] dark:text-[#f8f8f6] leading-relaxed prose-sm dark:prose-invert max-w-none" v-html="renderContent(msg.content)"></div>

                <!-- 选项卡片面板（原有标签模式） -->
                <div v-if="getChoicePanel(msg.content) && !closedPanels[msg.id]" class="mt-4 max-w-[80%]">
                  <div class="choice-panel">
                    <div class="choice-panel-header">
                      <span class="choice-panel-title">{{ getChoicePanel(msg.content)?.question }}</span>
                      <button class="choice-panel-close" @click="closedPanels[msg.id] = true" title="关闭">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div class="choice-panel-list">
                      <button v-for="(choice, ci) in getChoicePanel(msg.content)!.choices" :key="ci"
                        :class="['choice-panel-item', selectedChoices[msg.id] === ci ? 'choice-panel-item-active' : '']"
                        @click="handleSelectChoice(msg.id, ci, choice)">
                        <span class="choice-panel-num">{{ ci + 1 }}</span><span>{{ choice }}</span>
                      </button>
                    </div>

                    <div class="choice-panel-footer">
                      <button class="choice-skip-btn" @click="handleSkipChoice(msg.id)">Skip</button>
                    </div>
                  </div>
                </div>

                <!-- 制品向导选项卡（固定在底部，覆盖输入框上方，宽度自适应） -->
                <div v-if="choiceWizard.active && !choiceWizard.completed && msg.id === choiceWizard.currentMsgId && !closedPanels[msg.id]"
                  class="fixed left-0 right-0 bottom-0 z-50" :style="{ marginLeft: sidebarWidth + 'px', marginRight: showArtifactPanel ? artifactPanelWidth + 'px' : '0', transition: isSidebarResizing ? 'none' : 'margin-left 200ms ease-in-out, margin-right 200ms ease-in-out' }">
                  <div class="wizard-panel mx-auto mb-4" style="max-width: 768px; padding: 0 24px;">
                    <!-- 标题栏：问题 + 步骤导航 + 关闭 -->
                    <div class="wizard-header">
                      <span class="wizard-title">{{ getWizardPanel()?.question || '请选择' }}</span>
                      <div class="flex items-center gap-2">
                        <button v-if="choiceWizard.round > 0" class="wizard-nav-btn" @click="choiceWizard.round--" title="上一步">&lt;</button>
                        <span class="wizard-step">{{ choiceWizard.round + 1 }} of {{ choiceWizard.totalRounds }}</span>
                        <button v-if="choiceWizard.round < choiceWizard.totalRounds - 1" class="wizard-nav-btn" @click="choiceWizard.round++" title="下一步">&gt;</button>
                        <button class="wizard-close-btn" @click="handleSkipChoice(msg.id)" title="关闭">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    </div>

                    <!-- 选项列表 -->
                    <div class="wizard-options">
                      <button v-for="(choice, ci) in getWizardPanel()!.choices" :key="ci"
                        :class="['wizard-option', getWizardSelectedChoiceIndex() === ci ? 'wizard-option-active' : '']"
                        @click="handleSelectChoice(msg.id, ci, choice)">
                        <span :class="['wizard-opt-num', getWizardSelectedChoiceIndex() === ci ? 'wizard-opt-num-active' : '']">{{ ci + 1 }}</span>
                        <span class="wizard-opt-text">{{ choice }}</span>
                        <svg class="wizard-opt-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </button>
                    </div>

                    <!-- 底部：Skip 按钮 -->
                    <div class="wizard-footer">
                      <button class="wizard-skip-btn" @click="handleSkipChoice(msg.id)">Skip</button>
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

                <!-- AI消息底部操作栏（官网100%复刻：Copy/Thumbs Up/Thumbs Down/Retry，32×32px按钮 + 20×20px实心图标） -->
                <div class="flex items-center max-w-none">
                  <button class="action-btn" title="复制" @click="handleCopy(msg.content)">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.5 3A1.5 1.5 0 0 1 14 4.5V6h1.5A1.5 1.5 0 0 1 17 7.5v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 15.5V14H4.5A1.5 1.5 0 0 1 3 12.5v-8A1.5 1.5 0 0 1 4.5 3zm1.5 9.5a1.5 1.5 0 0 1-1.5 1.5H7v1.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5H14zM4.5 4a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5z"/></svg>
                  </button>
                  <button class="action-btn" title="好的回复">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.56 2a2.5 2.5 0 0 1 2.452 2.99L11.609 7h2.235a2.75 2.75 0 0 1 2.713 3.202l-.681 4.082A3.25 3.25 0 0 1 12.67 17H4.5A1.5 1.5 0 0 1 3 15.5V9.238a1.5 1.5 0 0 1 1.059-1.433l1.14-.35.139-.048a2.75 2.75 0 0 0 1.56-1.453L8.41 2.59l.07-.13A1 1 0 0 1 9.322 2zM7.81 6.365a3.75 3.75 0 0 1-2.126 1.98l-.192.065-1.14.35A.5.5 0 0 0 4 9.239V15.5a.5.5 0 0 0 .5.5h8.17a2.25 2.25 0 0 0 2.22-1.88l.68-4.082A1.75 1.75 0 0 0 13.844 8H11a.5.5 0 0 1-.49-.598l.521-2.608A1.5 1.5 0 0 0 9.561 3h-.238z"/></svg>
                  </button>
                  <button class="action-btn" title="不好的回复">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.67 3a3.25 3.25 0 0 1 3.206 2.716l.68 4.082A2.75 2.75 0 0 1 13.845 13H11.61l.403 2.01A2.5 2.5 0 0 1 9.56 18h-.238a1 1 0 0 1-.843-.46l-.069-.13-1.514-3.364a2.75 2.75 0 0 0-1.56-1.453l-.139-.047-1.14-.35A1.5 1.5 0 0 1 3 10.761V4.5A1.5 1.5 0 0 1 4.5 3zM4.5 4a.5.5 0 0 0-.5.5v6.262a.5.5 0 0 0 .353.477l1.14.35.19.065a3.75 3.75 0 0 1 2.127 1.98L9.323 17h.238a1.5 1.5 0 0 0 1.47-1.794l-.521-2.608A.5.5 0 0 1 11 12h2.844a1.75 1.75 0 0 0 1.726-2.038l-.68-4.082A2.25 2.25 0 0 0 12.67 4z"/></svg>
                  </button>
                  <button class="action-btn" title="重新生成" @click="handleRegenerate(msg.id)">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.386 2.51A7.5 7.5 0 1 1 5.499 4H3a.5.5 0 0 1 0-1h3.5a.5.5 0 0 1 .49.402L7 3.5V7a.5.5 0 0 1-1 0V4.879a6.5 6.5 0 1 0 4.335-1.37L10 3.5l-.1-.01a.5.5 0 0 1 .1-.99z"/></svg>
                  </button>
                </div>

                <!-- Starburst AI Logo 图标 24×24px，橙色 -->
                <div v-if="isLastAiMessage(msg)" class="mt-2">
                  <svg :ref="setAiLogoRef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-6 h-6 fill-current text-[#d97757]"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/></svg>
                </div>
            </div>
          </template>

        </div>
        <div class="fixed bottom-6 left-0 right-0 z-40" :style="{ marginLeft: sidebarWidth + 'px', marginRight: showArtifactPanel ? artifactPanelWidth + 'px' : '0', transition: isSidebarResizing ? 'none' : 'margin-left 200ms ease-in-out, margin-right 200ms ease-in-out' }">
          <div class="max-w-3xl mx-auto px-6">
            <!-- "Want to be notified when Claude responds?" 提示条 -->
            <div v-if="showNotifyBar" class="mb-3 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#2c2c2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg shadow-sm">
              <span class="text-[13px] text-[#1a1a1a] dark:text-white">当 Claude 回复完成时需要通知吗？</span>
              <button class="px-3 py-1 bg-[#1f1f1e] dark:bg-[#2a2a2a] text-white rounded text-[12px] font-medium hover:bg-black/80 dark:hover:bg-white/10" @click="showNotifyBar = false">通知我</button>
              <button class="p-1 text-[#9b9a97] hover:text-[#5c5b58]" @click="showNotifyBar = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div
              class="bg-white rounded-[20px] dark:bg-[#2c2c2a] border border-[#e5e5e4] dark:border-[rgba(226,225,218,0.12)] hover:border-[#d0d0cd] hover:dark:border-[rgba(226,225,218,0.2)] shadow-none dark:shadow-none transition-colors duration-200 relative"
              :class="{ 'ring-2 ring-[#d97757]/20': isDragging }"
              style="min-height: 122px;"
              @dragenter.prevent="isDragging = true"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="(e: DragEvent) => { if (!(e.currentTarget as Element)?.contains(e.relatedTarget as Node)) isDragging = false }"
              @drop.prevent="handleDrop"
            >
              <!-- 拖拽提示遮罩 -->
              <div v-if="isDragging" class="absolute inset-0 rounded-[20px] bg-[#d97757]/5 flex items-center justify-center z-10 pointer-events-none">
                <div class="text-center">
                  <svg class="w-10 h-10 mx-auto text-[#d97757] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p class="text-[14px] font-medium text-[#d97757]">释放以上传附件</p>
                </div>
              </div>

              <textarea
                ref="inputRef"
                v-model="messageInput"
                rows="1"
                :class="[
                  'w-full bg-transparent border-0 rounded-[20px] pt-4 pb-14 px-4 text-[16px] text-[#1a1a1a] dark:text-[#f8f8f6] placeholder-[#9b9a97] focus:outline-none focus:ring-0 resize-none min-h-[56px] max-h-[200px] leading-relaxed',
                  pendingAttachments.length > 0 ? 'pb-24' : 'pb-14'
                ]"
                placeholder="Reply..."
                @input="autoResize"
                @keydown.enter.exact.prevent="handleSend"
                @paste="handlePaste"
              ></textarea>

              <!-- 附件预览条 -->
              <div v-if="pendingAttachments.length > 0" class="absolute bottom-12 left-3 right-3 flex flex-wrap gap-1.5">
                <div
                  v-for="att in pendingAttachments"
                  :key="att.id"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-[#2f3030] dark:bg-[#2f3030] rounded-lg border border-[#3e3e3e] group/att"
                >
                  <span class="text-[12px] text-[#e5e5e5] truncate max-w-[120px]" :title="`${att.filename} (${formatFileSize(att.size)})`">{{ att.filename }}</span>
                  <!-- 移除按钮 -->
                  <button
                    type="button"
                    @click.stop="removePendingAttachment(att.id)"
                    class="p-0.5 rounded hover:bg-white/10 opacity-0 group-hover/att:opacity-100 transition-opacity cursor-pointer"
                    title="移除附件"
                  >
                    <svg class="w-3 h-3 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <!-- 左侧：附件按钮 -->
                <button type="button" class="p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-md transition-colors group cursor-pointer" title="附件" @click.stop="handleAttachClick">
                  <svg class="w-[17px] h-[17px] text-[#9b9a97] group-hover:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <input ref="fileInputRef" type="file" class="absolute -left-full opacity-0" accept="image/*,.pdf,.txt,.md,.doc,.docx,.csv,.json,.html,.css,.js,.ts,.py,.java,.go,.rs,.xml,.yaml,.yml,.log,.c,.cpp,.h,.hpp,.rb,.php,.sql,.vue" multiple @change="handleFileUpload" />
                </button>

                <!-- 右侧：空状态=模型名+语音，有内容=发送/停止 -->
                <div class="flex items-center gap-1">
                  <!-- 空状态：模型选择器 -->
                  <div v-if="!messageInput.trim() && !isSending"
                    v-click-outside="() => showModelMenu = false"
                    class="flex items-center gap-1 px-2 py-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded cursor-pointer relative"
                    @click="showModelMenu = !showModelMenu"
                  >
                    <span class="text-[12px] text-[#787774]">{{ appStore.currentModel?.name || 'Sonnet 4.6' }}</span>
                    <svg class="w-3 h-3 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    <Transition name="dropdown">
                      <div v-if="showModelMenu" class="absolute bottom-full right-0 mb-1 w-48 bg-white dark:bg-[#2c2c2a] border border-[#e0e0df] dark:border-white/10 rounded-lg shadow-claude-md py-1 z-50">
                        <button v-for="model in appStore.models" :key="model.id" class="w-full px-3 py-1.5 text-left text-[12px] flex justify-between hover:bg-black/[0.04] dark:hover:bg-white/5" :class="model.id === appStore.currentModel?.id ? 'text-[#d97757]' : ''" @click.stop="handleSwitchModel(model)">{{ model.name }}</button>
                      </div>
                    </Transition>
                  </div>

                  <!-- 空状态：语音按钮（波形图标，同HomeView） -->
                  <button
                    v-if="!messageInput.trim() && !isSending"
                    v-tooltip="'语音输入'"
                    class="w-8 h-8 flex items-center justify-center hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-lg transition-colors duration-150 group cursor-pointer"
                    style="padding-left: 6px; padding-right: 6px;"
                    aria-label="Use voice mode"
                  >
                    <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-block overflow-visible">
                      <rect x="0" y="7.5" height="6px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="4" y="5.5" height="10px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="8" y="2.5" height="16px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="12" y="5.5" height="10px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="16" y="2.5" height="16px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                      <rect x="20" y="7.5" height="6px" fill="currentColor" width="1px" rx="0.5" ry="0.5"/>
                    </svg>
                  </button>

                  <!-- 有内容时：发送 / 终止按钮 -->
                  <button
                    v-if="isSending || messageInput.trim()"
                    :disabled="!isSending && !messageInput.trim()"
                    class="w-8 h-8 flex items-center justify-center bg-[#d97757] hover:bg-[#c96a4a] disabled:bg-[#cfcfce] disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150"
                    :title="isSending ? '停止生成' : '发送消息'"
                    @click="isSending ? handleStopGeneration() : handleSend()"
                  >
                    <template v-if="isSending">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"/></svg>
                    </template>
                  </button>
                </div>
              </div>
            </div>

            <p class="text-center text-[12px] text-[#97958c] dark:text-[#97958c] mt-2">
              Claude 可能会出错。请核实重要信息。
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- 右侧制品预览面板（可拖拽调整宽度） -->
    <Transition name="panel">
      <div v-if="showArtifactPanel" ref="artifactPanelRef"
        :class="['h-screen bg-white dark:bg-[#1f1f1e] border-l border-[#e0e0df] dark:border-white/10 flex flex-col shadow-xl shrink-0 relative', isArtifactResizing ? '' : 'transition-all duration-200 ease-in-out']"
        :style="{ width: artifactPanelWidth + 'px' }">
        <!-- 拖拽手柄（左侧边缘） -->
        <div class="absolute left-0 top-0 bottom-0 cursor-col-resize z-[9999] hover:bg-[#d97757]/60 active:bg-[#d97757]"
          :style="{ width: '12px', marginLeft: '-6px', paddingLeft: '6px' }"
          @mousedown="onArtifactResizeStart($event)">
        </div>
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
        <div v-if="artifactViewMode === 'preview'" ref="artifactPreviewRef" class="flex-1 overflow-auto bg-white dark:bg-[#1f1f1e]">
          <iframe
            v-if="currentArtifact && isPreviewable(currentArtifact)"
            :srcdoc="currentArtifact.content"
            class="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
          <div v-else-if="currentArtifact" class="p-6 text-[14px] text-[#5c5b58] dark:text-gray-400">
            <p>此类型的制品暂不支持预览，请切换到「代码」视图查看。</p>
            <pre v-if="!isPreviewable(currentArtifact)" class="mt-4 p-4 bg-[#f5f4f0] dark:bg-[#1f1f1e] rounded-lg overflow-x-auto text-[13px] font-mono whitespace-pre-wrap">{{ currentArtifact.content }}</pre>
          </div>
        </div>

        <!-- 面板内容区：代码模式 -->
        <div v-if="artifactViewMode === 'code'" class="flex-1 overflow-auto bg-[#1f1f1e]">
          <div class="relative min-h-full p-4">
            <div class="absolute top-3 left-4 flex items-center gap-2 z-10">
              <span class="text-[11px] text-[#555] dark:text-gray-500 font-mono">{{ getLanguageTag(currentArtifact?.type) }}</span>
            </div>
            <pre class="font-mono text-[13px] leading-relaxed text-gray-200 whitespace-pre-wrap"><code>{{ currentArtifact?.content }}</code></pre>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, reactive, nextTick } from 'vue'
import type { VNodeRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { dialogApi } from '@/api/dialog'
import { fileApi } from '@/api/file'
import { readFileContent } from '@/utils/fileReader'
import { getDisplayFilename } from '@/utils/fileName'
import type { UploadedFile } from '@/types/api'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const messageInput = ref('')
const isCollapsed = ref(false)
// 侧边栏宽度（可拖拽调整，默认288px，收起时48px）
const sidebarWidth = ref(288)
const isSending = ref(false)
const streamingContent = ref('')
const isDragging = ref(false)
const isAiWaiting = ref(false)
let abortController: AbortController | null = null
const inputRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

/** 待发送的附件列表（上传成功后暂存，随消息一起提交） */
interface PendingAttachment {
  id: string
  filename: string
  fileType: string
  size: number
  previewUrl?: string | null
  /** 可读文本文件的读取内容（txt/md/html/docx 等） */
  textContent?: string | null
}
const pendingAttachments = ref<PendingAttachment[]>([])

/** 将文件大小格式化为可读字符串 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

/** 移除待发送附件 */
const removePendingAttachment = (id: string) => {
  pendingAttachments.value = pendingAttachments.value.filter(f => f.id !== id)
}

/** 清空所有待发送附件 */
const clearPendingAttachments = () => {
  pendingAttachments.value = []
}

const hasPersistedAttachmentId = (attachment?: Partial<PendingAttachment> | null): attachment is PendingAttachment => {
  return typeof attachment?.id === 'string' && attachment.id.length > 0 && !attachment.id.startsWith('temp_')
}
const msgContainerRef = ref<HTMLElement | null>(null)
const aiLogoRef = ref<SVGSVGElement | null>(null)
const setAiLogoRef: VNodeRef = (el) => {
  aiLogoRef.value = el instanceof SVGSVGElement ? el : null
}
const artifactPanelRef = ref<HTMLElement | null>(null)
const showModelMenu = ref(false)
const showNotifyBar = ref(false)
const selectedChoices = reactive<Record<string, number>>({})
const closedPanels = reactive<Record<string, boolean>>({})

/** 侧边栏折叠/展开切换 */
const onSidebarChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
  sidebarWidth.value = collapsed ? 48 : 288
}

/** 侧边栏宽度拖拽回调（由 AppNavigation 组件触发） */
const onSidebarResize = (newWidth: number) => {
  sidebarWidth.value = Math.round(newWidth)
}

/** 侧边栏正在拖拽中（用于禁用 transition 提高跟手性） */
const isSidebarResizing = ref(false)
const onSidebarResizing = (value: boolean) => {
  isSidebarResizing.value = value
}

// ============ 制品面板拖拽调整宽度 ============
// 彻底重写：使用 iframe 遮罩方案解决 iframe 吞事件问题
const artifactPanelWidth = ref(520) // 默认宽度 px
const isArtifactResizing = ref(false)
let _artifactResizeState: { startX: number; startWidth: number; moveCount: number } | null = null

/** 创建一个覆盖整个视口的透明遮罩，拦截所有鼠标事件（防止被 iframe 吞掉） */
function _createResizeOverlay(): HTMLDivElement {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;cursor:col-resize;'
  document.body.appendChild(overlay)
  return overlay
}

const onArtifactResizeStart = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  isArtifactResizing.value = true
  _artifactResizeState = { startX: e.clientX, startWidth: artifactPanelWidth.value, moveCount: 0 }

  // 创建全屏透明遮罩，防止鼠标移到 iframe 区域后丢失事件
  const overlay = _createResizeOverlay()

  const onMove = (ev: MouseEvent) => {
    if (!_artifactResizeState || !isArtifactResizing.value) return
    const state = _artifactResizeState
    state.moveCount++
    const delta = state.startX - ev.clientX
    const rawNewWidth = state.startWidth + delta
    const clampedWidth = Math.min(Math.max(rawNewWidth, 360), window.innerWidth * 0.7)
    artifactPanelWidth.value = Math.round(clampedWidth)
  }

  const onUp = () => {
    // 清理
    isArtifactResizing.value = false
    _artifactResizeState = null
    overlay.remove()
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

// ============ 制品选项卡向导（流式传输完成后智能注入） ============
const WIZARD_TOTAL_ROUNDS = 3
const wizardQuestions = [
  '你希望这个制品的主要用途是什么？',
  '你对界面风格有什么偏好？',
  '还需要添加哪些功能或特性？',
]

const createWizardAnswerSlots = () => Array.from({ length: WIZARD_TOTAL_ROUNDS }, () => null as string | null)
const createWizardSelectionSlots = () => Array.from({ length: WIZARD_TOTAL_ROUNDS }, () => null as number | null)

const choiceWizard = reactive({
  active: false,           // 是否处于制品向导模式
  round: 0,                // 当前轮次（0-2，共 3 轮）
  totalRounds: 3,          // 总轮数
  completed: false,        // 是否已完成所有选择
  currentMsgId: '',        // 当前正在处理的消息 ID
})

// 制品面板状态
const showArtifactPanel = ref(false)
const currentArtifact = ref<{ title: string; content: string; type: string; description: string } | null>(null)
const artifactViewMode = ref<'code' | 'preview'>('preview')
const artifactPreviewRef = ref<HTMLIFrameElement | null>(null)

choiceWizard.completed = false
choiceWizard.totalRounds = WIZARD_TOTAL_ROUNDS

const wizardAnswers = ref<(string | null)[]>(createWizardAnswerSlots())
const wizardSelectionIndices = ref<(number | null)[]>(createWizardSelectionSlots())

const resetWizardProgress = () => {
  choiceWizard.round = 0
  choiceWizard.completed = false
  choiceWizard.currentMsgId = ''
  wizardAnswers.value = createWizardAnswerSlots()
  wizardSelectionIndices.value = createWizardSelectionSlots()
}

const dialogId = computed(() => route.params.id as string | undefined)
const messages = computed(() => appStore.messages)
const dialogDetail = computed(() => appStore.currentDialogDetail)

// 制品模式：从 query 中读取 artifact_type
const artifactType = computed(() => route.query.artifact_type as string | undefined)

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
    const fileIdsQuery = route.query.fileIds as string | undefined
    
    // 处理从 HomeView 传来的文件ID列表
    if (fileIdsQuery && !msg) {
      // 有文件ID但没有消息内容，等待用户输入后发送（暂存fileIds到pendingAttachments）
      // 注意：HomeView上传的文件已存到服务器，这里只记录ID以便发送时附带
      console.log(`[CHATVIEW] Received fileIds from HomeView: ${fileIdsQuery}`)
    }
    
    if (msg) {
      // 优先使用 apiMsg（含文件内容，供 API 使用），msg 仅用于显示
      const apiMsg = route.query.apiMsg as string | undefined
      messageInput.value = apiMsg || msg

      // 如果同时有文件元数据，先添加到待发送列表
      const filesQuery = route.query.files as string | undefined
      if (filesQuery) {
        try {
          const files = JSON.parse(filesQuery)
          for (const f of files) {
            pendingAttachments.value.push({
              id: f.id,
              filename: f.filename,
              fileType: f.file_type,
              size: f.size,
            })
          }
        } catch (e) {
          console.error('[CHATVIEW] Failed to parse files query:', e)
        }
      } else if (fileIdsQuery) {
        // 兼容旧格式：只有 fileIds 没有文件元数据
        const ids = fileIdsQuery.split(',').filter(Boolean)
        for (const id of ids) {
          pendingAttachments.value.push({
            id,
            filename: `file_${id.slice(0, 6)}`,
            fileType: 'document',
            size: 0,
          })
        }
      }

      setTimeout(() => handleSend(), 300)
      router.replace({ path: `/chat/${newId}` })
    } else if (artifactType.value) {
      // 制品模式：创建全新会话（不在旧会话上追加）
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
      const artifactMsg = `我想创建一个「${typeLabel[savedArtifactType.value] || savedArtifactType.value}」类型的制品。请将所有 HTML、CSS、JavaScript 代码全部写在同一个文件中输出，不要拆分成多个文件，以便直接预览和运行最终效果。`
      console.log(`[ARTIFACT] Creating NEW dialog for artifact type=${savedArtifactType.value}`)
      try {
        const res = await appStore.createDialog()
        if (res?.id && res.id !== newId) {
          // 新会话创建成功，跳转到新会话 URL（携带消息触发自动发送）
          router.replace({ path: `/chat/${res.id}`, query: { msg: artifactMsg } })
          return
        }
      } catch (e) {
        console.error('[ARTIFACT] Failed to create new dialog, falling back to current', e)
      }
      // 创建失败时的降级方案：在当前会话中发送
      messageInput.value = artifactMsg
      setTimeout(() => handleSend(), 300)
      router.replace({ path: `/chat/${newId}` })
    }
  }
}, { immediate: true })

/** 从 AI 消息内容中提取选项面板数据 { question, choices[] } */
const getChoicePanel = (content: string): { question: string; choices: string[] } | null => {
  // 优先匹配 [QUESTION]...[/QUESTION] 标签（原有逻辑）
  const qMatch = content.match(/\[QUESTION\](.*?)\[\/QUESTION\]/s)
  if (qMatch) {
    const question = qMatch[1].trim()
    const choiceMatches = content.match(/\[CHOICE\](.*?)\[\/CHOICE\]/gs)
    const choices = choiceMatches ? choiceMatches.map(m => m.replace(/\[CHOICE\]/g, '').replace(/\[\/CHOICE\]/g, '').trim()) : []
    if (choices.length === 0) return null
    return { question, choices }
  }

  // 向导模式：检查当前消息是否是向导消息（通过 choiceWizard.currentMsgId 判断）
  if (choiceWizard.active && content) {
    // 向导的选项由 generateWizardChoices 动态生成，这里不返回
    // 实际的向导面板通过 wizardChoices computed 或 reactive 数据驱动
    return null
  }

  return null
}

/** 为制品向导生成动态选项（根据轮次和上下文智能生成） */
const getWizardPanel = (): { question: string; choices: string[] } | null => {
  if (!choiceWizard.active || choiceWizard.completed) return null

  const lastAiMsg = [...messages.value].reverse().find(m => m.role === 'ai')
  if (!lastAiMsg || lastAiMsg.id !== choiceWizard.currentMsgId) return null

  const questions = [
    '你希望这个制品的主要用途是什么？',
    '你对界面风格有什么偏好？',
    '还需要添加哪些功能或特性？'
  ]

  const allChoices: Record<number, string[][]> = {
    0: [
      ['展示信息为主', '用户交互为主', '数据管理为主'],
      ['企业/专业风格', '现代简约风', '创意活泼风'],
      ['表单和搜索功能', '图表和数据可视化', '分享和协作'],
    ],
    1: [
      ['移动端适配优先', '桌面端体验优先', '响应式设计'],
      ['需要深色模式', '浅色主题即可', '跟随系统设置'],
      ['需要多语言支持', '仅中文即可', '中英双语'],
    ],
    2: [
      ['需要后台管理系统', '纯前端页面即可', '需要 API 对接'],
      ['快速原型 / MVP', '完整产品级', '学习 / Demo 用途'],
      ['不需要了，开始生成', '再给我更多选择', '让我自定义需求'],
    ],
  }

  const round = Math.min(choiceWizard.round, 2)
  return {
    question: wizardQuestions[round],
    choices: allChoices[round % 3][Math.floor(round / 3)] || allChoices[2][2],
  }
}

/** 检测流式回复是否为制品相关请求，并激活向导模式 */
const getWizardSelectedChoiceIndex = (): number | null => {
  return wizardSelectionIndices.value[choiceWizard.round] ?? null
}

const buildWizardFinalPrompt = () => {
  const confirmedAnswers = wizardQuestions
    .map((question, index) => {
      const answer = wizardAnswers.value[index]
      return answer ? `${index + 1}. ${question}\n- ${answer}` : null
    })
    .filter((item): item is string => Boolean(item))

  const unspecifiedQuestions = wizardQuestions
    .map((question, index) => (!wizardAnswers.value[index] ? `${index + 1}. ${question}` : null))
    .filter((item): item is string => Boolean(item))

  const sections = ['请基于我刚才提出的制品需求，结合下面已经确认的信息生成最终结果。']

  if (confirmedAnswers.length > 0) {
    sections.push(`已确认选项：\n${confirmedAnswers.join('\n')}`)
  }

  if (unspecifiedQuestions.length > 0) {
    sections.push(`以下项目未指定，请你自行做出合理、专业的默认决策：\n${unspecifiedQuestions.join('\n')}`)
  }

  sections.push('重要要求：请将所有 HTML、CSS、JavaScript 全部写在同一个文件中输出，不要拆分成多个文件，以便直接预览和运行最终效果。')

  return sections.join('\n\n')
}

const detectAndActivateWizard = (userMsg: string, aiContent: string): void => {
  // 检测用户的首次请求是否为制品类型请求
  const artifactKeywords = /创建|生成|制作|构建|开发|build|create|make|制品|应用|网站|文档|模板|工具|游戏|问卷|survey|app|web|doc|game|tool|creative/i
  const isArtifactRequest = artifactKeywords.test(userMsg)

  // 如果用户请求包含制品关键词且 AI 回复内容较长（说明是有意义的回复）
  // 注意：每次新的制品类请求都应重新激活向导（支持用户在完成一轮后发起新的制品请求）
  if (isArtifactRequest && aiContent.length > 100) {
    // 如果向导已完成但用户又发起了全新的制品请求，重置向导状态
    if (choiceWizard.completed) {
      console.log(`[WIZARD] Previous wizard was completed. Resetting for new artifact request.`)
    }
    console.log(`[WIZARD] Activating choice wizard. User msg keywords detected.`)
    choiceWizard.active = true
    resetWizardProgress()
  }
}

/** 从 AI 回复内容中自动提取代码块/HTML，注入 [ARTIFACT] 标签以生成可预览卡片 */
const autoInjectArtifact = (content: string): { content: string; injected: boolean } => {
  // 已经包含 [ARTIFACT] 标签的不再处理
  if (/\[ARTIFACT\]/.test(content)) {
    return { content, injected: false }
  }

  let extractedTitle = '生成的制品'
  let extractedContent = ''
  let extractedType = 'code'
  let description = ''

  // 策略1：优先提取最大的代码块（html/vue/react/css/js）
  const codeBlockMatches = content.match(/```(html|vue|jsx|tsx|css|javascript|js|typescript|ts)\n([\s\S]*?)```/g)
  if (codeBlockMatches && codeBlockMatches.length > 0) {
    // 取最长或最可能包含完整代码的块（通常 html/vue 块最大）
    let bestMatch = codeBlockMatches[0]
    let bestLen = bestMatch.length
    for (const m of codeBlockMatches) {
      if (m.length > bestLen) {
        bestMatch = m
        bestLen = m.length
      }
    }

    const langMatch = bestMatch.match(/```(\w+)\n([\s\S]*?)```/)
    if (langMatch) {
      extractedType = langMatch[1]
      extractedContent = langMatch[2].trim()
    }

    // 尝试从代码块中提取标题（第一个注释行或 title 标签）
    const titleFromCode = extractedContent.match(/<!--\s*(.+?)\s*-->/)
    if (titleFromCode) extractedTitle = titleFromCode[1].trim()
    else {
      const titleTag = extractedContent.match(/<title>(.*?)<\/title>/i)
      if (titleTag) extractedTitle = titleTag[1].trim()
    }
  }

  // 策略2：如果没找到代码块，检查是否有裸 HTML 内容（没有 ``` 包裹）
  if (!extractedContent && /<(html|!DOCTYPE)\b/i.test(content)) {
    // 提取从 <!DOCTYPE 或 <html 开始到结尾的内容
    const htmlMatch = content.match(/(<!DOCTYPE[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i)
    if (htmlMatch) {
      extractedType = 'html'
      extractedContent = htmlMatch[1].trim()
    }
  }

  // 如果成功提取到有意义的代码内容（至少50字符），注入 ARTIFACT 标签
  if (extractedContent.length >= 50) {
    // 用正文的前两行作为描述
    const plainText = content.replace(/```[\s\S]*?```/g, '').replace(/[#*\-\[\]>]/g, ' ').trim()
    const firstLines = plainText.split('\n').filter(l => l.trim()).slice(0, 2).join(' ').substring(0, 120)
    description = firstLines || '点击查看代码和预览'

    const artifactJson = JSON.stringify({
      title: extractedTitle,
      content: extractedContent,
      type: extractedType,
      description: description,
    })

    console.log(`[ARTIFACT] Auto-injected artifact: type=${extractedType}, title=${extractedTitle}, contentLen=${extractedContent.length}`)

    return {
      content: content + `\n\n[ARTIFACT]${artifactJson}[/ARTIFACT]\n`,
      injected: true,
    }
  }

  return { content, injected: false }
}

/** 渲染消息内容时，移除 [QUESTION]、[CHOICE] 和 [ARTIFACT] 标签块 */
/** 清理用户消息中的附件注入内容，仅用于前端显示 */
const stripAttachmentContent = (content: string): string => {
  if (!content) return ''
  return content
    .replace(/\n\n--- 附件:.*?--- 结束 ---/gs, '')
    .replace(/\n\[附件:.*?\]/g, '')
    .trim()
}

const renderContent = (content: string): string => {
  if (!content) return ''
  let html = content
    .replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '')
    .replace(/\[CHOICE\][\s\S]*?\[\/CHOICE\]/g, '')
    .trim()

  // 核心逻辑：如果包含 [ARTIFACT] 标签，说明有制品数据
  // 制品的代码内容不应该在对话框中显示，只能通过卡片点击后在右侧面板查看
  const hasArtifact = /\[ARTIFACT\]/.test(content)
  if (hasArtifact) {
    // 移除整个 ARTIFACT 块（不渲染到对话框）
    html = html.replace(/\[ARTIFACT\][\s\S]*?\[\/ARTIFACT\]/g, '')
    html = html.replace(/```[\s\S]*?```/g, '')
    html = html.replace(/(<!DOCTYPE[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/gi, '')
  }

  html = html.trim()

  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-[#f5f4f0] dark:bg-[#1f1f1e] rounded-lg p-3 my-3 overflow-x-auto font-mono text-[13px] border border-[#eee] dark:border-white/5"><code class="text-[#1a1a1a] dark:text-gray-200">${code}</code></pre>`
  })

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#f5f4f0] dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[13px] text-[#1a1a1a] dark:text-gray-200">$1</code>')

  // 粗体/斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 链接
  html = html.replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#d97757] underline hover:no-underline">$1</a>')

  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2 border border-[#e5e5e4] dark:border-white/10" />')

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h4 class="font-semibold text-[15px] mt-3 mb-1 text-[#1a1a1a] dark:text-gray-200">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 class="font-semibold text-base mt-3 mb-1 text-[#1a1a1a] dark:text-white">$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2 class="font-semibold text-lg mt-4 mb-2 text-[#1a1a1a] dark:text-white">$1</h2>')

  // 无序列表
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="list-disc ml-5 my-0.5 text-[#1a1a1a] dark:text-gray-200">$1</li>')

  // 分割线
  html = html.replace(/^---$/gm, '<hr class="border-[#e5e5e4] dark:border-white/10 my-4" />')

  // 引用块
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-[#d97757]/30 pl-3 my-2 text-[#5c5b58] dark:text-gray-400 italic">$1</blockquote>')

  return html
}

/** 用户点击选项卡片 */
const handleSelectChoice = async (msgId: string, choiceIndex: number, choiceText: string) => {
  selectedChoices[msgId] = choiceIndex
  const id = dialogId.value

  // 向导模式：记录选择并推进到下一轮
  if (choiceWizard.active && !choiceWizard.completed && msgId === choiceWizard.currentMsgId) {
    wizardSelectionIndices.value[choiceWizard.round] = choiceIndex
    wizardAnswers.value[choiceWizard.round] = choiceText
    console.log(`[WIZARD] Round ${choiceWizard.round + 1}/${choiceWizard.totalRounds}: selected "${choiceText}"`)

    if (choiceWizard.round >= choiceWizard.totalRounds - 1) {
      // 所有轮次完成，退出向导模式，发送最终汇总消息（强制要求单文件输出）
      choiceWizard.completed = true
      closedPanels[msgId] = true
      console.log(`[WIZARD] All ${choiceWizard.totalRounds} rounds completed! Sending one combined request.`)
      messageInput.value = '基于以上所有选择，请生成完整的制品代码和详细说明。【重要】请将所有 HTML、CSS、JavaScript 全部写在一个文件中输出，不要拆分成多个文件，以便直接预览和运行最终效果。'
      messageInput.value = buildWizardFinalPrompt()
      if (!id || isSending.value) return
      await handleSend()
      return
    } else {
      // 还有下一轮，将用户的选择作为上下文继续提问
      choiceWizard.round++
      messageInput.value = ''
      return
    }
    closedPanels[msgId] = true // 关闭当前面板
    return
  }

  // 原有逻辑：非向导模式下的普通选项处理
  if (!id || isSending.value) return
  messageInput.value = choiceText
  await handleSend()
}

/** 用户点击跳过按钮 */
const handleSkipChoice = async (msgId: string) => {
  selectedChoices[msgId] = -1 // 标记为已跳过
  const id = dialogId.value

  // 向导模式下跳过：直接完成向导进入正常对话
  if (choiceWizard.active && !choiceWizard.completed && msgId === choiceWizard.currentMsgId) {
    console.log(`[WIZARD] User skipped at round ${choiceWizard.round + 1}. Completing wizard.`)
    choiceWizard.completed = true
    closedPanels[msgId] = true
    messageInput.value = buildWizardFinalPrompt()
    messageInput.value = '好的，请根据已有信息直接生成制品。【重要】请将所有 HTML、CSS、JavaScript 全部写在一个文件中输出，不要拆分成多个文件，以便直接预览和运行最终效果。'
    messageInput.value = buildWizardFinalPrompt()
    if (!id || isSending.value) return
    await handleSend()
    return
  }

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

/** 从消息内容中提取制品数据 [ARTIFACT]...[/ARTIFACT]，或从代码块中自动提取 */
const getArtifact = (content: string): ArtifactData | null => {
  // 匹配 [ARTIFACT] 标签
  const match = content.match(/\[ARTIFACT\]([\s\S]*?)\[\/ARTIFACT\]/)
  if (match) {
    try {
      let parsed: ArtifactData
      try {
        parsed = JSON.parse(match[1].trim())
      } catch {
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

  // 没有 [ARTIFACT] 标签时不自动提取，避免普通代码片段被误判为制品
  return null
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
  let content = messageInput.value.trim()
  const id = dialogId.value

  // 有附件时允许发送（即使没有文字输入），过滤掉临时附件（ID以temp_开头）
  const hasValidAttachments = pendingAttachments.value.some(hasPersistedAttachmentId)
  if ((!content && !hasValidAttachments) || !id || isSending.value) return

  // 保存附件信息（在清空之前），过滤掉临时附件（ID以temp_开头）
  const validAttachments = pendingAttachments.value.filter(hasPersistedAttachmentId)
  const attachments = validAttachments.map(att => ({
    id: att.id,
    filename: att.filename,
    fileType: att.fileType,
    size: att.size,
    previewUrl: att.previewUrl,
  }))
  const fileIds = attachments.length > 0 ? attachments.map(f => f.id) : undefined

  // 将可读文件内容注入消息（仅发送给 API，不用于前端显示）
  let apiContent = content
  if (validAttachments.length > 0) {
    const parts: string[] = []
    for (const att of validAttachments) {
      if (att.textContent) {
        parts.push(`\n\n--- 附件: ${att.filename} (${formatFileSize(att.size)}) ---\n${att.textContent}\n--- 结束 ---`)
      } else {
        parts.push(`\n[附件: ${att.filename}]`)
      }
    }
    apiContent += parts.join('')
  }

  // 从 HomeView 跳转来的消息中可能已包含注入的文件内容，清理掉用于显示的 content
  const displayContent = content
    .replace(/\n\n--- 附件:.*?--- 结束 ---/gs, '')
    .replace(/\n\[附件:.*?\]/g, '')
    .trim()

  console.log(`[FRONTEND] ====== handleSend START ======`)
  console.log(`[FRONTEND] dialogId: ${id}`)
  console.log(`[FRONTEND] content: ${apiContent.substring(0, 80)}`)

  isSending.value = true
  isAiWaiting.value = true
  streamingContent.value = ''
  abortController = new AbortController()
  savedArtifactType.value &&= undefined // 用完即清除

  // 立即清空输入框和附件
  messageInput.value = ''
  clearPendingAttachments()
  autoResizeByRef()

  // 推一条用户消息到列表（content 只包含用户输入文字，附件通过 files 字段展示）
  appStore.messages.push({
    id: `user_${Date.now()}`,
    role: 'user',
    content: displayContent,
    timestamp: new Date().toISOString(),
    status: 'sent', parent_id: null, version: 1,
    files: attachments.map(a => ({
      id: a.id,
      filename: a.filename,
      file_path: '',
      file_type: a.fileType === 'image' ? 'image' as const : 'document' as const,
      size: a.size,
      uploaded_at: new Date().toISOString(),
      preview_url: a.previewUrl ?? null,
    })),
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

    console.log(`[FRONTEND] calling dialogApi.sendMessageStream(${id}, ...), files:`, fileIds)
    const stream = dialogApi.sendMessageStream(id, apiContent, fileIds, effectiveArtifactType, abortController.signal)

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
        if (isAiWaiting.value) isAiWaiting.value = false
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

    // ============ 流式完成后的向导检测 & 自动制品注入 ============
    const finalContent = tempMsg?.content || ''
    const shouldAttemptArtifactInjection = Boolean(
      effectiveArtifactType ||
      savedArtifactType.value ||
      artifactType.value ||
      choiceWizard.active ||
      choiceWizard.completed ||
      /创建|生成|制作|构建|制品|网站|应用|模板|demo|landing|app|web|html/i.test(content)
    )

    if (tempMsg && shouldAttemptArtifactInjection && !/\[ARTIFACT\]/.test(finalContent)) {
      const injectedArtifact = autoInjectArtifact(finalContent)
      if (injectedArtifact.injected) {
        tempMsg.content = injectedArtifact.content
        console.log('[ARTIFACT] Injected artifact into final AI message for card/preview rendering.')
      }
    }

    // 制品自动注入已禁用：只在 AI 回复明确包含 [ARTIFACT] 标签或对话指定了 artifact_type 时才触发制品流程

    if (!choiceWizard.completed) {
      // 首次请求时检测是否需要激活向导
      if (!choiceWizard.active) {
        detectAndActivateWizard(content, finalContent)
        if (choiceWizard.active) {
          choiceWizard.currentMsgId = tempAiMsgId
          console.log(`[WIZARD] Wizard activated! Round 1/${choiceWizard.totalRounds}. Waiting for user selection on msg ${tempAiMsgId}`)
        }
      } else if (choiceWizard.active && !choiceWizard.completed) {
        // 向导模式下的后续轮次，更新当前消息 ID 以显示新选项卡
        choiceWizard.currentMsgId = tempAiMsgId
        console.log(`[WIZARD] Round ${choiceWizard.round + 1}/${choiceWizard.totalRounds} ready. Choices shown on msg ${tempAiMsgId}`)
      }
    }

    await appStore.fetchDialogList()
  } catch (e: any) {
    console.error(`[FRONTEND] CATCH error:`, e.name, e.message)
    if (e.name !== 'AbortError') {
      console.error('Send stream failed:', e)
      // openDialog 已在 done 时调用；如果异常中断，临时消息保留作为部分结果
      // 不再额外 push，避免重复
    }
  } finally {
    isAiWaiting.value = false
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

// 防止附件点击重复执行
let isAttachHandling = false

/** 附件按钮点击 */
const handleAttachClick = () => {
  // 防止重复执行
  if (isAttachHandling) {
    console.warn('附件点击处理中，忽略重复点击')
    return
  }
  
  if (!fileInputRef.value) {
    console.error('fileInputRef 为 null')
    return
  }
  
  isAttachHandling = true
  
  try {
    // 方案1：直接点击原始输入框
    fileInputRef.value.click()
  } catch (error) {
    console.error('点击文件输入框失败:', error)
    // 方案2：创建新的文件输入框作为备用
    createAndClickFallbackFileInput(fileInputRef.value)
  } finally {
    // 短暂延迟后重置标志，避免快速连续点击
    setTimeout(() => {
      isAttachHandling = false
    }, 100)
  }
}

/** 创建并点击备用文件输入框 */
const createAndClickFallbackFileInput = (originalInput: HTMLInputElement) => {
  const tempInput = document.createElement('input')
  tempInput.type = 'file'
  tempInput.multiple = true
  tempInput.accept = originalInput.accept
  
  // 使用不可见但可点击的位置
  tempInput.style.position = 'fixed'
  tempInput.style.left = '-9999px'
  tempInput.style.opacity = '0'
  tempInput.style.pointerEvents = 'auto'
  
  document.body.appendChild(tempInput)
  
  tempInput.addEventListener('change', () => {
    // 将文件传递给原始输入框
    const event = new Event('change', { bubbles: true })
    Object.defineProperty(event, 'target', { value: { files: tempInput.files } })
    originalInput.dispatchEvent(event)
    
    // 清理临时输入框
    document.body.removeChild(tempInput)
  })
  
  // 确保临时输入框已经添加到DOM后立即点击（同步执行以保持用户激活上下文）
  try {
    tempInput.click()
  } catch (error) {
    console.error('点击临时文件输入框失败:', error)
    // 清理临时输入框
    document.body.removeChild(tempInput)
  }
}

/** 文件上传（通过 file input 选择） */
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  for (let i = 0; i < input.files.length; i++) {
    await uploadAndAddFile(input.files[i])
  }
  input.value = '' // 允许重复选择同一文件
}

/** 拖拽上传 */
const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files?.length) return

  // 过滤允许的文件类型
  const allowedTypes = ['image/', 'application/pdf', 'text/plain', 'application/json', '.md', '.docx',
    '.csv', '.html', '.css', '.js', '.ts', '.py', '.java', '.go', '.rs', '.xml', '.yaml', '.yml', '.log']
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!allowedTypes.some(t => file.type.startsWith(t) || file.name.endsWith(t))) continue
    await uploadAndAddFile(file)
  }
  autoResizeByRef()
}

/** 统一的上传+添加附件方法（供 file upload / drop / paste 共用）
 *
 *  策略：
 *  - 可读文本文件（txt/md/html/css/js/py...）：读取文件内容 → 上传到服务器 → 同时保存 textContent
 *  - docx 文件：用 mammoth 解析纯文本 → 上传到服务器 → 保存解析后的 textContent
 *  - 图片/PDF/其他：仅上传到服务器（只存 fileId，AI 无法读取内容）
 */
const uploadAndAddFile = async (file: File): Promise<void> => {
  try {
    // 1) 先尝试读取文件内容
    const readResult = await readFileContent(file)

    // 2) 上传到服务器
    const res = await fileApi.upload(file, dialogId?.value)
    if (res.success && res.data) {
      // 后端返回嵌套结构: { success, message, data: { id, filename, ... } }
      const raw = res.data as any
      const uploaded: UploadedFile = raw.data ? raw.data : raw
      // 使用服务器返回的文件名，如果为空则使用原始文件名
      const filename = getDisplayFilename(file.name, uploaded.filename)
      pendingAttachments.value.push({
        id: uploaded.id,
        filename,
        fileType: uploaded.file_type,
        size: uploaded.size,
        previewUrl: uploaded.preview_url,
        textContent: readResult?.content ?? null,
      })
      if (readResult) {
        console.log(`[UPLOAD] 文件上传+读取成功: ${filename} (${readResult.method}, ${readResult.content.length}字符, id=${uploaded.id})`)
      } else {
        console.log(`[UPLOAD] 文件上传成功(不可读): ${filename} (id=${uploaded.id})`)
      }
    } else {
      // 上传失败时，仍然创建本地附件预览（使用临时ID）
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      pendingAttachments.value.push({
        id: tempId,
        filename: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size,
        previewUrl: null,
        textContent: readResult?.content ?? null,
      })
      console.log(`[UPLOAD] 上传失败但已创建本地附件预览: ${file.name} (临时ID: ${tempId})`)
      
      // 不再将内容直接注入输入框，保持附件样式显示
      autoResizeByRef()
    }
  } catch (err: any) {
    console.error('[UPLOAD] 处理失败:', err)
    // 异常时也创建本地附件预览
    const tempId = `temp_err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    pendingAttachments.value.push({
      id: tempId,
      filename: file.name,
      fileType: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      previewUrl: null,
      textContent: null,
    })
    console.log(`[UPLOAD] 处理异常但已创建本地附件预览: ${file.name} (临时ID: ${tempId})`)
    autoResizeByRef()
  }
}

/** 粘贴处理（支持 Ctrl+V 粘贴图片/文件） */
const handlePaste = async (e: ClipboardEvent): Promise<void> => {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'file') {
      e.preventDefault() // 阻止默认粘贴行为
      const file = item.getAsFile()
      if (file) {
        await uploadAndAddFile(file)
      }
    }
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

// ============ AI Logo 动画控制 ============
let aiAnimFrameId: number | null = null
let aiLogoOriginalD: string | null = null
let aiLogoPathElement: SVGPathElement | null = null

/** AI Logo 思考动画 */
const startAiLogoAnimation = (svg: SVGSVGElement | null) => {
  if (!svg || typeof svg.querySelector !== 'function') return
  stopAiLogoAnimation()
  const pathElement = svg.querySelector('path')
  if (!pathElement) return

  const originalD = pathElement.getAttribute('d')
  if (!originalD) return

  // 保存到模块级变量，供 stopAiLogoAnimation 使用
  aiLogoOriginalD = originalD
  aiLogoPathElement = pathElement
        
        // ---------- 2. 高级SVG路径解析器 (支持绝对/相对指令 M, m, L, l, H, h, V, v, Z, z，以及连续省略指令) ----------
        // 返回结构: { subpaths: [{ points: [{x,y}], closed: boolean }] }
        function parsePathToPoints(dString) {
            if (!dString) return { subpaths: [] };
            
            // 正则匹配命令字母 和 数值 (支持科学计数法、负号、小数)
            const tokens = [];
            const regex = /([a-zA-Z])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi;
            let match;
            while ((match = regex.exec(dString)) !== null) {
                if (match[1]) {
                    tokens.push({ type: 'cmd', value: match[1] });
                } else if (match[0] !== undefined && match[0] !== '') {
                    tokens.push({ type: 'num', value: parseFloat(match[0]) });
                }
            }
            
            // 解析流程
            let subpaths = [];
            let currentPoints = [];      // 当前子路径点集 (绝对坐标)
            let currentPoint = { x: 0, y: 0 };   // 当前画笔位置 (绝对坐标)
            let subpathClosed = false;
            let lastCmd = '';
            let cmdBuffer = [];            // 存放待处理的数值
            let isRelative = false;
            let startPointOfSubpath = { x: 0, y: 0 };
            
            // 辅助函数：添加点
            function addPoint(x, y) {
                currentPoints.push({ x, y });
                currentPoint = { x, y };
            }
            
            // 处理直线（相对/绝对）
            function processLineTo(rel, x, y) {
                let nx = rel ? currentPoint.x + x : x;
                let ny = rel ? currentPoint.y + y : y;
                addPoint(nx, ny);
            }
            
            // 处理水平线
            function processHorizontal(rel, val) {
                let nx = rel ? currentPoint.x + val : val;
                addPoint(nx, currentPoint.y);
            }
            
            // 处理垂直线
            function processVertical(rel, val) {
                let ny = rel ? currentPoint.y + val : val;
                addPoint(currentPoint.x, ny);
            }
            
            // 闭合子路径
            function closeSubpath() {
                if (currentPoints.length > 0 && !subpathClosed) {
                    // 闭合: 添加回到起点的线段（起点即为当前子路径第一个点）
                    if (currentPoints.length > 1 && (currentPoints[0].x !== currentPoint.x || currentPoints[0].y !== currentPoint.y)) {
                        addPoint(currentPoints[0].x, currentPoints[0].y);
                    }
                    subpathClosed = true;
                }
            }
            
            // 结束当前子路径, 存入列表
            function finalizeSubpath() {
                if (currentPoints.length > 0) {
                    subpaths.push({
                        points: [...currentPoints],
                        closed: subpathClosed
                    });
                }
                currentPoints = [];
                subpathClosed = false;
                // 注意: currentPoint 保留, 但新子路径开始时会重置起始点
            }
            
            let i = 0;
            while (i < tokens.length) {
                const token = tokens[i];
                if (token.type === 'cmd') {
                    // 遇到新命令: 先处理之前缓存的数值? 每个新命令之前确保无残留，不过对于同一命令可连续数值，但新命令重置cmdBuffer
                    cmdBuffer = [];
                    const cmd = token.value;
                    lastCmd = cmd;
                    isRelative = (cmd === cmd.toLowerCase());
                    const absCmd = cmd.toUpperCase();
                    
                    i++;
                    // 收集当前命令对应的所有数值 (直到下一个命令或结束)
                    let numbers = [];
                    while (i < tokens.length && tokens[i].type === 'num') {
                        numbers.push(tokens[i].value);
                        i++;
                    }
                    
                    // 根据命令类型处理
                    if (absCmd === 'M') {
                        // moveto 需要成对出现, 如果之前的子路径非空，则终结上一个子路径
                        if (currentPoints.length > 0) {
                            finalizeSubpath();
                        }
                        // 开启新子路径
                        currentPoints = [];
                        subpathClosed = false;
                        // 处理moveto参数 (必须至少一对坐标)
                        for (let j = 0; j < numbers.length; j += 2) {
                            if (j + 1 >= numbers.length) break;
                            let x = numbers[j];
                            let y = numbers[j+1];
                            let nx = isRelative ? (currentPoint.x + x) : x;
                            let ny = isRelative ? (currentPoint.y + y) : y;
                            // moveto 点记录为当前子路径起始点
                            addPoint(nx, ny);
                            startPointOfSubpath = { x: nx, y: ny };
                            // 如果有多对坐标，后续的坐标按照隐式L命令处理 (规范: 多个M后续点当作L)
                            for (let k = j+2; k < numbers.length; k += 2) {
                                if (k+1 >= numbers.length) break;
                                let lx = numbers[k];
                                let ly = numbers[k+1];
                                let lnx = isRelative ? (currentPoint.x + lx) : lx;
                                let lny = isRelative ? (currentPoint.y + ly) : ly;
                                addPoint(lnx, lny);
                            }
                            break; // 只处理第一对作为真正的M，后续已在内部处理L
                        }
                    }
                    else if (absCmd === 'L') {
                        // 线段
                        for (let j = 0; j < numbers.length; j += 2) {
                            if (j+1 >= numbers.length) break;
                            let x = numbers[j];
                            let y = numbers[j+1];
                            processLineTo(isRelative, x, y);
                        }
                    }
                    else if (absCmd === 'H') {
                        for (let j = 0; j < numbers.length; j++) {
                            processHorizontal(isRelative, numbers[j]);
                        }
                    }
                    else if (absCmd === 'V') {
                        for (let j = 0; j < numbers.length; j++) {
                            processVertical(isRelative, numbers[j]);
                        }
                    }
                    else if (absCmd === 'Z') {
                        // 闭合路径
                        closeSubpath();
                    }
                    else if (absCmd === 'C' || absCmd === 'Q' || absCmd === 'A' || absCmd === 'S' || absCmd === 'T') {
                        // 本路径中仅包含直线/折线，没有高阶曲线，但为了稳健，遇到曲线做近似处理：只记录端点（近似忽略控制点）
                        // 注意：题目路径本身只有 M/L/H/V 及相对小写，没有曲线指令，为了安全忽略曲线内部点，只处理终点。
                        console.warn("检测到曲线命令，为保持形状只添加终点/近似, 可能丢失细节, 但此svg无曲线放心");
                        if (absCmd === 'C') {
                            // 三次贝塞尔: 每组需要6个数值，取终点
                            for (let j = 0; j+5 < numbers.length; j += 6) {
                                let endX = numbers[j+4];
                                let endY = numbers[j+5];
                                processLineTo(isRelative, endX, endY);
                            }
                        } else if (absCmd === 'Q') {
                            for (let j = 0; j+3 < numbers.length; j += 4) {
                                let endX = numbers[j+2];
                                let endY = numbers[j+3];
                                processLineTo(isRelative, endX, endY);
                            }
                        } else if (absCmd === 'A') {
                            for (let j = 0; j+6 < numbers.length; j += 7) {
                                let endX = numbers[j+5];
                                let endY = numbers[j+6];
                                processLineTo(isRelative, endX, endY);
                            }
                        } else {
                            // 其他近似处理
                            for (let j = 0; j+1 < numbers.length; j+=2) {
                                if(j+1>=numbers.length)break;
                                processLineTo(isRelative, numbers[j], numbers[j+1]);
                            }
                        }
                    }
                    else {
                        // 未知命令忽略
                    }
                } else {
                    // 理论上不应该出现数值而没有命令, 跳过
                    i++;
                }
            }
            // 最后结束最后一个子路径
            if (currentPoints.length > 0) {
                finalizeSubpath();
            }
            return { subpaths };
        }
        
        // ---------- 3. 根据点集重新生成路径 (绝对坐标，M + L + Z) ----------
        function rebuildPathFromSubpaths(subpaths) {
            if (!subpaths || subpaths.length === 0) return '';
            let dParts = [];
            for (let sub of subpaths) {
                if (!sub.points || sub.points.length === 0) continue;
                // 第一个点用 M
                dParts.push(`M ${sub.points[0].x} ${sub.points[0].y}`);
                // 后续点 L
                for (let i = 1; i < sub.points.length; i++) {
                    dParts.push(`L ${sub.points[i].x} ${sub.points[i].y}`);
                }
                // 闭合
                if (sub.closed) {
                    dParts.push('Z');
                }
            }
            return dParts.join(' ');
        }
        
        // ---------- 4. 解析原始路径获取所有子路径 & 原始顶点数据 ----------
        const parsed = parsePathToPoints(originalD);
        if (!parsed.subpaths.length) {
            console.error("路径解析失败, 返回原始路径");
            pathElement.setAttribute('d', originalD);
            return;
        }
        
        // 深拷贝原始点集 (用于恢复原始坐标)
        let originalSubpaths = [];
        for (let sub of parsed.subpaths) {
            let pointsCopy = sub.points.map(p => ({ x: p.x, y: p.y }));
            originalSubpaths.push({
                points: pointsCopy,
                closed: sub.closed
            });
        }
        
        // ---------- 5. 计算全局中心 (基于所有顶点) & 最大半径 & 半径阈值(一半) ----------
        let allPoints = [];
        for (let sub of originalSubpaths) {
            for (let pt of sub.points) {
                allPoints.push(pt);
            }
        }
        if (allPoints.length === 0) {
            console.warn("没有顶点数据");
            pathElement.setAttribute('d', originalD);
            return;
        }
        
        // 中心：所有顶点的平均坐标 (更符合放射中心感)
        let centerX = 0, centerY = 0;
        for (let p of allPoints) {
            centerX += p.x;
            centerY += p.y;
        }
        centerX /= allPoints.length;
        centerY /= allPoints.length;
        
        // 最大半径 (从中心到最远顶点)
        let maxRadius = 0;
        for (let p of allPoints) {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.hypot(dx, dy);
            if (dist > maxRadius) maxRadius = dist;
        }
        const thresholdRadius = maxRadius / 2;   // 半径的一半
        
        // 预计算每个原始顶点相对于中心的方向和原始距离 (以便快速变形)
        // 存储原始顶点信息： 所属子路径索引、点索引、原始坐标、距离、单位向量
        let verticesMeta = [];
        for (let si = 0; si < originalSubpaths.length; si++) {
            const sub = originalSubpaths[si];
            for (let pi = 0; pi < sub.points.length; pi++) {
                const pt = sub.points[pi];
                const dx = pt.x - centerX;
                const dy = pt.y - centerY;
                const dist = Math.hypot(dx, dy);
                const dirX = dist > 1e-6 ? dx / dist : 0;
                const dirY = dist > 1e-6 ? dy / dist : 0;
                verticesMeta.push({
                    subIdx: si,
                    pointIdx: pi,
                    origX: pt.x,
                    origY: pt.y,
                    dist: dist,
                    dirX: dirX,
                    dirY: dirY
                });
            }
        }
        
        // 变形函数: factor 0 -> 原始形态, factor 1 -> 完全收缩(距离>阈值点压到阈值半径边界, 内部点不变)
        // 对于原始距离 dist > thresholdRadius 的点: 新距离 = thresholdRadius + (dist - thresholdRadius) * (1 - factor)
        // 当 factor=1 新距离 = thresholdRadius; factor=0 新距离 = dist。
        // 内部点 (dist <= thresholdRadius) 保持不变。
        function computeDeformedPoint(meta, factor) {
            if (meta.dist <= thresholdRadius) {
                // 内部点完全不动，保持原始位置
                return { x: meta.origX, y: meta.origY };
            } else {
                // 外部点根据因子向阈值圆内收缩
                const newDist = thresholdRadius + (meta.dist - thresholdRadius) * (1 - factor);
                const newX = centerX + meta.dirX * newDist;
                const newY = centerY + meta.dirY * newDist;
                return { x: newX, y: newY };
            }
        }
        
        // 根据 factor 重建所有子路径的新点集
        function buildDeformedSubpaths(factor) {
            // 深拷贝结构，方便填充
            let newSubpaths = [];
            for (let sub of originalSubpaths) {
                newSubpaths.push({
                    points: [],
                    closed: sub.closed
                });
            }
            for (let meta of verticesMeta) {
                const newPt = computeDeformedPoint(meta, factor);
                newSubpaths[meta.subIdx].points[meta.pointIdx] = newPt;
            }
            // 确保每个子路径的点顺序正确，无缺失 (上面已按索引填充)
            return newSubpaths;
        }
        
        // ---------- 6. 动画系统: 呼吸/收缩恢复来回循环 (无限循环) ----------
        let animationId = null;
        let startTimestamp = null;
        let cycleDuration = 800; // 一个完整收缩+恢复周期 
        let direction = 2;       
        function computeFactorByTime(nowMs) {
            if (startTimestamp === null) startTimestamp = nowMs;
            const elapsed = (nowMs - startTimestamp) % cycleDuration;   // 周期内位置
            const halfCycle = cycleDuration / 2;
            let t = elapsed / halfCycle;  // [0,2]
            if (t <= 1) {
                // 收缩阶段: t:0->1  factor:0 -> 1
                return t;       // 从原始 -> 完全收缩
            } else {
                // 恢复阶段: t:1->2  factor:1 -> 0
                return 2 - t;   // 完全收缩回到原始
            }
        }
        
        // 更新路径的d属性
        function updatePathByFactor(factor) {
            const deformedSubpaths = buildDeformedSubpaths(factor);
            const newD = rebuildPathFromSubpaths(deformedSubpaths);
            pathElement.setAttribute('d', newD);
            // 更新UI显示因子状态(调试)
            const stateSpan = document.getElementById('animState');
            if (stateSpan) {
                let percent = Math.round(factor * 100);
                if (factor > 0.98) stateSpan.innerHTML = `⚡ 完全收缩 · 向心聚拢 (${percent}%)`;
                else if (factor < 0.02) stateSpan.innerHTML = `🌀 原始放射形态 · 舒展 (${percent}%)`;
                else if (factor > 0.5) stateSpan.innerHTML = `📐 收缩变形中 · 边缘内聚 (${percent}%)`;
                else stateSpan.innerHTML = `🌊 恢复舒展 · 向外复位 (${percent}%)`;
            }
        }
        
        // 动画循环
        function animate(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const factor = computeFactorByTime(timestamp);
            updatePathByFactor(factor);
            animationId = requestAnimationFrame(animate);
            aiAnimFrameId = animationId;
        }
        
        // 重置为原始形态 (停止动画，设置为完全原始形态，再可选重启)
        function resetToOriginal() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            // 重置为原始形态 (factor = 0)
            updatePathByFactor(0);
            // 重置时间戳，重新启动动画实现连续恢复循环
            startTimestamp = null;
            // 重新启动动画
            animationId = requestAnimationFrame(animate);
            aiAnimFrameId = animationId;
            const stateSpan = document.getElementById('animState');
            if (stateSpan) stateSpan.innerHTML = `🔄 已重置 · 继续动态收缩恢复`;
            // 闪烁重置提示
            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { if(resetBtn) resetBtn.style.transform = ''; }, 150);
            }
        }
        
        // 绑定重置按钮
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resetToOriginal();
            });
        }
        
        // 开始动画
        animationId = requestAnimationFrame(animate);
        
    aiAnimFrameId = animationId
  }

const stopAiLogoAnimation = () => {
  if (aiAnimFrameId !== null) {
    cancelAnimationFrame(aiAnimFrameId)
    aiAnimFrameId = null
  }
  // 停止后重置 path 到原始形态
  if (aiLogoPathElement && aiLogoOriginalD) {
    aiLogoPathElement.setAttribute('d', aiLogoOriginalD)
    aiLogoPathElement = null
    aiLogoOriginalD = null
  }
}

const syncAiLogoAnimation = async () => {
  if (!isAiWaiting.value) {
    stopAiLogoAnimation()
    return
  }

  await nextTick()

  if (!isAiWaiting.value || !aiLogoRef.value) {
    stopAiLogoAnimation()
    return
  }

  try {
    startAiLogoAnimation(aiLogoRef.value)
  } catch (e) {
    stopAiLogoAnimation()
  }
}

watch([isAiWaiting, aiLogoRef], () => {
  void syncAiLogoAnimation()
}, { flush: 'post' })

onBeforeUnmount(() => {
  stopAiLogoAnimation()
})

watch(isAiWaiting, (val) => {
  try {
    if (val && aiLogoRef.value) {
      startAiLogoAnimation(aiLogoRef.value)
    } else {
      stopAiLogoAnimation()
    }
  } catch (e) {
    // 静默处理动画错误，不影响主流程
  }
})
</script>

<style scoped>
/* 官网100%复刻：32×32px按钮，无padding，圆角6px，颜色#97958c */
.action-btn {
  @apply w-8 h-8 inline-flex items-center justify-center shrink-0 rounded-md border-transparent
         transition duration-300 ease-[cubic-bezier(0.165,0.85,0.45,1)]
         hover:bg-black/[0.04] dark:hover:bg-white/5 cursor-pointer select-none;
}
.action-btn svg {
  @apply w-5 h-5 text-[#97958c] group-hover:text-text-100;
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
  @apply bg-white dark:bg-[#2c2c2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm overflow-hidden;
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
  @apply bg-white dark:bg-[#2c2c2a] border border-[#e0e0df] dark:border-white/10 rounded-xl shadow-sm overflow-hidden;
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

/* 制品向导面板 - 官网风格 */
.wizard-panel {
  background-color: #fff;
  border: 1px solid #3a3936;
  border-radius: 1rem;
  overflow: hidden;
}
.dark .wizard-panel {
  background-color: #2c2c2a;
  border-color: #5c5b58;
}
.wizard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
}
.wizard-title {
  font-size: 15px;
  color: #fff;
}
.wizard-step {
  font-size: 13px;
  color: #9b9a97;
  margin: 0 0.375rem;
  user-select: none;
}
.wizard-nav-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #787774;
  cursor: pointer;
  transition: color 0.15s;
  font-family: ui-sans-serif, system-ui;
}
.wizard-nav-btn:hover {
  color: white;
}
.wizard-close-btn {
  padding: 0.25rem;
  color: #787774;
  transition: color 0.15s;
  cursor: pointer;
  margin-left: 0.25rem;
}
.wizard-close-btn:hover {
  color: white;
}
.wizard-options {
  padding: 0.5rem 0.5rem 0.5rem;
}
.wizard-options > * + * {
  margin-top: 0.125rem;
}
.wizard-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  text-align: left;
  transition: all 0.15s;
  cursor: pointer;
}
.wizard-option:hover {
  background-color: rgba(255,255,255,0.04);
}
.wizard-option-active {
  background-color: rgba(255,255,255,0.06);
}
.wizard-opt-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: #9b9a97;
  background: transparent;
  border: 1px solid rgba(74,73,71,0.5);
  border-radius: 0.5rem;
  transition: all 0.15s;
}
.wizard-opt-num-active {
  color: white;
  background: transparent;
  border: none;
}
.wizard-opt-text {
  flex: 1;
  font-size: 14px;
  color: #e8e7e0;
  line-height: 1.25;
}
.wizard-option-active .wizard-opt-text {
  color: white;
  font-weight: 500;
}
.wizard-opt-arrow {
  width: 16px;
  height: 16px;
  color: #5c5b58;
  opacity: 0;
  transition: opacity 0.15s;
  margin-left: auto;
  flex-shrink: 0;
}
.wizard-option:hover .wizard-opt-arrow,
.wizard-option-active .wizard-opt-arrow {
  opacity: 1;
}
.wizard-footer {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0.75rem 1.25rem 1rem;
}
.wizard-skip-btn {
  padding: 0.375rem 1rem;
  font-size: 13px;
  font-weight: 500;
  color: #9b9a97;
  border: 1px solid rgba(74,73,71,0.5);
  border-radius: 0.5rem;
  transition: all 0.15s;
  cursor: pointer;
}
.wizard-skip-btn:hover {
  background-color: rgba(255,255,255,0.05);
  color: #e8e7e0;
  border-color: rgba(92,91,88,0.5);
}
</style>
