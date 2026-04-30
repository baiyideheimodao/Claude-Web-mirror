<template>
  <div class="h-screen bg-bg-100 dark:bg-bg-100 text-text-100 dark:text-text-100 flex overflow-hidden">
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
          <div class="min-w-0 max-w-[min(60vw,32rem)]">
            <button
              v-if="!isEditingTitle"
              class="flex items-center gap-1 text-[13px] text-text-400 dark:text-text-500 hover:text-text-300 dark:hover:text-text-200 transition-colors cursor-pointer min-w-0"
              @click="handleTitleClick"
            >
              <svg v-if="!canRenameCurrentDialog" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              <span class="truncate">{{ currentDialogTitle }}</span>
              <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>

            <input
              v-else
              ref="titleInputRef"
              v-model="editableTitle"
              type="text"
              maxlength="200"
              class="h-7 min-w-[160px] max-w-full rounded-[4px] border border-accent-100 bg-bg-000 px-1.5 text-[13px] leading-none text-text-100 shadow-none outline-none dark:bg-bg-200 dark:text-text-000"
              @blur="handleTitleInputBlur"
            >
          </div>

          <!-- 官网风格：Share 文字按钮（带边框） -->
          <button class="px-3 py-1 text-[12px] font-medium text-text-400 dark:text-text-300 border border-border-200 dark:border-border-100 rounded-lg hover:bg-text-100/[0.03] dark:hover:bg-text-000/5 transition-colors" @click="handleShare">
            Share
          </button>
        </div>
      </div>

      <!-- 消息列表容器 -->
      <div class="max-w-3xl mx-auto px-6 pb-24">

        <!-- 消息列表区域 -->
        <div ref="msgContainerRef" class="space-y-6 mb-32">
          <!-- 空状态：无对话时提示 -->
          <div v-if="!dialogId || (!displayMessages.length && !isSending)" class="text-center py-20">
            <p class="text-[15px] text-text-500">开始新对话</p>
          </div>

          <!-- 消息列表 -->
          <template v-for="(msg, index) in displayMessages" :key="msg.id">
            <!-- 用户消息 -->
            <div 
              v-if="msg.role === 'user'" 
              class="flex justify-end"
              @mouseenter="userHoveredMessageId = msg.id"
              @mouseleave="userHoveredMessageId = null"
            >
              <div class="flex flex-col items-end max-w-[80%]">
                <!-- 用户消息（官网风格：无边框无阴影，深色背景，圆角，无时间戳） -->
                <div class="bg-bg-000 dark:bg-bg-000 rounded-xl px-4 py-2.5">
                  <!-- 附件列表 -->
                  <div v-if="msg.files && msg.files.length > 0" class="flex flex-wrap gap-1.5 mb-1.5">
                    <div
                      v-for="file in msg.files"
                      :key="file.id"
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-lg border border-white/10"
                    >
                      <svg v-if="file.file_type === 'image'" class="w-3.5 h-3.5 text-brand-100 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/></svg>
                      <svg v-else class="w-3.5 h-3.5 text-text-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
                      <span class="text-[12px] text-text-100 dark:text-text-100 truncate max-w-[120px]">{{ file.filename }}</span>
                    </div>
                  </div>
                  
                  <!-- 编辑模式 -->
                  <div v-if="editingMessageId === msg.id">
                    <textarea
                      v-model="editingMessageContent"
                      class="w-full bg-transparent text-[15px] text-text-100 dark:text-text-100 leading-relaxed whitespace-pre-wrap border-none outline-none resize-none min-h-[60px]"
                      @keydown.enter.exact.prevent="handleSaveEdit"
                      @keydown.escape="handleCancelEdit"
                      autofocus
                    ></textarea>
                  </div>
                  <!-- 查看模式 -->
                  <div v-else>
                    <p v-if="stripAttachmentContent(msg.content)" class="text-[15px] text-text-100 dark:text-text-100 leading-relaxed whitespace-pre-wrap">{{ stripAttachmentContent(msg.content) }}</p>
                  </div>
                </div>
                
                <!-- 用户消息操作栏（始终保持高度稳定，悬停时显示内容） -->
                <div 
                  class="h-8 flex items-center transition-opacity duration-200"
                  :class="userHoveredMessageId === msg.id || editingMessageId === msg.id ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                >
                  <!-- 编辑模式下的操作 -->
                  <div v-if="editingMessageId === msg.id" class="flex items-center gap-2">
                    <button 
                      class="action-btn text-[11px] text-text-000 bg-brand-100 hover:bg-brand-200 font-medium px-3 py-1 rounded-md"
                      title="保存编辑"
                      @click="handleSaveEdit"
                    >
                      保存
                    </button>
                    <button 
                      class="action-btn text-[11px] text-[#787774] hover:text-[#5c5b58] font-medium px-3 py-1 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/5"
                      title="取消编辑"
                      @click="handleCancelEdit"
                    >
                      取消
                    </button>
                  </div>
                  
                  <!-- 查看模式下的操作 -->
                  <div v-else class="flex items-center gap-1">
                    <!-- 日期显示 -->
                    <span class="text-[11px] text-text-300 dark:text-text-300 ml-1 mr-1">
                      {{ formatMessageTime(msg) }}
                    </span>
                    
                    <!-- 复制按钮 -->
                    <button class="action-btn" title="复制" @click="handleCopy(msg.content)">
                      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.5 3A1.5 1.5 0 0 1 14 4.5V6h1.5A1.5 1.5 0 0 1 17 7.5v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 15.5V14H4.5A1.5 1.5 0 0 1 3 12.5v-8A1.5 1.5 0 0 1 4.5 3zm1.5 9.5a1.5 1.5 0 0 1-1.5 1.5H7v1.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5H14zM4.5 4a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5z"/></svg>
                    </button>
                    
                    <!-- 编辑按钮 -->
                    <button class="action-btn group/btn" title="编辑" @click="handleEditUserMessage(msg.id)">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="text-text-500 group-hover/btn:text-text-100" aria-hidden="true" style="flex-shrink: 0;">
                        <path d="M9.728 2.88a1.5 1.5 0 0 1 1.946-.847l2.792 1.1a1.5 1.5 0 0 1 .845 1.945l-3.92 9.953a1.5 1.5 0 0 1-.452.615l-.088.066-3.143 2.186a.75.75 0 0 1-1.135-.362l-.026-.095-.81-3.742a1.5 1.5 0 0 1 .071-.867zm-2.99 10.319a.5.5 0 0 0-.023.288l.73 3.376 2.835-1.971.058-.047a.5.5 0 0 0 .122-.18l2.637-6.698-3.721-1.466zm4.57-10.236a.5.5 0 0 0-.65.283L9.743 5.57l3.722 1.467.917-2.327a.5.5 0 0 0-.283-.648z"></path>
                      </svg>
                    </button>
                    
                    <!-- 重新生成/重试按钮 -->
                    <button class="action-btn" title="重新生成回答" @click="handleRegenerate(msg.id)">
                      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.386 2.51A7.5 7.5 0 1 1 5.499 4H3a.5.5 0 0 1 0-1h3.5a.5.5 0 0 1 .49.402L7 3.5V7a.5.5 0 0 1-1 0V4.879a6.5 6.5 0 1 0 4.335-1.37L10 3.5l-.1-.01a.5.5 0 0 1 .1-.99z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI 消息（无边框纯文字） -->
            <div 
              v-else
              @mouseenter="aiHoveredMessageId = msg.id"
              @mouseleave="aiHoveredMessageId = null"
            >
              <div class="text-[16px] text-text-100 dark:text-text-100 leading-relaxed prose-sm dark:prose-invert max-w-none" v-html="renderContent(msg.content)"></div>

                <!-- HTML 预览组件 -->
                <div v-if="getMessageHtmlPreview(msg)" class="mt-4 w-full group relative">
                  <div class="html-preview-card border-0 shadow-none bg-transparent">
                    <!-- 顶部悬停菜单区域 -->
                    <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <div class="relative">
                        <!-- 三个点菜单按钮 -->
                        <button 
                          class="w-6 h-6 flex items-center justify-center rounded text-[#9b9a97] hover:text-[#787774] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                          @click="toggleHtmlMenu(msg.id)"
                        >
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>
                        
                        <!-- 下拉菜单 -->
                        <div 
                          v-if="htmlMenuOpen === msg.id"
                          class="absolute right-0 top-full mt-1 w-48 py-1 bg-white/95 dark:bg-[#2c2c2a]/95 backdrop-blur-sm rounded-lg z-20"
                          v-click-outside="() => htmlMenuOpen = null"
                        >
                          <button 
                            class="w-full px-4 py-2.5 text-[13px] text-[#1a1a1a] dark:text-white hover:bg-[#f5f4f0] dark:hover:bg-white/5 flex items-center gap-2"
                            @click="copyHtmlContent(getMessageHtmlPreview(msg)!)"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"/>
                            </svg>
                            <span>Copy to clipboard</span>
                          </button>
                          <button 
                            class="w-full px-4 py-2.5 text-[13px] text-[#1a1a1a] dark:text-white hover:bg-[#f5f4f0] dark:hover:bg-white/5 flex items-center gap-2"
                            @click="downloadHtmlFile(getMessageHtmlPreview(msg)!)"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                            <span>Download file</span>
                          </button>
                          <div class="border-t border-[#f0ede7] dark:border-white/5 my-1"></div>
                          <button 
                            class="w-full px-4 py-2.5 text-[13px] text-[#1a1a1a] dark:text-white hover:bg-[#f5f4f0] dark:hover:bg-white/5 flex items-center gap-2"
                            @click="openHtmlInNewTab(getMessageHtmlPreview(msg)!)"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                            </svg>
                            <span>Open in new tab</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 预览内容区域 -->
                    <div class="html-preview-content">
                      <iframe
                        :srcdoc="wrapWithProgressiveRender(getMessageHtmlPreview(msg)!)"
                        style="width: 100%; height: auto; border: none; display: block;"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        allow="clipboard-write *"
                        title="HTML 预览"
                        @load="onIframeLoad(msg.id)"
                        :data-message-id="msg.id"
                        ref="iframeRefs"
                      ></iframe>
                    </div>
                  </div>
                </div>

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
                <div 
                  class="flex items-center gap-1 mt-1 transition-opacity duration-200"
                  :class="aiHoveredMessageId === msg.id ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                >
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
<!-- 分支切换按钮区域（如果有多个分支） -->
                <div v-if="hasMultipleBranches(msg.id)" class="flex items-center gap-1 px-1">
                  <button 
                    class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                    :disabled="getMessageVersionInfo(msg.id).current <= 1"
                    @click="switchToPrevBranch(msg.id)"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="text-text-500 group-hover/btn:text-text-100" aria-hidden="true" style="flex-shrink: 0;">
                      <path d="M13.24 3.072a.5.5 0 0 1 .667.718l-.067.076L7.233 10l6.607 6.134a.5.5 0 1 1-.68.732l-7-6.5-.068-.077a.5.5 0 0 1 .068-.655l7-6.5z"></path>
                    </svg>
                  </button>
                  <span class="text-[11px] text-[#787774] font-medium px-1">
                    {{ getMessageVersionInfo(msg.id).current }} / {{ getMessageVersionInfo(msg.id).total }}
                  </span>
                  <button 
                    class="p-1 hover:bg-black/[0.04] dark:hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                    :disabled="getMessageVersionInfo(msg.id).current >= getMessageVersionInfo(msg.id).total"
                    @click="switchToNextBranch(msg.id)"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="text-text-500 group-hover/btn:text-text-100" aria-hidden="true" style="flex-shrink: 0;">
                      <path d="M6.134 3.16a.5.5 0 0 1 .626-.088l.08.062 7 6.5a.5.5 0 0 1 .068.655l-.068.077-7 6.5a.5.5 0 1 1-.68-.732L12.767 10 6.16 3.866l-.067-.076a.5.5 0 0 1 .04-.63"></path>
                    </svg>
                  </button>
                </div>
                </div>

                <!-- Starburst AI Logo 图标 24×24px，橙色 -->
                <div v-if="isLastAiMessage(msg)" class="mt-2">
                  <svg :ref="setAiLogoRef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-6 h-6 fill-current text-[#d97757]"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/></svg>
                </div>
            </div>
          </template>

        </div>
        <div class="fixed bottom-0 left-0 right-0 z-40" :style="{ marginLeft: sidebarWidth + 'px', marginRight: showArtifactPanel ? artifactPanelWidth + 'px' : '0', transition: isSidebarResizing ? 'none' : 'margin-left 200ms ease-in-out, margin-right 200ms ease-in-out' }">
          <div class="chat-composer-mask pointer-events-none absolute inset-x-0 bottom-0 h-48"></div>
          <div class="relative max-w-3xl mx-auto px-6 pb-6">
            <!-- "Want to be notified when Claude responds?" 提示条 -->
            <div v-if="showNotifyBar" class="mb-3 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#2c2c2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg shadow-sm">
              <span class="text-[13px] text-[#1a1a1a] dark:text-white">当 Claude 回复完成时需要通知吗？</span>
              <button class="px-3 py-1 bg-[#1f1f1e] dark:bg-[#2a2a2a] text-white rounded text-[12px] font-medium hover:bg-black/80 dark:hover:bg-white/10" @click="showNotifyBar = false">通知我</button>
              <button class="p-1 text-[#9b9a97] hover:text-[#5c5b58]" @click="showNotifyBar = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div
              class="pointer-events-auto bg-white rounded-[20px] dark:bg-[#2c2c2a] border border-[#e5e5e4] dark:border-[rgba(226,225,218,0.12)] hover:border-[#d0d0cd] hover:dark:border-[rgba(226,225,218,0.2)] shadow-none dark:shadow-none transition-colors duration-200 relative"
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

            <p class="pointer-events-auto text-center text-[12px] text-[#97958c] dark:text-[#97958c] mt-2">
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
            :srcdoc="getArtifactPreviewContent(currentArtifact)"
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
import type { UploadedFile, MessageBranch, Message } from '@/types/api'

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
const isEditingTitle = ref(false)
const isRenamingTitle = ref(false)
const editableTitle = ref('')
let abortController: AbortController | null = null
const inputRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const titleInputRef = ref<HTMLInputElement | null>(null)

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
const canRenameCurrentDialog = computed(() => Boolean(dialogId.value && dialogDetail.value))
const currentDialogTitle = computed(() => dialogDetail.value?.title || '今天有什么可以帮我的')

