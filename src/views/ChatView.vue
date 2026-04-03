<template>
  <div class="min-h-screen bg-bg-100 flex">
    <!-- 侧边栏导航 -->
    <AppNavigation />
    
    <!-- 主聊天区域 -->
    <main class="flex-1 pl-0 md:pl-nav-width transition-all duration-300">
      <div class="max-w-4xl mx-auto py-8 px-4 md:px-8">
        <!-- 聊天标题 -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-text-100">New Chat</h1>
          <p class="text-text-400 mt-2">Start a conversation with Claude</p>
        </div>
        
        <!-- 消息列表 -->
        <div class="space-y-6 mb-8">
          <!-- 用户消息 -->
          <div class="flex justify-end">
            <div class="max-w-[80%] bg-bg-300 rounded-xl rounded-tr-none p-4">
              <p class="text-text-100">Can you help me write a Vue component for a button?</p>
              <p class="text-xs text-text-400 mt-2 text-right">Just now</p>
            </div>
          </div>
          
          <!-- AI 回复 -->
          <div class="flex">
            <div class="w-8 h-8 rounded-full bg-brand-0 flex items-center justify-center mr-3">
              <span class="text-white text-sm font-bold">C</span>
            </div>
            <div class="max-w-[80%] bg-bg-0 border border-border-300 rounded-xl rounded-tl-none p-4">
              <p class="text-text-100">Sure! Here's a Vue 3 button component using Composition API and TypeScript...</p>
              <div class="mt-4 bg-bg-100 rounded-lg p-3 font-mono text-sm">
                <pre><code>&lt;template&gt;
  &lt;button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  &gt;
    &lt;slot /&gt;
  &lt;/button&gt;
&lt;/template&gt;</code></pre>
              </div>
              <p class="text-xs text-text-400 mt-2">2 minutes ago</p>
            </div>
          </div>
        </div>
        
        <!-- 输入区域 -->
        <div class="sticky bottom-8 bg-bg-0 border border-border-300 rounded-xl p-4 shadow-claude-lg">
          <div class="flex items-center gap-3 mb-3">
            <button class="btn-text text-sm">Attach files</button>
            <button class="btn-text text-sm">Use templates</button>
            <button class="btn-text text-sm">Adjust settings</button>
          </div>
          
          <div class="relative">
            <textarea 
              v-model="message"
              class="textarea-base w-full pr-24"
              placeholder="Message Claude..."
              rows="3"
              @keydown.enter.exact.prevent="sendMessage"
            ></textarea>
            
            <div class="absolute bottom-3 right-3 flex items-center gap-2">
              <button class="btn-text text-sm">Regenerate</button>
              <button 
                class="btn-primary"
                :disabled="!message.trim()"
                @click="sendMessage"
              >
                Send
              </button>
            </div>
          </div>
          
          <div class="mt-3 text-xs text-text-400">
            <p>Claude can make mistakes. Please verify important information.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { ref } from 'vue'

const message = ref('')

const sendMessage = () => {
  if (!message.value.trim()) return
  
  console.log('Sending message:', message.value)
  // TODO: 实际的消息发送逻辑
  message.value = ''
}
</script>