<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="ariaLabel || label"
    :type="type"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <span v-if="loading" class="flex items-center justify-center">
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>
    
    <!-- 正常状态 -->
    <span v-else class="flex items-center justify-center">
      <slot name="icon">
        <span v-if="icon" class="text-lg">{{ icon }}</span>
        <svg 
          v-else-if="svgIcon" 
          :class="iconClasses"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path :d="svgIcon" />
        </svg>
      </slot>
      <span v-if="label && !iconOnly" class="ml-2">{{ label }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'text' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square' | 'rounded'
  disabled?: boolean
  loading?: boolean
  icon?: string
  svgIcon?: string
  label?: string
  iconOnly?: boolean
  ariaLabel?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'md',
  shape: 'circle',
  disabled: false,
  loading: false,
  iconOnly: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center transition-all duration-200 ease-claude-standard focus:outline-none focus:ring-2 focus:ring-accent-100 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-brand-0 text-white hover:bg-brand-100 active:bg-brand-200',
    secondary: 'bg-bg-200 text-text-100 hover:bg-bg-300 active:bg-bg-400',
    text: 'bg-transparent text-text-400 hover:text-text-200 hover:bg-bg-300',
    ghost: 'bg-transparent text-text-400 hover:text-text-100 hover:bg-bg-300',
    danger: 'bg-transparent text-danger-100 hover:bg-danger-900 active:bg-danger-800'
  }
  
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-md',
    rounded: 'rounded-lg'
  }
  
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    shapes[props.shape]
  ].join(' ')
})

const iconClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return sizes[props.size]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>