// 过滤后的消息：根据分支选择显示消息
const displayMessages = computed(() => {
  const result: typeof messages.value = []
  const userMessages: Record<string, any> = {} // 用户消息ID -> 用户消息对象
  const aiMessageGroups: Record<string, any[]> = {} // 父用户消息ID -> AI消息数组
  const selectedBranchIds: Record<string, string> = {} // 分支键 -> 选中的分支ID

  console.log('[FRONTEND] ===== displayMessages START =====')
  console.log('[FRONTEND] All messages:', messages.value.map(m => ({id: m.id, role: m.role, parent_id: m.parent_id, content: m.content.substring(0, 50)})))

  // 首先，收集所有消息并按用户消息分组
  for (const msg of messages.value) {
    if (msg.role === 'user') {
      userMessages[msg.id] = msg
      result.push(msg) // 用户消息总是显示
    } else if (msg.role === 'ai') {
      const parentId = msg.parent_id || msg.id // AI消息的父ID
      if (!aiMessageGroups[parentId]) {
        aiMessageGroups[parentId] = []
      }
      aiMessageGroups[parentId].push(msg)
    }
  }

  // 日志记录：分组情况
  console.log('[FRONTEND] Group summary:')
  console.log('[FRONTEND] Total messages:', messages.value.length)
  console.log('[FRONTEND] User messages:', Object.keys(userMessages).length)
  console.log('[FRONTEND] AI message groups:', Object.keys(aiMessageGroups).length)
  for (const [parentId, msgs] of Object.entries(aiMessageGroups)) {
    console.log(`[FRONTEND] Group ${parentId}: ${msgs.length} AI messages`, msgs.map(m => ({id: m.id, parent_id: m.parent_id, role: m.role})))
  }

  console.log('[FRONTEND] Branch selection state:', JSON.stringify(currentBranchForMessage.value))
  
  let shownCount = 0;
  // 然后，为每个用户消息选择要显示的AI消息
  for (const [parentId, aiMessages] of Object.entries(aiMessageGroups)) {
    const branchKey = parentId // 分支键是父用户消息ID
    const selectedBranchId = currentBranchForMessage.value[branchKey]
    
    console.log(`[FRONTEND] Processing group ${parentId}:`)
    console.log(`[FRONTEND] - Branch key: ${branchKey}`)
    console.log(`[FRONTEND] - Selected branch ID: ${selectedBranchId}`)
    console.log(`[FRONTEND] - Available AI messages: ${aiMessages.length}`, aiMessages.map(m => m.id))
    
    let aiMessageToShow = null
    
    if (selectedBranchId) {
      // 如果有选中的分支，显示该分支的AI消息
      aiMessageToShow = aiMessages.find(m => m.id === selectedBranchId)
      console.log(`[FRONTEND] - Selected branch found: ${aiMessageToShow ? `YES (${aiMessageToShow.id})` : 'NO'}`)
    } else {
      console.log(`[FRONTEND] - No selected branch for this group`)
    }
    
    if (!aiMessageToShow && aiMessages.length > 0) {
      // 如果没有选中的分支或者未找到，显示最新的AI消息
      aiMessageToShow = aiMessages[aiMessages.length - 1]
      console.log(`[FRONTEND] - Showing latest AI message: ${aiMessageToShow.id}`)
      // 记住这是当前显示的分支
      currentBranchForMessage.value[branchKey] = aiMessageToShow.id
    }
    
    if (aiMessageToShow) {
      // 找到AI消息要插入的位置（在对应的用户消息之后）
      const userMsgIndex = result.findIndex(m => m.id === parentId)
      console.log(`[FRONTEND] - User message index: ${userMsgIndex}`)
      console.log(`[FRONTEND] - Showing AI message: ${aiMessageToShow.id} (parent_id: ${aiMessageToShow.parent_id})`)
      
      if (userMsgIndex !== -1) {
        result.splice(userMsgIndex + 1, 0, aiMessageToShow)
        shownCount++;
      } else {
        // 如果没有找到对应的用户消息，添加到末尾
        console.warn(`[FRONTEND] WARNING: No user message found for parentId ${parentId}, adding to end`)
        result.push(aiMessageToShow)
        shownCount++;
      }
    }
  }

  console.log(`[FRONTEND] ===== displayMessages END ===== Total shown: ${shownCount} AI messages`)
  console.log('[FRONTEND] Final display messages:', result.map(m => ({id: m.id, role: m.role, parent_id: m.parent_id})))
  return result
})

// 制品模式：从 query 中读取 artifact_type
const artifactType = computed(() => route.query.artifact_type as string | undefined)

// 加载对话详情
const loadDialog = async (id: string) => {
  if (!id) return
  await appStore.openDialog(id)
}

// 制品模式：保存 artifact_type 到本地变量（避免 router.replace 后丢失）
const savedArtifactType = ref<string | undefined>(undefined)

// 分支管理状态
const userHoveredMessageId = ref<string | null>(null) // 鼠标悬停的用户消息ID
const aiHoveredMessageId = ref<string | null>(null) // 鼠标悬停的AI消息ID
const editingMessageId = ref<string | null>(null) // 正在编辑的消息ID
const editingMessageContent = ref('') // 编辑中的消息内容
const branchHistory = ref<Record<string, MessageBranch[]>>({}) // 各消息的分支历史（以父用户消息ID为key）
const currentBranchForMessage = ref<Record<string, string>>({}) // 当前显示的分支ID（以父用户消息ID为key）

// HTML预览菜单状态
const htmlMenuOpen = ref<string | null>(null) // 当前打开的HTML预览菜单ID

/** 获取消息的分支键：对于AI消息返回其parent_id，对于用户消息返回自身ID */
const getBranchKey = (messageId: string): string => {
  const message = appStore.messages.find(m => m.id === messageId)
  if (!message) {
    console.log('[frontend] getBranchKey: message not found', messageId)
    return messageId
  }
  const branchKey = message.role === 'ai' && message.parent_id ? message.parent_id : messageId
  console.log('[frontend] getBranchKey:', messageId, 'role:', message.role, 'parent_id:', message.parent_id, 'branchKey:', branchKey)
  return branchKey
}

// 当鼠标悬停在AI消息上时，预加载分支数据
watch(aiHoveredMessageId, async (newMessageId) => {
  if (newMessageId) {
    // 预加载分支数据，以便分支切换按钮可以显示
    await getMessageBranches(newMessageId)
  }
})

