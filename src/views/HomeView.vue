<template>
  <div class="min-h-screen bg-bg-100">
    <!-- 顶部导航栏 -->
    <AppNavigation />
    
    <!-- 主内容区域 -->
    <main class="pl-0 md:pl-nav-width transition-all duration-300">
      <div class="container-claude py-8 md:py-12">
        <!-- Hero 区域 -->
        <section class="mb-12 md:mb-16">
          <h1 class="font-serif text-4xl md:text-5xl text-text-100 mb-4">
            What can I help you with today?
          </h1>
          <p class="text-text-400 text-lg mb-8">
            Evening, <span class="font-medium text-text-100">Visitor</span>. Let's create something amazing together.
          </p>
          
          <!-- 输入区域 -->
          <div class="max-w-3xl">
            <div class="relative">
              <textarea 
                class="textarea-base w-full"
                placeholder="Type your message here..."
                rows="4"
              ></textarea>
              <div class="absolute bottom-4 right-4 flex gap-2">
                <button class="btn-text">Attach file</button>
                <button class="btn-primary">Send message</button>
              </div>
            </div>
            
            <div class="mt-4 text-sm text-text-400">
              <p>Claude can help with writing, analysis, coding, and more.</p>
            </div>
          </div>
        </section>
        
        <!-- 特性卡片区域 -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-text-100 mb-6">What can Claude do?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              v-for="feature in features"
              :key="feature.id"
              :title="feature.title"
              :description="feature.description"
              :icon="feature.icon"
            />
          </div>
        </section>
        
        <!-- 使用示例 -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-text-100 mb-6">Try these examples</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExampleCard 
              v-for="example in examples"
              :key="example.id"
              :title="example.title"
              :description="example.description"
              :prompt="example.prompt"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '@/components/layout/AppNavigation.vue'
import FeatureCard from '@/components/cards/FeatureCard.vue'
import ExampleCard from '@/components/cards/ExampleCard.vue'

const features = [
  {
    id: 1,
    title: 'Writing & Editing',
    description: 'Draft emails, write blog posts, improve your writing style, and more.',
    icon: '✍️'
  },
  {
    id: 2,
    title: 'Analysis & Research',
    description: 'Summarize documents, analyze data, extract key insights from complex information.',
    icon: '📊'
  },
  {
    id: 3,
    title: 'Coding & Development',
    description: 'Write code, debug errors, explain complex concepts, and review code.',
    icon: '💻'
  },
  {
    id: 4,
    title: 'Creative Work',
    description: 'Brainstorm ideas, generate creative content, plan projects, and more.',
    icon: '🎨'
  },
  {
    id: 5,
    title: 'Learning & Education',
    description: 'Explain concepts, create study guides, practice questions, and more.',
    icon: '📚'
  },
  {
    id: 6,
    title: 'Productivity',
    description: 'Organize tasks, plan schedules, create templates, and automate workflows.',
    icon: '⚡'
  }
]

const examples = [
  {
    id: 1,
    title: 'Write a professional email',
    description: 'Craft a clear, concise email for a business proposal.',
    prompt: 'Write a professional email to a potential client about our new product launch...'
  },
  {
    id: 2,
    title: 'Explain a complex concept',
    description: 'Get a simple explanation of quantum computing.',
    prompt: 'Explain quantum computing in simple terms that a high school student could understand...'
  },
  {
    id: 3,
    title: 'Debug a code error',
    description: 'Help identify and fix a common JavaScript error.',
    prompt: 'I\'m getting "TypeError: Cannot read property of undefined" in my React component...'
  },
  {
    id: 4,
    title: 'Plan a project timeline',
    description: 'Create a detailed project plan for a website redesign.',
    prompt: 'Create a 3-month project timeline for redesigning our company website...'
  }
]
</script>