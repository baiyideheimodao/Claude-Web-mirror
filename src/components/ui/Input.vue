<template>
  <div class="relative">
    <!-- 标签 -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-text-100 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger-100">*</span>
    </label>
    
    <!-- 输入框 -->
    <div class="relative">
      <!-- 前缀图标 -->
      <div v-if="$slots.prefix || prefixIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2">
        <slot name="prefix">
          <span v-if="prefixIcon" class="text-text-400">{{ prefixIcon }}</span>
        </slot>
      </div>
      
      <!-- 输入框主体 -->
      <component
        :is="componentType"
        :id="id"
        :class="inputClasses"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :type="type"
        :rows="rows"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleKeydown"
      />
      
      <!-- 后缀图标 -->
      <div v-if="$slots.suffix || suffixIcon" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <slot name="suffix">
          <span v-if="suffixIcon" class="text-text-400">{{ suffixIcon }}</span>
        </slot>
      </div>
      
      <!-- 清除按钮 -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-400 hover:text-text-200"
        @click="clearInput"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="mt-2 text-sm text-danger-100 flex items-center gap-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>
    
    <!-- 提示信息 -->
    <div v-if="hint && !error" class="mt-2 text-sm text-text-400">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea'
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
  rows?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  clearable: false,
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [value: string]
  'change': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'keydown-enter': [event: KeyboardEvent]
  'clear': []
}>()

const id = ref(props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
const isFocused = ref(false)

const componentType = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input'
})

const inputClasses = computed(() => {
  const base = 'w-full bg-bg-0 border transition-all duration-200 ease-claude-standard text-text-100 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-accent-100 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none'
  
  const padding = props.prefixIcon || props.suffixIcon || props.clearable
    ? 'px-10 py-3'
    : 'px-4 py-3'
  
  const border = props.error
    ? 'border-danger-100 focus:border-danger-100'
    : isFocused.value
    ? 'border-accent-100 focus:border-transparent'
    : 'border-border-400 focus:border-transparent'
  
  const rounded = props.type === 'textarea' ? 'rounded-xl' : 'rounded-lg'
  
  const textarea = props.type === 'textarea' ? 'resize-y min-h-textarea-min-height' : ''
  
  return [base, padding, border, rounded, textarea].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('change', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown-enter', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
}
</script>