// 如果URL有query参数 msg 或 artifact_type，自动发送
watch(dialogId, async (newId) => {
  isEditingTitle.value = false
  isRenamingTitle.value = false
  editableTitle.value = ''

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
      // 激活制品向导，等待用户完成所有选择后再生成制品
      if (!choiceWizard.active) {
        choiceWizard.active = true
        resetWizardProgress()
        console.log(`[WIZARD] Activating choice wizard for artifact type=${savedArtifactType.value}`)
      }
      const typeLabel: Record<string, string> = {
        web: '应用与网站',
        doc: '文档和模板',
        game: '游戏',
        tool: '效率工具',
        creative: '创意项目',
        survey: '问卷或调查',
        code: '从零开始'
      }
      // 引导消息：请求AI引导用户完成选择，而不是直接生成制品
      const guideMsg = `我想创建一个「${typeLabel[savedArtifactType.value] || savedArtifactType.value}」类型的制品。请先引导我完成一些选择，在所有选择完成后，再生成完整的制品代码。请将所有 HTML、CSS、JavaScript 代码全部写在同一个文件中输出，不要拆分成多个文件，以便直接预览和运行最终效果。`
      console.log(`[ARTIFACT] Creating NEW dialog for artifact type=${savedArtifactType.value}, activating wizard`)
      try {
        const res = await appStore.createDialog()
        if (res?.id && res.id !== newId) {
          // 新会话创建成功，跳转到新会话 URL（携带消息触发自动发送）
          router.replace({ path: `/chat/${res.id}`, query: { msg: guideMsg } })
          return
        }
      } catch (e) {
        console.error('[ARTIFACT] Failed to create new dialog, falling back to current', e)
      }
      // 创建失败时的降级方案：在当前会话中发送
      messageInput.value = guideMsg
      setTimeout(() => handleSend(), 300)
      router.replace({ path: `/chat/${newId}` })
    }
  }
}, { immediate: true })

watch(() => dialogDetail.value?.title, (title) => {
  if (!isEditingTitle.value) {
    editableTitle.value = title || ''
  }
})

const startTitleRename = async () => {
  if (!canRenameCurrentDialog.value || isRenamingTitle.value) return

  editableTitle.value = dialogDetail.value?.title || ''
  isEditingTitle.value = true
  await nextTick()
  titleInputRef.value?.focus()
  titleInputRef.value?.select()
}

const cancelTitleRename = () => {
  isEditingTitle.value = false
  isRenamingTitle.value = false
  editableTitle.value = dialogDetail.value?.title || ''
}

const submitTitleRename = async () => {
  const id = dialogId.value
  const currentTitle = dialogDetail.value?.title || ''
  const nextTitle = editableTitle.value.trim()

  if (!id || !dialogDetail.value) {
    cancelTitleRename()
    return
  }

  if (!nextTitle) {
    cancelTitleRename()
    return
  }

  if (nextTitle === currentTitle) {
    isEditingTitle.value = false
    return
  }

  isRenamingTitle.value = true
  const renamed = await appStore.renameDialog(id, nextTitle)

  if (renamed) {
    editableTitle.value = nextTitle
    isEditingTitle.value = false
  } else {
    editableTitle.value = currentTitle
    await nextTick()
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  }

  isRenamingTitle.value = false
}

const handleTitleInputBlur = async () => {
  if (!isEditingTitle.value || isRenamingTitle.value) return
  await submitTitleRename()
}

const handleTitleClick = async () => {
  if (canRenameCurrentDialog.value) {
    await startTitleRename()
    return
  }

  if (!dialogId.value || messages.value.length === 0) {
    router.push('/chats')
  }
}

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

  const lastAiMsg = [...displayMessages.value].reverse().find(m => m.role === 'ai')
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

  const sections = []
  
  // 添加制品类型信息
  const artifactTypeValue = savedArtifactType.value || artifactType.value
  if (artifactTypeValue) {
    const typeLabel: Record<string, string> = {
      web: '应用与网站',
      doc: '文档和模板',
      game: '游戏',
      tool: '效率工具',
      creative: '创意项目',
      survey: '问卷或调查',
      code: '从零开始'
    }
    sections.push(`我要创建的是「${typeLabel[artifactTypeValue] || artifactTypeValue}」类型的制品。`)
  }
  
  sections.push('请基于我刚才提出的制品需求，结合下面已经确认的信息生成最终结果。')

  if (confirmedAnswers.length > 0) {
    sections.push(`已确认选项：\n${confirmedAnswers.join('\n')}`)
  }

  if (unspecifiedQuestions.length > 0) {
    sections.push(`以下项目未指定，请你自行做出合理、专业的默认决策：\n${unspecifiedQuestions.join('\n')}`)
  }

  sections.push('重要要求：请将所有 HTML、CSS、JavaScript 全部写在同一个文件中输出，不要拆分成多个文件，以便直接预览和运行最终效果。')

  return sections.join('\n\n')
}

const detectAndActivateWizard = (aiContent: string): void => {
  // 检测用户的首次请求是否为制品类型请求
  // 只有当用户明确选择创建制品（通过artifact_type查询参数）时才激活向导
  const isArtifactRequest = Boolean(artifactType.value) || Boolean(savedArtifactType.value)

  // 如果用户请求是制品类型，激活向导（不要求AI回复内容长度，因为可能已经激活）
  // 注意：每次新的制品类请求都应重新激活向导（支持用户在完成一轮后发起新的制品请求）
  if (isArtifactRequest && !choiceWizard.active) {
    // 如果向导已完成但用户又发起了全新的制品请求，重置向导状态
    if (choiceWizard.completed) {
      console.log(`[WIZARD] Previous wizard was completed. Resetting for new artifact request.`)
    }
    console.log(`[WIZARD] Activating choice wizard. Artifact type detected from query.`)
    choiceWizard.active = true
    resetWizardProgress()
  }
}

