import { ref, computed } from 'vue'
import type { Feature, Example } from '../types/home'

/**
 * 首页特性组合式函数
 * 管理首页特性卡片和示例数据
 */
export function useHomeFeatures() {
  // 特性数据
  const features = ref<Feature[]>([
    {
      id: 'feature-1',
      title: 'Writing & Editing',
      description: 'Draft emails, write blog posts, improve your writing style, and more.',
      icon: '✍️',
      category: 'productivity',
      popularity: 95
    },
    {
      id: 'feature-2',
      title: 'Analysis & Research',
      description: 'Summarize documents, analyze data, extract key insights from complex information.',
      icon: '📊',
      category: 'analysis',
      popularity: 88
    },
    {
      id: 'feature-3',
      title: 'Coding & Development',
      description: 'Write code, debug errors, explain complex concepts, and review code.',
      icon: '💻',
      category: 'development',
      popularity: 92
    },
    {
      id: 'feature-4',
      title: 'Creative Work',
      description: 'Brainstorm ideas, generate creative content, plan projects, and more.',
      icon: '🎨',
      category: 'creative',
      popularity: 85
    },
    {
      id: 'feature-5',
      title: 'Learning & Education',
      description: 'Explain concepts, create study guides, practice questions, and more.',
      icon: '📚',
      category: 'education',
      popularity: 78
    },
    {
      id: 'feature-6',
      title: 'Productivity',
      description: 'Organize tasks, plan schedules, create templates, and automate workflows.',
      icon: '⚡',
      category: 'productivity',
      popularity: 90
    }
  ])

  // 示例数据
  const examples = ref<Example[]>([
    {
      id: 'example-1',
      title: 'Write a professional email',
      description: 'Craft a clear, concise email for a business proposal.',
      prompt: 'Write a professional email to a potential client about our new product launch. The email should be concise, highlight key benefits, and include a call to action.',
      category: 'writing',
      difficulty: 'easy'
    },
    {
      id: 'example-2',
      title: 'Explain a complex concept',
      description: 'Get a simple explanation of quantum computing.',
      prompt: 'Explain quantum computing in simple terms that a high school student could understand. Use analogies and avoid technical jargon.',
      category: 'education',
      difficulty: 'medium'
    },
    {
      id: 'example-3',
      title: 'Debug a code error',
      description: 'Help identify and fix a common JavaScript error.',
      prompt: 'I\'m getting "TypeError: Cannot read property of undefined" in my React component. Here\'s my code: [code snippet]. What could be causing this error and how do I fix it?',
      category: 'development',
      difficulty: 'medium'
    },
    {
      id: 'example-4',
      title: 'Plan a project timeline',
      description: 'Create a detailed project plan for a website redesign.',
      prompt: 'Create a 3-month project timeline for redesigning our company website. Include phases for research, design, development, testing, and launch.',
      category: 'planning',
      difficulty: 'hard'
    }
  ])

  // 搜索功能
  const searchQuery = ref('')
  const selectedCategory = ref<string | null>(null)

  // 过滤后的特性
  const filteredFeatures = computed(() => {
    let filtered = features.value

    // 根据搜索词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(feature =>
        feature.title.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query) ||
        feature.category.toLowerCase().includes(query)
      )
    }

    // 根据类别过滤
    if (selectedCategory.value) {
      filtered = filtered.filter(feature => feature.category === selectedCategory.value)
    }

    return filtered
  })

  // 过滤后的示例
  const filteredExamples = computed(() => {
    let filtered = examples.value

    // 根据搜索词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(example =>
        example.title.toLowerCase().includes(query) ||
        example.description.toLowerCase().includes(query) ||
        example.category.toLowerCase().includes(query)
      )
    }

    // 根据类别过滤
    if (selectedCategory.value) {
      filtered = filtered.filter(example => example.category === selectedCategory.value)
    }

    return filtered
  })

  // 类别列表
  const categories = computed(() => {
    const allCategories = features.value.map(f => f.category)
    return [...new Set(allCategories)]
  })

  // 热门特性（按受欢迎程度排序）
  const popularFeatures = computed(() => {
    return [...features.value]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3)
  })

  // 操作方法
  const addFeature = (feature: Omit<Feature, 'id'>) => {
    const newFeature: Feature = {
      ...feature,
      id: `feature-${Date.now()}`
    }
    features.value.push(newFeature)
  }

  const removeFeature = (id: string) => {
    const index = features.value.findIndex(f => f.id === id)
    if (index !== -1) {
      features.value.splice(index, 1)
    }
  }

  const updateFeature = (id: string, updates: Partial<Feature>) => {
    const index = features.value.findIndex(f => f.id === id)
    if (index !== -1) {
      features.value[index] = { ...features.value[index], ...updates }
    }
  }

  const addExample = (example: Omit<Example, 'id'>) => {
    const newExample: Example = {
      ...example,
      id: `example-${Date.now()}`
    }
    examples.value.push(newExample)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    selectedCategory.value = null
  }

  // 获取特性详情
  const getFeatureById = (id: string) => {
    return features.value.find(f => f.id === id)
  }

  // 获取示例详情
  const getExampleById = (id: string) => {
    return examples.value.find(e => e.id === id)
  }

  return {
    // 状态
    features,
    examples,
    searchQuery,
    selectedCategory,
    
    // 计算属性
    filteredFeatures,
    filteredExamples,
    categories,
    popularFeatures,
    
    // 操作方法
    addFeature,
    removeFeature,
    updateFeature,
    addExample,
    clearSearch,
    getFeatureById,
    getExampleById
  }
}