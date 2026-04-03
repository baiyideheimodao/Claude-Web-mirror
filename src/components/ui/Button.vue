<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>{{ loadingText }}</span>
    </span>
    
    <!-- 正常状态 -->
    <span v-else class="flex items-center justify-center gap-2">
      <slot name="icon">
        <span v-if="icon" class="text-lg">{{ icon }}</span>
      </slot>
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  icon?: string
  label?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  loadingText: 'Loading...',
  fullWidth: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-claude-standard focus:outline-none focus:ring-2 focus:ring-accent-100 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-brand-0 text-white hover:bg-brand-100 hover:scale-[1.02] active:bg-brand-200',
    secondary: 'bg-transparent text-text-0 border border-border-400 hover:bg-bg-300 active:bg-bg-400',
    text: 'bg-transparent text-text-400 hover:text-text-200 underline px-0 py-0',
    danger: 'bg-danger-100 text-white hover:bg-danger-200 active:bg-danger-0',
    success: 'bg-success-100 text-white hover:bg-success-200 active:bg-success-0'
  }
  
  const sizes = {
    sm: 'h-7 px-2.5 text-xs rounded',
    md: 'h-8 px-3 text-sm rounded-md',
    lg: 'h-10 px-4 text-base rounded-lg'
  }
  
  const width = props.fullWidth ? 'w-full' : ''
  
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    width,
    'rounded-md' // Claude 标准圆角
  ].join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>