/** 从 AI 回复内容中自动提取代码块/HTML，注入 [ARTIFACT] 标签以生成可预览卡片 */
const autoInjectArtifact = (content: string, artifactTypeHint?: string): { content: string; injected: boolean } => {
  // 已经包含 [ARTIFACT] 标签的不再处理
  if (/\[ARTIFACT\]/.test(content)) {
    return { content, injected: false }
  }

  let extractedTitle = '生成的制品'
  let extractedContent = ''
  let extractedType = artifactTypeHint || 'code'
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

    const langMatch = bestMatch.match(/```(\w+)\s*\n([\s\S]*?)```/)
    if (langMatch) {
      const extractedLang = langMatch[1]
      // 使用统一的清理函数
      extractedContent = cleanHtmlContent(langMatch[2])
      
      // 如果制品类型提示是web，保持为web；否则使用提取的语言
      // 但如果是vue、react等特定类型，使用提取的语言
      if (artifactTypeHint === 'web' && (extractedLang === 'html' || extractedLang === 'css' || extractedLang === 'javascript')) {
        // 保持web类型，不修改
      } else {
        extractedType = extractedLang
      }
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
  if (!extractedContent) {
    // 检查完整HTML文档
    if (/<(html|!DOCTYPE)\b/i.test(content)) {
      // 提取从 <!DOCTYPE 或 <html 开始到结尾的内容
      const htmlMatch = content.match(/(<!DOCTYPE[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i)
      if (htmlMatch) {
        extractedType = 'html'
        extractedContent = htmlMatch[1].trim()
      }
    }
    // 检查HTML片段（包含HTML标签但没有完整文档结构）
    else if (/<[^>]+>/.test(content)) {
      // 尝试提取HTML片段（从第一个标签开始到最后一个标签结束）
      const htmlTagMatch = content.match(/<[^>]+>/)
      if (htmlTagMatch) {
        const startIndex = content.indexOf(htmlTagMatch[0])
        // 向后查找完整片段（到下一个代码块或结尾）
        let endIndex = content.length
        const codeBlockEnd = content.indexOf('```', startIndex)
        if (codeBlockEnd !== -1 && codeBlockEnd < endIndex) {
          endIndex = codeBlockEnd
        }
        const htmlFragment = content.substring(startIndex, endIndex)
        const cleanedFragment = cleanHtmlContent(htmlFragment)
        if (cleanedFragment.length >= 50) {
          extractedType = 'html'
          extractedContent = cleanedFragment
        }
      }
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
  
  // 从渲染内容中移除 HTML 预览标记
  let html = content.replace(/\[HTML_PREVIEW\][\s\S]*?\[\/HTML_PREVIEW\]/g, '')
  
  html = html
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

  // 渲染 Markdown 表格（必须在代码块处理之前，避免表格内容被错误处理）
  html = renderMarkdownTable(html)

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

/** 渲染 Markdown 表格为美观的 HTML 表格 */
const renderMarkdownTable = (html: string): string => {
  // 按行分割，先找到所有可能的表格区域
  const lines = html.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // 检查是否是表格行（以 | 开头和结尾，或包含多个 |）
    const isTableRow = (l: string) => l.startsWith('|') || (l.includes('|') && l.split('|').length >= 2)

    // 检查是否是分隔行（如 |---|---|）
    const isSeparatorRow = (l: string) => /^[\|\s\-:]+$/.test(l.replace(/\|/g, '-').replace(/\s/g, ''))

    if (isTableRow(line) && !isSeparatorRow(line)) {
      // 收集整个表格
      const tableLines: string[] = []
      while (i < lines.length && (isTableRow(lines[i].trim()) || isSeparatorRow(lines[i].trim()))) {
        const trimmedLine = lines[i].trim()
        // 跳过分隔行（|---|格式）
        if (!isSeparatorRow(trimmedLine)) {
          tableLines.push(trimmedLine)
        }
        i++
      }

      // 解析表格
      const tableHtml = buildTableHtml(tableLines)
      result.push(tableHtml)
    } else {
      result.push(lines[i])
      i++
    }
  }

  return result.join('\n')
}

/** 从表格行构建 HTML 表格 */
const buildTableHtml = (tableLines: string[]): string => {
  if (tableLines.length === 0) return ''

  // 解析所有行
  const allRows = tableLines.map(line => {
    return line.split('|').map(cell => cell.trim()).filter((_, idx) => idx > 0 && idx < line.split('|').length - 1)
  })

  // 第一行是表头，其余是数据
  const headers = allRows[0] || []
  const dataRows = allRows.slice(1)

  let tableHtml = '<div class="table-wrapper my-4 overflow-x-auto rounded-lg border border-[#e5e5e4] dark:border-white/10">'
  tableHtml += '<table class="w-full border-collapse text-[14px]">'

  // 表头
  tableHtml += '<thead><tr class="bg-[#f9f8f5] dark:bg-[#2a2a2a]">'
  headers.forEach((header: string, idx: number) => {
    const isFirst = idx === 0
    const isLast = idx === headers.length - 1
    tableHtml += `<th class="px-4 py-3 text-left font-semibold text-[#1a1a1a] dark:text-white border-b border-r border-[#e5e5e4] dark:border-white/10 ${isFirst ? 'rounded-tl-lg' : ''} ${isLast ? 'rounded-tr-lg border-r-0' : ''}">${header}</th>`
  })
  tableHtml += '</tr></thead>'

  // 表体
  tableHtml += '<tbody>'
  dataRows.forEach((row: string[], rowIndex: number) => {
    const isEven = rowIndex % 2 === 0
    tableHtml += `<tr class="${isEven ? 'bg-white dark:bg-[#1f1f1e]' : 'bg-[#fafaf8] dark:bg-[#252524]'} hover:bg-[#fef8f5] dark:hover:bg-[#2c2c2a] transition-colors">`
    row.forEach((cell: string, cellIndex: number) => {
      const isLast = cellIndex === row.length - 1
      tableHtml += `<td class="px-4 py-2.5 text-[#3d3d3c] dark:text-gray-300 border-b border-r border-[#f0ede7] dark:border-white/5 ${isLast ? 'border-r-0' : ''}">${cell}</td>`
    })
    tableHtml += '</tr>'
  })
  tableHtml += '</tbody>'

  tableHtml += '</table>'
  tableHtml += '</div>'

  return tableHtml
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
  const aiMessages = displayMessages.value.filter(m => m.role === 'ai')
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

/** 从消息内容中提取 HTML 预览内容 [HTML_PREVIEW]...[/HTML_PREVIEW] */
const getHtmlPreview = (content: string): string | null => {
  // 匹配 [HTML_PREVIEW] 标签
  const match = content.match(/\[HTML_PREVIEW\]([\s\S]*?)\[\/HTML_PREVIEW\]/)
  if (match) {
    const htmlContent = match[1].trim()
    console.log('[FRONTEND] getHtmlPreview: found HTML content, length:', htmlContent.length)
    // 检查是否是有效的HTML内容
    if (htmlContent.length < 10 || !/<[^>]+>/.test(htmlContent)) {
      console.log('[FRONTEND] getHtmlPreview: invalid HTML content, too short or no HTML tags')
      // 返回一个占位符内容，而不是无效的HTML
      return '<div style="height: 100px; background: #f9f8f5; display: flex; align-items: center; justify-content: center; color: #666; font-family: sans-serif;">HTML内容正在生成中...</div>'
    }
    return htmlContent
  }
  return null
}

/** 获取消息的 HTML 预览内容，优先使用数据库中的 html_preview 字段 */
const getMessageHtmlPreview = (msg: any): string | null => {
  // 优先使用数据库中的 html_preview 字段
  if (msg.html_preview && msg.html_preview.trim().length > 0) {
    console.log('[FRONTEND] getMessageHtmlPreview: using html_preview field, length:', msg.html_preview.length)
    return msg.html_preview.trim()
  }
  
  // 回退到从 content 字段中提取
  return getHtmlPreview(msg.content)
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
  
  // 对于web和html类型的制品，总是允许预览（即使内容没有HTML标签，wrapWithProgressiveRender会包装它）
  if (type === 'web' || type === 'html') return true
  
  // 包含 html 标签的内容也可以预览
  const hasHtmlTag = /<(html|head|body|div|p|h[1-6]|section|nav|footer|header|span|a|button|img|ul|ol|li|table|tr|td|th|form|input|textarea|select|label|script|style|link|meta)\b/i.test(artifact.content)
  
  // 检查是否包含HTML/XML结构（包含尖括号）
  const hasHtmlStructure = /<[^>]+>/.test(artifact.content)
  
  return previewableTypes.includes(type) || hasHtmlTag || hasHtmlStructure
}

/** 清理HTML内容，移除多余空白和格式问题 */
const cleanHtmlContent = (content: string): string => {
  if (!content) {
    console.log('[FRONTEND] cleanHtmlContent: input is empty')
    return ''
  }
  
  console.log('[FRONTEND] cleanHtmlContent === START ===')
  console.log('[FRONTEND] Input content length:', content.length)
  console.log('[FRONTEND] Input first 300 chars:', content.substring(0, 300))
  
  let cleaned = content
  
  // 1. 移除代码块标记 ```html ... ``` 或 ```css ... ``` 等
  // 支持多行代码块，处理各种变体
  const codeBlockRegex = /```\s*(\w+)?\s*\n([\s\S]*?)```/gi
  let codeBlockMatch
  let extractedContent = ''
  let maxLength = 0
  let codeBlockCount = 0
  
  // 查找所有代码块，取最大的一个
  // 重置正则表达式 lastIndex
  codeBlockRegex.lastIndex = 0
  while ((codeBlockMatch = codeBlockRegex.exec(cleaned)) !== null) {
    codeBlockCount++
    const language = codeBlockMatch[1] || 'unknown'
    const blockContent = codeBlockMatch[2]
    console.log(`[FRONTEND] Found code block #${codeBlockCount}, language: "${language}", content length: ${blockContent.length}`)
    console.log(`[FRONTEND] Code block content first 100 chars:`, blockContent.substring(0, 100))
    if (blockContent.length > maxLength) {
      maxLength = blockContent.length
      extractedContent = blockContent
    }
  }
  
  console.log(`[FRONTEND] Total code blocks found: ${codeBlockCount}, max length: ${maxLength}`)
  
  if (extractedContent) {
    cleaned = extractedContent
    console.log('[FRONTEND] Extracted HTML from code block, cleaned length:', cleaned.length)
    console.log('[FRONTEND] Extracted content first 200 chars:', cleaned.substring(0, 200))
  } else {
    console.log('[FRONTEND] No code blocks found, using original content')
  }
  
  // 2. 移除多余的空行（连续两个以上换行符减少为一个）
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n')
  
  // 3. 移除每行开头和结尾的空白，但保留内容内部的缩进
  // 对于HTML内容，我们不想移除所有缩进，只移除行首和行尾的空白
  // 但要注意：某些HTML元素（如<pre>、<code>）需要保留内部格式
  if (!cleaned.includes('<pre') && !cleaned.includes('<code') && !cleaned.includes('<textarea')) {
    // 只有不包含特定标签时才进行行级清理
    cleaned = cleaned.split('\n').map(line => {
      // 保留HTML标签内的缩进，但移除行首和行尾的空白
      return line.trim()
    }).join('\n')
  }
  
  // 4. 移除开头的空行
  cleaned = cleaned.replace(/^\s*\n+/, '')
  
  // 5. 移除结尾的空行
  cleaned = cleaned.replace(/\n+\s*$/, '')
  
  // 6. 整体去除首尾空白
  cleaned = cleaned.trim()
  
  // 7. 检查是否还包含代码块标记
  const stillHasCodeBlockMarkers = /```/.test(cleaned)
  if (stillHasCodeBlockMarkers) {
    console.warn('[FRONTEND] WARNING: Cleaned content still contains code block markers (```)')
    // 尝试更激进的清理：移除所有 ``` 标记
    cleaned = cleaned.replace(/```/g, '')
    console.log('[FRONTEND] Removed remaining code block markers')
  }
  
  console.log('[FRONTEND] Final cleaned content length:', cleaned.length)
  console.log('[FRONTEND] Final cleaned content first 300 chars:', cleaned.substring(0, 300))
  console.log('[FRONTEND] Has HTML tags:', /<[^>]+>/.test(cleaned))
  console.log('[FRONTEND] Has DOCTYPE:', /<!DOCTYPE/i.test(cleaned))
  console.log('[FRONTEND] cleanHtmlContent === END ===')
  
  return cleaned
}

/** 渐进式渲染包装器：将 HTML 内容包装成带有渐进式渲染效果的页面 */
const wrapWithProgressiveRender = (content: string): string => {
  console.log('[FRONTEND] wrapWithProgressiveRender: Starting, content length:', content.length)
  
  // 检查是否为分块内容（可能是不完整的HTML）
  const isChunkedContent = content.length < 500 || !/(<html|<body|<head|<div>)/i.test(content)
  if (isChunkedContent) {
    console.log('[FRONTEND] wrapWithProgressiveRender: Detected chunked content, length:', content.length)
  }
  
  // 先清理内容
  const cleanedContent = cleanHtmlContent(content)
  
  // 检查是否为空或无效的HTML片段
  if (!cleanedContent || cleanedContent.trim().length < 10) {
    console.log('[FRONTEND] wrapWithProgressiveRender: Empty or invalid HTML content, returning empty')
    return '<div style="height: 100px; background: #f9f8f5; display: flex; align-items: center; justify-content: center; color: #666; font-family: sans-serif;">HTML预览内容尚未准备好...</div>'
  }
  
  // 检查是否已经包含完整的 HTML 文档结构
  const hasDoctype = /<!DOCTYPE\s+html>/i.test(cleanedContent)
  const hasHtmlTag = /<html[^>]*>/i.test(cleanedContent)
  const hasHead = /<head[^>]*>/i.test(cleanedContent)
  const hasBody = /<body[^>]*>/i.test(cleanedContent)

  // 渐进式渲染脚本 - 修复版
  const progressiveScript = `
<script>
(function() {
  // 配置 - 更快、更稳定的渲染效果
  const STAGGER_DELAY = 150; // 每个元素之间的延迟(ms) - 更快，减少等待
  const FADE_DURATION = 500; // 淡入持续时间(ms) - 缩短
  const INITIAL_DELAY = 50;  // 初始延迟 - 缩短
  
  // 防止重复执行 - 但允许最终渲染
  if (window.__progressiveRenderExecuted && !window.__finalRenderTriggered) return;
  
  // 标记是否已经执行过初始渲染
  if (!window.__progressiveRenderExecuted) {
    window.__progressiveRenderExecuted = true;
  }
  
  // 最终渲染标志
  const isFinalRender = window.__finalRenderTriggered || false;
  
  // 1. 立即设置页面可见，避免白色闪烁
  document.body.style.opacity = '1';
  document.body.style.visibility = 'visible';
  document.body.style.transition = 'opacity 0.3s ease';
  
  // 如果是最终渲染，重置所有元素的样式状态
  if (isFinalRender) {
    // 移除所有渐进式渲染的样式，让元素回归自然状态
    const allStyledElements = document.querySelectorAll('*[style*="opacity"]');
    allStyledElements.forEach(el => {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.transition = '';
      el.style.transitionDelay = '';
    });
    
    // 重新应用所有CSS样式
    setTimeout(() => {
      // 触发样式重新计算
      document.body.classList.add('final-render');
      
      // 重新执行所有内联脚本
      const scripts = document.querySelectorAll('script:not([src])');
      scripts.forEach(script => {
        try {
          eval(script.textContent);
        } catch (e) {
          console.log('Script execution error:', e);
        }
      });
      
      // 触发CSS样式重新应用
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.href;
        link.href = '';
        link.href = href;
      });
      
      // 重新计算样式
      document.body.offsetHeight;
    }, 100);
  }
  
  // 2. 获取所有需要渐进式渲染的元素
  const allElements = Array.from(document.querySelectorAll('body *:not(script):not(style):not(link):not(meta):not(title)'));
  
  // 按类型和深度分组渲染
  const groupedElements = {
    structural: [], // 结构性元素：div, section, article, main, header, footer, nav
    content: [],    // 内容元素：p, h1-h6, span, a
    media: [],      // 媒体元素：img, video, iframe
    form: [],       // 表单元素：input, button, form, textarea, select
    list: [],       // 列表元素：ul, ol, li
    table: []       // 表格元素：table, tr, td, th
  };
  
  // 分类元素
  allElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    
    if (['div', 'section', 'article', 'main', 'header', 'footer', 'nav'].includes(tagName)) {
      groupedElements.structural.push(el);
    } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a'].includes(tagName)) {
      groupedElements.content.push(el);
    } else if (['img', 'video', 'iframe'].includes(tagName)) {
      groupedElements.media.push(el);
    } else if (['input', 'button', 'form', 'textarea', 'select', 'label'].includes(tagName)) {
      groupedElements.form.push(el);
    } else if (['ul', 'ol', 'li'].includes(tagName)) {
      groupedElements.list.push(el);
    } else if (['table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'].includes(tagName)) {
      groupedElements.table.push(el);
    } else {
      groupedElements.structural.push(el); // 默认归为结构性元素
    }
  });
  
  // 按深度排序每个组
  const sortByDepth = (elements) => {
    return elements.map(el => {
      let depth = 0;
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        depth++;
        parent = parent.parentElement;
      }
      return { el, depth };
    }).sort((a, b) => a.depth - b.depth).map(item => item.el);
  };
  
  // 分组排序
  Object.keys(groupedElements).forEach(key => {
    groupedElements[key] = sortByDepth(groupedElements[key]);
  });
  
  // 设置初始状态 - 分阶段
  let elementIndex = 0;
  
  // 阶段1: 结构性元素（框架）
  groupedElements.structural.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px) scale(1)'; // 减少移动距离
    el.style.transition = \`opacity \${FADE_DURATION}ms ease, transform \${FADE_DURATION}ms ease\`;
    el.style.transitionDelay = \`\${INITIAL_DELAY + index * (STAGGER_DELAY * 0.5)}ms\`; // 结构性元素更快
  });
  
  // 阶段2: 内容元素
  groupedElements.content.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition = \`opacity \${FADE_DURATION}ms ease, transform \${FADE_DURATION}ms ease\`;
    el.style.transitionDelay = \`\${INITIAL_DELAY + 100 + index * STAGGER_DELAY}ms\`;
  });
  
  // 阶段3: 其他元素
  const otherElements = [
    ...groupedElements.media,
    ...groupedElements.form,
    ...groupedElements.list,
    ...groupedElements.table
  ];
  
  otherElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = \`opacity \${FADE_DURATION}ms ease, transform \${FADE_DURATION}ms ease\`;
    el.style.transitionDelay = \`\${INITIAL_DELAY + 200 + index * STAGGER_DELAY}ms\`;
  });
  
  // 滚动条回顶部
  window.scrollTo(0, 0);
  
  // 分阶段开始动画
  setTimeout(() => {
    // 阶段1: 结构性元素
    groupedElements.structural.forEach((el, index) => {
      setTimeout(() => {
        el.offsetHeight; // 强制重排
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) scale(1)';
      }, index * (STAGGER_DELAY * 0.5));
    });
    
    // 阶段2: 内容元素（延迟100ms开始）
    setTimeout(() => {
      groupedElements.content.forEach((el, index) => {
        setTimeout(() => {
          el.offsetHeight;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * STAGGER_DELAY);
      });
    }, 100);
    
    // 阶段3: 其他元素（延迟200ms开始）
    setTimeout(() => {
      otherElements.forEach((el, index) => {
        setTimeout(() => {
          el.offsetHeight;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * STAGGER_DELAY);
      });
    }, 200);
    
  }, INITIAL_DELAY);
  
  // 懒加载图片
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }
})();

// 全局函数：触发最终渲染
window.triggerFinalRender = function() {
  window.__finalRenderTriggered = true;
  
  // 移除所有渐进式渲染的样式
  const allStyledElements = document.querySelectorAll('*[style*="opacity"]');
  allStyledElements.forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
    el.style.transitionDelay = '';
  });
  
  // 重新执行所有内联脚本
  const scripts = document.querySelectorAll('script:not([src])');
  scripts.forEach(script => {
    try {
      eval(script.textContent);
    } catch (e) {
      console.log('Script execution error:', e);
    }
  });
  
  // 重新加载样式
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.href;
    link.href = '';
    link.href = href;
  });
  
  // 强制重新计算样式
  document.body.offsetHeight;
  
  console.log('Final render triggered and completed');
};

// 页面加载后自动触发最终渲染
setTimeout(() => {
  console.log('Auto triggering final render after page load...');
  
  // 移除所有渐进式渲染的样式
  const allStyledElements = document.querySelectorAll('*[style*="opacity"]');
  allStyledElements.forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
    el.style.transitionDelay = '';
  });
  
  // 重新执行所有内联脚本
  const scripts = document.querySelectorAll('script:not([src])');
  scripts.forEach(script => {
    try {
      eval(script.textContent);
    } catch (e) {
      console.log('Script execution error:', e);
    }
  });
  
  // 重新加载样式
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.href;
    link.href = '';
    link.href = href;
  });
  
  // 强制重新计算样式
  document.body.offsetHeight;
  
  console.log('Final render auto-trigger completed');
}, 1000);
};
<\\/script>
<style>
/* 基础动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 预加载样式，避免闪烁 */
body {
  opacity: 1 !important;
  visibility: visible !important;
  animation: fadeIn 0.3s ease !important;
}

/* 确保内容在动画期间可见 */
.preview-content {
  opacity: 1 !important;
  min-height: 50px !important; /* 确保有最小高度，避免空白 */
}
<\\/style>`

  // 如果已经是完整 HTML 文档
  if (hasDoctype && hasHtmlTag) {
    // 注入到 </body> 之前
    if (hasBody) {
      return cleanedContent.replace(/<\/body>/i, `${progressiveScript}</body>`)
    }
    // 注入到 </html> 之前
    return cleanedContent.replace(/<\/html>/i, `${progressiveScript}</html>`)
  }

  // 如果只有 HTML 标签
  if (hasHtmlTag) {
    if (hasBody) {
      return cleanedContent.replace(/<\/body>/i, `${progressiveScript}</body>`)
    }
    // 没有 body，创建 body 并添加内容
    const bodyMatch = cleanedContent.match(/<html[^>]*>([\s\S]*)<\/html>/i)
    if (bodyMatch) {
      const innerContent = bodyMatch[1]
      const wrappedBody = `<body>${innerContent}${progressiveScript}</body>`
      return cleanedContent.replace(/<html[^>]*>[\s\S]*<\/html>/i, wrappedBody)
    }
  }

  // 纯内容片段，包装成完整页面
  // 检测内容类型：CSS、HTML 或纯文本
  const hasCssRules = /\{[^{}]*\}/.test(cleanedContent) && !/<[^>]+>/.test(cleanedContent)
  const hasHtmlTags = /<[^>]+>/.test(cleanedContent)
  
  let bodyContent = cleanedContent
  let extraCss = ''
  
  if (hasCssRules && !hasHtmlTags) {
    // 内容主要是 CSS 规则，将其放入 <style> 标签
    extraCss = cleanedContent
    bodyContent = '<div class="preview-content">CSS 样式已应用</div>'
    console.log('[FRONTEND] wrapWithProgressiveRender: CSS content detected, moving to style tag')
  } else if (isChunkedContent && !hasHtmlTags) {
    // 分块内容且没有HTML标签，可能是部分内容，直接包装
    console.log('[FRONTEND] wrapWithProgressiveRender: Chunked content detected, wrapping in div')
    bodyContent = `<div class="preview-content">${cleanedContent}</div>`
  }
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f9f8f5; /* 官网风格背景色 */
      padding: 0;
      margin: 0;
    }
    ${extraCss}
    .preview-content {
      padding: 0;
      background: white;
    }
    
    /* 让 iframe 内容自适应，不限制高度 */
    html, body {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
      min-height: auto !important;
      max-height: none !important;
      overflow: visible !important;
      overflow-y: auto !important;
    }
    
    /* 页面加载初始状态 - 避免白色闪烁 */
    body {
      opacity: 1 !important;
      visibility: visible !important;
      background: #f9f8f5 !important; /* 立即设置背景色 */
      transition: opacity 0.3s ease !important;
      min-height: 100px !important; /* 确保有最小高度 */
    }
    
    /* 确保所有元素使用 border-box */
    html, body, body * {
      box-sizing: border-box !important;
      max-width: 100% !important;
    }
    
    /* 允许滚动但不显示滚动条 */
    body {
      -webkit-overflow-scrolling: touch !important;
    }
    
    /* 隐藏所有滚动条 */
    ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    * {
      scrollbar-width: none !important;
    }
    
    /* 内容区域确保可见 */
    .preview-content {
      opacity: 1 !important;
      min-height: 50px !important;
      transition: opacity 0.5s ease !important;
    }
  </style>
</head>
<body>
${bodyContent}
${progressiveScript}
</body>
</html>`
  console.log('[FRONTEND] wrapWithProgressiveRender: Finished, returning wrapped HTML')
}

/** 获取制品预览内容（带渐进式渲染） */
const getArtifactPreviewContent = (artifact: ArtifactData | null): string => {
  if (!artifact) return ''
  return wrapWithProgressiveRender(artifact.content)
}

/** 打开右侧制品面板 */
const openArtifactPanel = (artifact: ArtifactData) => {
  currentArtifact.value = artifact
  showArtifactPanel.value = true
  
  // 强制可预览的制品显示预览模式，确保用户看到渲染效果而不是代码
  if (isPreviewable(artifact)) {
    artifactViewMode.value = 'preview'
  } else {
    artifactViewMode.value = 'code'
  }
  
  scrollToBottom()
}

/** 关闭制品面板 */
const closeArtifactPanel = () => {
  showArtifactPanel.value = false
  currentArtifact.value = null
}

/** 在新标签页中打开 HTML 内容 */
const openHtmlInNewTab = (htmlContent: string) => {
  const blob = new Blob([wrapWithProgressiveRender(htmlContent)], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  URL.revokeObjectURL(url)
}

/** 复制 HTML 内容到剪贴板 */
const copyHtmlContent = async (htmlContent: string) => {
  try {
    // 关闭菜单（如果存在）
    htmlMenuOpen.value = null
    
    const cleanedContent = cleanHtmlContent(htmlContent)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(cleanedContent)
      console.log('[FRONTEND] HTML content copied to clipboard, length:', cleanedContent.length)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = cleanedContent
      textArea.style.position = 'fixed'
      textArea.style.top = '-9999px'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      console.log('[FRONTEND] HTML content copied via execCommand, length:', cleanedContent.length)
    }
  } catch (err) {
    console.error('[FRONTEND] Failed to copy HTML content:', err)
  }
}

/** 清理制品内容，移除多余的空白和代码块标记 */
const cleanArtifactContent = (content: string): string => {
  return cleanHtmlContent(content)
}

/** 复制制品代码 */
const handleCopyArtifactCode = async () => {
  if (!currentArtifact.value?.content) {
    console.log('[FRONTEND] Copy failed: no current artifact content')
    return
  }
  try {
    console.log('[FRONTEND] === Copy Artifact Debug Start ===')
    console.log('[FRONTEND] Original artifact content length:', currentArtifact.value.content.length)
    console.log('[FRONTEND] Original artifact content type:', currentArtifact.value.type)
    console.log('[FRONTEND] Original artifact content (first 300 chars):', currentArtifact.value.content.substring(0, 300))
    
    const cleanedContent = cleanArtifactContent(currentArtifact.value.content)
    console.log('[FRONTEND] Cleaned content length:', cleanedContent.length)
    console.log('[FRONTEND] Cleaned content (first 300 chars):', cleanedContent.substring(0, 300))
    
    if (!cleanedContent) {
      console.log('[FRONTEND] Cleaned content is empty, skipping copy')
      return
    }
    
    // 验证内容是否包含HTML标签
    const hasHtmlTags = /<[^>]+>/.test(cleanedContent)
    const hasCodeBlockMarkers = /```/.test(cleanedContent)
    console.log('[FRONTEND] Cleaned content analysis - hasHtmlTags:', hasHtmlTags, 'hasCodeBlockMarkers:', hasCodeBlockMarkers)
    
    // 现代剪贴板 API (需要安全上下文)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      console.log('[FRONTEND] Using modern clipboard API')
      await navigator.clipboard.writeText(cleanedContent)
      console.log('[FRONTEND] Clipboard write successful')
    } else {
      // 回退到传统 document.execCommand 方法
      console.log('[FRONTEND] Using fallback execCommand')
      const textArea = document.createElement('textarea')
      textArea.value = cleanedContent
      textArea.style.position = 'fixed'  // 避免滚动到元素
      textArea.style.top = '-9999px'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (!success) {
        throw new Error('复制失败：无法访问剪贴板')
      }
      console.log('[FRONTEND] execCommand copy successful')
    }
    console.log('[FRONTEND] === Copy Artifact Debug End ===')
    // TODO: toast "已复制"
  } catch (err) {
    console.error('[FRONTEND] 复制失败:', err)
    // TODO: toast "复制失败"
  }
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
    // 在向导完成前不传递 artifact_type 给 API，避免AI提前生成制品
    const artifactTypeForApi = (choiceWizard.active && !choiceWizard.completed) ? undefined : effectiveArtifactType
    const shouldBufferArtifactStream = Boolean(
      effectiveArtifactType ||
      savedArtifactType.value ||
      artifactType.value ||
      choiceWizard.completed
    )

    console.log(`[FRONTEND] calling dialogApi.sendMessageStream(${id}, ...), files:`, fileIds, 'artifact_type:', artifactTypeForApi)
    const stream = dialogApi.sendMessageStream(id, apiContent, fileIds, artifactTypeForApi, abortController.signal)

    console.log(`[FRONTEND] stream object created, type: ${typeof stream}`)

    let eventCount = 0
    const startTime = performance.now()
    let bufferedArtifactContent = ''
    // 找到临时消息的引用，用于流式更新
    let tempMsg = appStore.messages.find(m => m.id === tempAiMsgId)
    for await (const event of stream) {
      eventCount++
      const elapsedMs = Math.round(performance.now() - startTime)
      console.log(`[FRONTEND] event #${eventCount} at +${elapsedMs}ms:`, JSON.stringify(event)?.substring(0, 200))

      if (event.type === 'chunk') {
        if (shouldBufferArtifactStream) {
          bufferedArtifactContent += event.text
          streamingContent.value = ''
          scrollToBottom()
          continue
        }
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
        // 如果有累积的 HTML 块，组合成完整 HTML 并更新预览
        if (tempMsg && (tempMsg as any)._htmlChunks && (tempMsg as any)._htmlChunks.length > 0) {
          const chunks = (tempMsg as any)._htmlChunks
          const combinedHtml = chunks.join('\n')
          
          // 检查累积的HTML是否有效
          const hasValidHtmlStructure = /<[^>]+>/.test(combinedHtml) && 
            (combinedHtml.includes('<div') || combinedHtml.includes('<p') || 
             combinedHtml.includes('<h') || combinedHtml.includes('<body') ||
             combinedHtml.includes('<html') || combinedHtml.length > 500)
          
          if (hasValidHtmlStructure) {
            // 移除之前的 HTML_PREVIEW 标记
            const htmlPreviewRegex = /(\n\n\[HTML_PREVIEW\][\s\S]*?\[\/HTML_PREVIEW\])/g
            tempMsg.content = tempMsg.content.replace(htmlPreviewRegex, '')
            // 添加新的预览
            const htmlPreview = `\n\n[HTML_PREVIEW]\n${combinedHtml}\n[/HTML_PREVIEW]`
            tempMsg.content += htmlPreview
            console.log(`[FRONTEND] Finalized HTML preview with ${chunks.length} chunks after DONE event`)
          } else {
            console.log(`[FRONTEND] Skipping final preview - invalid HTML structure: length=${combinedHtml.length}`)
          }
          // 清空累积块
          (tempMsg as any)._htmlChunks = []
        }
        // 流式完成，刷新对话列表（不调用 openDialog 避免清空消息）
        await appStore.fetchDialogList()
        // 不要 break，继续处理后续事件（如 HTML render 事件可能跟在 done 之后）
        continue
      } else if (event.type === 'render') {
        console.log(`[FRONTEND] received RENDER event, html content length: ${event.html?.length}, chunk: ${event.chunk}`)
        console.log(`[FRONTEND] RENDER event html sample:`, event.html?.substring(0, 200))
        // 直接在内嵌消息中显示 HTML 预览（仅当不在制品模式下）
        if (event.html && !artifactType.value && !savedArtifactType.value && tempMsg) {
          console.log(`[FRONTEND] Processing render event for inline preview, artifactType: ${artifactType.value}, savedArtifactType: ${savedArtifactType.value}`)
          // 清理 HTML 内容
          const cleanedHtml = cleanHtmlContent(event.html as string)
          console.log(`[FRONTEND] cleanHtmlContent result length: ${cleanedHtml?.length}, sample:`, cleanedHtml?.substring(0, 200))
          if (!cleanedHtml || cleanedHtml.trim().length < 10) {
            console.log(`[FRONTEND] cleanHtmlContent returned empty or invalid HTML (length: ${cleanedHtml?.length}), skipping`)
            continue
          }
          
          // 初始化 HTML 块累积器
          if (!(tempMsg as any)._htmlChunks) {
            (tempMsg as any)._htmlChunks = []
          }
          
            if (event.chunk) {
              // 分块模式：累积 HTML 片段
              (tempMsg as any)._htmlChunks.push(cleanedHtml)
              console.log(`[FRONTEND] Added HTML chunk, total chunks: ${(tempMsg as any)._htmlChunks.length}`)
              
              // 优化分块渲染策略：减少iframe刷新次数，避免CSS闪烁
              const chunks = (tempMsg as any)._htmlChunks
              const chunkSize = chunks.length
              const chunkContentLength = chunks.join('\n').length
              
              // 策略：
              // 1. 第一个块：只有当包含有效HTML结构时才显示
              // 2. 小内容：累积到一定规模才更新
              // 3. 大内容：分批更新
              // 检查当前累积的内容是否包含有效的HTML结构
              const combinedHtml = chunks.join('\n')
              const hasValidHtmlStructure = /<[^>]+>/.test(combinedHtml) && 
                (combinedHtml.includes('<div') || combinedHtml.includes('<p') || 
                 combinedHtml.includes('<h') || combinedHtml.includes('<body') ||
                 combinedHtml.includes('<html') || combinedHtml.length > 500)
              
              // 只有当有有效HTML结构时才更新预览
              if (hasValidHtmlStructure && (chunkSize === 1 || chunkContentLength >= 500 || chunkSize % 3 === 0)) {
                // 移除之前的 HTML_PREVIEW 标记
                const htmlPreviewRegex = /(\n\n\[HTML_PREVIEW\][\s\S]*?\[\/HTML_PREVIEW\])/g
                tempMsg.content = tempMsg.content.replace(htmlPreviewRegex, '')
                // 添加新的预览
                const htmlPreview = `\n\n[HTML_PREVIEW]\n${combinedHtml}\n[/HTML_PREVIEW]`
                tempMsg.content += htmlPreview
                console.log(`[FRONTEND] Updated HTML preview with ${chunks.length} chunks, total content length: ${tempMsg.content.length}`)
              } else if (chunkSize > 10 || chunkContentLength > 5000) {
                // 强制更新：当块数太多或内容太长时
                const htmlPreviewRegex = /(\n\n\[HTML_PREVIEW\][\s\S]*?\[\/HTML_PREVIEW\])/g
                tempMsg.content = tempMsg.content.replace(htmlPreviewRegex, '')
                const htmlPreview = `\n\n[HTML_PREVIEW]\n${combinedHtml}\n[/HTML_PREVIEW]`
                tempMsg.content += htmlPreview
                console.log(`[FRONTEND] Forced update HTML preview at chunk ${chunkSize}, length ${chunkContentLength}`)
              } else {
                console.log(`[FRONTEND] Skipping preview update - waiting for more content: chunks=${chunkSize}, length=${chunkContentLength}, hasValidHtml=${hasValidHtmlStructure}`)
              }
              // 其他情况：继续累积，不更新预览（减少iframe刷新）
          } else {
            // 完整 HTML 模式：替换现有预览（如果存在）
            // 清除累积的块，因为完整 HTML 会替换它们
            (tempMsg as any)._htmlChunks = []
            // 移除之前的 HTML_PREVIEW 标记
            const htmlPreviewRegex = /(\n\n\[HTML_PREVIEW\][\s\S]*?\[\/HTML_PREVIEW\])/g
            tempMsg.content = tempMsg.content.replace(htmlPreviewRegex, '')
            // 添加新的预览
            const htmlPreview = `\n\n[HTML_PREVIEW]\n${cleanedHtml}\n[/HTML_PREVIEW]`
            tempMsg.content += htmlPreview
            console.log(`[FRONTEND] Replaced HTML preview with full HTML, total content length: ${tempMsg.content.length}`)
          }
          
          // 滚动到底部
          scrollToBottom()
        } else {
          console.log(`[FRONTEND] Render event skipped: html=${!!event.html}, artifactType=${artifactType.value}, savedArtifactType=${savedArtifactType.value}, tempMsg=${!!tempMsg}`)
        }
      } else if (event.type === 'error') {
        console.error(`[FRONTEND] received ERROR event:`, event.message)
        if (tempMsg) tempMsg.content = event.message || '抱歉，处理请求时出错。'
        break
      }
    }

    console.log(`[FRONTEND] for-await loop ended. total events received: ${eventCount}`)

    // ============ 流式完成后的向导检测 & 自动制品注入 ============
    const finalContent = shouldBufferArtifactStream ? bufferedArtifactContent : (tempMsg?.content || '')
    const shouldAttemptArtifactInjection = Boolean(
      effectiveArtifactType ||
      savedArtifactType.value ||
      artifactType.value ||
      choiceWizard.active ||
      choiceWizard.completed
    )

    if (tempMsg && shouldAttemptArtifactInjection && !/\[ARTIFACT\]/.test(finalContent)) {
      const injectedArtifact = autoInjectArtifact(finalContent, effectiveArtifactType)
      if (injectedArtifact.injected) {
        tempMsg.content = injectedArtifact.content
        console.log('[ARTIFACT] Injected artifact into final AI message for card/preview rendering.')
      } else if (shouldBufferArtifactStream) {
        tempMsg.content = finalContent
      }
    } else if (tempMsg && shouldBufferArtifactStream && !tempMsg.content) {
      tempMsg.content = finalContent
    }

    // 制品自动注入已禁用：只在 AI 回复明确包含 [ARTIFACT] 标签或对话指定了 artifact_type 时才触发制品流程

    if (!choiceWizard.completed) {
      // 首次请求时检测是否需要激活向导
      if (!choiceWizard.active) {
        detectAndActivateWizard(finalContent)
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
  
  const message = appStore.messages.find(m => m.id === messageId)
  if (!message) return
  
  // 确定父用户消息ID（用于分支管理）
  const parentMessageId = message.role === 'user' ? message.id : (message.parent_id || messageId)
  const branchKey = getBranchKey(messageId) // 父用户消息ID
  
  isSending.value = true
  isAiWaiting.value = true
  
  try {
    // 先获取当前分支列表（如果有缓存）
    const currentBranches = branchHistory.value[branchKey] || []
    
    // 调用后端重新生成API
    const result = await appStore.regenerateMessage(id, messageId)
    if (result) {
      // appStore.regenerateMessage 已经更新了 messages 数组
      
      // 先设置当前分支为新消息ID
      currentBranchForMessage.value[branchKey] = result.id
      
      // 更新分支缓存：添加新分支到现有分支列表
      // 如果当前分支列表为空，创建一个包含新分支的列表
      // 如果已有分支列表，添加新分支（假设新分支版本号最大）
      const newBranch: MessageBranch = {
        id: result.id,
        message_id: parentMessageId,
        content: result.content,
        version: result.version || (currentBranches.length > 0 ? currentBranches[currentBranches.length - 1].version + 1 : 1),
        created_at: new Date().toISOString(),
      }
      
      // 创建新的分支列表：现有分支 + 新分支
      const updatedBranches = [...currentBranches, newBranch]
      branchHistory.value[branchKey] = updatedBranches
      
      // 异步加载完整的分支数据（确保数据正确）
      getMessageBranches(parentMessageId).then((branches) => {
        // 用API返回的完整数据替换缓存
        branchHistory.value[branchKey] = branches
      }).catch(e => {
        console.error('Failed to load branches after regenerate:', e)
      })
    }
  } catch (e) {
    console.error('Regenerate failed:', e)
  } finally {
    isSending.value = false
    isAiWaiting.value = false
  }
}

/** 编辑用户消息 */
const handleEditUserMessage = async (messageId: string) => {
  const message = appStore.messages.find(m => m.id === messageId)
  if (!message || message.role !== 'user') return
  
  editingMessageId.value = messageId
  editingMessageContent.value = stripAttachmentContent(message.content) || ''
  
  // 聚焦到输入框并设置内容
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.value = editingMessageContent.value
      inputRef.value.focus()
      inputRef.value.setSelectionRange(
        editingMessageContent.value.length,
        editingMessageContent.value.length
      )
    }
  })
}

/** 保存编辑后的用户消息 */
const handleSaveEdit = async () => {
  if (!editingMessageId.value || !editingMessageContent.value.trim() || !dialogId.value) return
  
  try {
    isSending.value = true
    // 找到原始消息
    const originalIndex = appStore.messages.findIndex(m => m.id === editingMessageId.value)
    if (originalIndex === -1) return
    
    // 发送编辑后的消息（会产生新分支）
    const res = await dialogApi.sendMessage(dialogId.value, editingMessageContent.value)
    if (res.success && res.data) {
      // 加载新的对话状态
      await appStore.openDialog(dialogId.value)
    }
  } catch (e) {
    console.error('Edit message failed:', e)
  } finally {
    editingMessageId.value = null
    editingMessageContent.value = ''
    isSending.value = false
  }
}

/** 取消编辑 */
const handleCancelEdit = () => {
  editingMessageId.value = null
  editingMessageContent.value = ''
}

/** 切换消息分支 */
const handleSwitchBranch = async (messageId: string, branchId: string) => {
  if (!dialogId.value) return

  try {
    const branchKey = getBranchKey(messageId)
    // 更新当前分支选择
    currentBranchForMessage.value[branchKey] = branchId
    
    // 获取该消息的所有分支
    const branches = await getMessageBranches(messageId)
    const branch = branches.find(b => b.id === branchId)
    if (!branch) {
      console.error('Branch not found:', branchId)
      return
    }
    
    // 更新消息列表中的消息（替换整个消息对象）
    // 注意：由于现在使用displayMessages过滤，我们需要在原始消息列表中更新
    const index = appStore.messages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      // 创建新的消息对象，保留除了id和content之外的其他属性
      const originalMessage = appStore.messages[index]
      appStore.messages[index] = {
        ...originalMessage,
        id: branch.id, // 使用分支消息的ID
        content: branch.content,
        // 注意：我们还需要更新 version 和 parent_id
        version: branch.version,
        parent_id: branch.message_id, // branch.message_id 是父用户消息ID
      }
    }
  } catch (e) {
    console.error('Switch branch failed:', e)
  }
}

/** 切换到上一个分支 */
const switchToPrevBranch = async (messageId: string) => {
  if (!dialogId.value) return

  try {
    const branchKey = getBranchKey(messageId)
    const branches = await getMessageBranches(messageId)
    if (branches.length <= 1) return
    
    const currentBranchId = currentBranchForMessage.value[branchKey]
    let currentIndex = -1
    if (currentBranchId) {
      currentIndex = branches.findIndex(b => b.id === currentBranchId)
    }
    // 如果当前分支不在列表中，从第一个分支开始
    if (currentIndex === -1) {
      currentIndex = 0
    }
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : branches.length - 1
    const prevBranch = branches[prevIndex]
    
    await handleSwitchBranch(messageId, prevBranch.id)
  } catch (e) {
    console.error('Switch to prev branch failed:', e)
  }
}

/** 切换到下一个分支 */
const switchToNextBranch = async (messageId: string) => {
  if (!dialogId.value) return

  try {
    const branchKey = getBranchKey(messageId)
    const branches = await getMessageBranches(messageId)
    if (branches.length <= 1) return
    
    const currentBranchId = currentBranchForMessage.value[branchKey]
    let currentIndex = -1
    if (currentBranchId) {
      currentIndex = branches.findIndex(b => b.id === currentBranchId)
    }
    // 如果当前分支不在列表中，从第一个分支开始
    if (currentIndex === -1) {
      currentIndex = 0
    }
    const nextIndex = (currentIndex + 1) % branches.length
    const nextBranch = branches[nextIndex]
    
    await handleSwitchBranch(messageId, nextBranch.id)
  } catch (e) {
    console.error('Switch to next branch failed:', e)
  }
}

/** 获取消息的所有分支 */
const getMessageBranches = async (messageId: string) => {
  if (!dialogId.value) return []

  try {
    const branchKey = getBranchKey(messageId)
    console.log('[frontend] getMessageBranches:', messageId, 'branchKey:', branchKey)
    if (!branchHistory.value[branchKey]) {
      // 获取消息详情以确定 parent_id
      const message = appStore.messages.find(m => m.id === messageId)
      let targetId = messageId
      
      if (message && message.role === 'ai' && message.parent_id) {
        // AI消息的分支是其 parent_id（用户消息）的所有AI回复
        targetId = message.parent_id
      }
      
      const res = await dialogApi.getMessageBranches(dialogId.value, targetId)
      console.log('[frontend] getMessageBranches API response:', res.success, 'data:', res.data)
      if (res.success && res.data) {
        const payload = (res.data as any).data || res.data
        // 映射后端字段到 MessageBranch 接口
        const branches: MessageBranch[] = payload.map((item: any) => ({
          id: item.id,
          message_id: targetId, // 原始消息ID（用户消息ID）
          content: item.content,
          version: item.version,
          created_at: item.timestamp || item.created_at,
        }))
        console.log('[frontend] branches loaded:', branches.length)
        branchHistory.value[branchKey] = branches
      }
    }
    return branchHistory.value[branchKey] || []
  } catch (e) {
    console.error('Get message branches failed:', e)
    return []
  }
}

/** 判断消息是否有多个分支 */
const hasMultipleBranches = (messageId: string) => {
  const branchKey = getBranchKey(messageId)
  
  // 如果分支历史为空，异步获取但不等待（模板不能使用async）
  if (!branchHistory.value[branchKey]) {
    console.log('[frontend] hasMultipleBranches: branchHistory empty, loading in background...', messageId, branchKey)
    // 异步加载但不等待
    getMessageBranches(messageId).catch(e => {
      console.warn('[frontend] hasMultipleBranches: failed to load branches', e)
    })
  }
  
  const branches = branchHistory.value[branchKey]
  const result = branches && branches.length > 1
  console.log('[frontend] hasMultipleBranches:', messageId, 'branchKey:', branchKey, 'branches:', branches?.length, 'result:', result)
  return result
}

/** 获取消息的当前版本和总版本数 */
const getMessageVersionInfo = (messageId: string) => {
  const branchKey = getBranchKey(messageId)
  
  // 异步加载分支数据（如果还没有）
  if (!branchHistory.value[branchKey]) {
    console.log('[frontend] getMessageVersionInfo: branchHistory empty, loading in background...', messageId, branchKey)
    getMessageBranches(messageId).catch(e => {
      console.warn('[frontend] getMessageVersionInfo: failed to load branches', e)
    })
    // 返回默认值直到数据加载完成
    return { current: 1, total: 1 }
  }
  
  const branches = branchHistory.value[branchKey]
  if (!branches || branches.length === 0) return { current: 1, total: 1 }
  
  const currentBranchId = currentBranchForMessage.value[branchKey]
  let currentIndex = 0
  if (currentBranchId) {
    const index = branches.findIndex(b => b.id === currentBranchId)
    if (index !== -1) currentIndex = index
  }
  
  return { current: currentIndex + 1, total: branches.length }
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
  // 准备要复制的文本
  let textToCopy = content
    .replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '')
    .replace(/\[CHOICE\][\s\S]*?\[\/CHOICE\]/g, '')
    .trim()

  // 处理 [ARTIFACT] 标签：替换为提示文本
  textToCopy = textToCopy.replace(/\[ARTIFACT\][\s\S]*?\[\/ARTIFACT\]/g, '【制品内容已生成，请在右侧面板查看】')

  // HTML 反转义
  const decodeHtmlEntities = (text: string) => {
    const entities: Record<string, string> = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' '
    }
    return text.replace(/&(lt|gt|amp|quot|#39|nbsp);/g, match => entities[match] || match)
  }

  textToCopy = decodeHtmlEntities(textToCopy)
  
  // 移除 HTML 标签
  textToCopy = textToCopy.replace(/<[^>]*>/g, '')

  // 显示复制成功提示的函数
  const showCopySuccess = () => {
    const btn = document.activeElement
    if (btn && btn.tagName === 'BUTTON') {
      const originalHtml = btn.innerHTML
      btn.innerHTML = '<span class="text-green-600 text-sm">已复制!</span>'
      setTimeout(() => { btn.innerHTML = originalHtml }, 1500)
    }
  }

  // 检查现代剪贴板 API 是否可用
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      // 使用现代剪贴板 API
      await navigator.clipboard.writeText(textToCopy)
      showCopySuccess()
      return
    } catch (err) {
      console.error('现代剪贴板 API 失败:', err)
    }
  }
  
  // 降级方案：使用传统的 document.execCommand
  try {
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (success) {
      showCopySuccess()
    } else {
      throw new Error('document.execCommand 失败')
    }
  } catch (fallbackErr) {
    console.error('备用复制方法也失败:', fallbackErr)
    // 最后尝试：提示用户手动复制
    prompt('复制失败，请手动复制以下文本：', textToCopy)
  }
}

/** 切换HTML预览菜单 */
const toggleHtmlMenu = (messageId: string) => {
  if (htmlMenuOpen.value === messageId) {
    htmlMenuOpen.value = null
  } else {
    htmlMenuOpen.value = messageId
  }
}

/** 下载HTML文件 */
const downloadHtmlFile = (htmlContent: string) => {
  try {
    // 关闭菜单
    htmlMenuOpen.value = null
    
    // 创建一个Blob对象
    const blob = new Blob([wrapWithProgressiveRender(htmlContent)], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // 创建一个临时下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-generated-${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    
    console.log('[FRONTEND] HTML file download initiated')
  } catch (error) {
    console.error('[FRONTEND] Failed to download HTML file:', error)
    // 可以提供用户反馈
  }
}



/** iframe加载完成时触发渐进式渲染 */
const onIframeLoad = (messageId: string) => {
  console.log(`[FRONTEND] iframe loaded for message ${messageId}`)
  // 注意：渐进式渲染已经在wrapWithProgressiveRender函数中实现
  // iframe加载后会自动执行渐进式渲染脚本
  
  // 延迟触发最终渲染，确保所有内容都已加载
  setTimeout(() => {
    // 找到对应messageId的iframe
    const iframes = document.querySelectorAll(`iframe[data-message-id="${messageId}"]`)
    if (iframes.length > 0) {
      const iframe = iframes[0] as HTMLIFrameElement
      try {
        // 触发iframe内的最终渲染
        const iframeWindow = iframe.contentWindow
        if (iframeWindow && typeof iframeWindow.triggerFinalRender === 'function') {
          console.log(`[FRONTEND] Triggering final render for message ${messageId}`)
          iframeWindow.triggerFinalRender()
        }
      } catch (e) {
        console.log(`[FRONTEND] Could not trigger final render for iframe:`, e)
      }
    }
  }, 500) // 等待500ms确保内容完全加载
  
  // 动态计算iframe内容高度
  setTimeout(() => {
    // 找到对应messageId的iframe
    const iframes = document.querySelectorAll(`iframe[data-message-id="${messageId}"]`)
    if (iframes.length > 0) {
      const iframe = iframes[0] as HTMLIFrameElement
      try {
        // 获取iframe内容的高度
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc && iframeDoc.body && iframeDoc.documentElement) {
          const height = Math.max(
            iframeDoc.body.scrollHeight,
            iframeDoc.body.offsetHeight,
            iframeDoc.documentElement.clientHeight,
            iframeDoc.documentElement.scrollHeight,
            iframeDoc.documentElement.offsetHeight
          )
          console.log(`[FRONTEND] Calculated iframe height for message ${messageId}: ${height}px`)
          
          // 设置iframe高度，最小高度为300px，最大高度为1000px
          const finalHeight = Math.max(300, Math.min(height, 1000))
          iframe.style.height = `${finalHeight}px`
          console.log(`[FRONTEND] Set iframe height to ${finalHeight}px for message ${messageId}`)
        } else {
          console.log(`[FRONTEND] Could not access iframe document for message ${messageId}`)
          // 设置默认高度600px
          iframe.style.height = "600px"
        }
      } catch (error) {
        console.log(`[FRONTEND] Error calculating iframe height for message ${messageId}:`, error)
        // 设置默认高度600px
        iframe.style.height = "600px"
      }
    }
  }, 100) // 延迟100ms确保内容已加载
}

/** 分享 */
const handleShare = () => {
  const url = window.location.href
  
  // 检查现代剪贴板 API 是否可用
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(url).then(() => {
      // toast copied
    }).catch(err => {
      console.error('分享复制失败:', err)
      // 降级方案：使用传统的 document.execCommand
      fallbackCopy(url)
    })
  } else {
    // 直接使用降级方案
    fallbackCopy(url)
  }
}

/** 降级复制方法 */
const fallbackCopy = (text: string) => {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (success) {
      // toast copied
    } else {
      console.error('降级复制方法失败')
    }
  } catch (err) {
    console.error('降级复制方法异常:', err)
    prompt('复制失败，请手动复制以下文本：', text)
  }
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

/** 格式化消息显示时间（官网样式：显示具体时间） */
const formatMessageTime = (message: Message) => {
  if (!message.timestamp) return ''
  const timestamp = message.timestamp
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  // 当天消息：显示 HH:mm
  // 昨天消息：显示 "昨天 HH:mm"  
  // 一周内：显示星期几 HH:mm
  // 更早：显示 YYYY-MM-DD HH:mm
  if (diffDays === 0) {
    // 今天
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    // 昨天
    return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays < 7) {
    // 一周内
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekday = weekdays[date.getDay()]
    return `${weekday} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  } else {
    // 更早
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const time = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    return `${year}-${month}-${day} ${time}`
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
.chat-composer-mask {
  background: linear-gradient(to top, #f9f8f5 0%, rgba(249, 248, 245, 0.96) 58%, rgba(249, 248, 245, 0) 100%);
}

.dark .chat-composer-mask {
  background: linear-gradient(to top, #1f1f1e 0%, rgba(31, 31, 30, 0.96) 58%, rgba(31, 31, 30, 0) 100%);
}

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

/* HTML 预览卡片样式 */
.html-preview-card {
  @apply bg-transparent border-0 shadow-none;
  height: auto;
  min-height: 0;
  max-height: none;
  display: flex;
  flex-direction: column;
}
.html-preview-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-[#f0ede7] dark:border-white/5;
}
.html-preview-title {
  @apply text-[14px] font-medium text-[#1a1a1a] dark:text-white;
}
.html-preview-content {
  @apply bg-transparent border-0 rounded-none overflow-visible;
  height: auto;
  min-height: 0;
  max-height: none;
  flex: 1;
}
.html-preview-footer {
  @apply flex items-center justify-between px-4 py-2 border-t border-[#f0ede7] dark:border-white/5 bg-[#fafaf8] dark:bg-[#252524];
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
