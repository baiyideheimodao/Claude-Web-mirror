import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-click-outside directive
 * 点击元素外部时触发回调
 */
export const clickOutside: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutsideHandler)
  }
}

/**
 * v-tooltip directive
 * 悬停显示提示文字
 */
export const tooltip: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const text = binding.value
    if (!text) return

    el.setAttribute('data-tooltip', text)
    el.style.position = 'relative'

    // 创建tooltip元素
    const tip = document.createElement('span')
    tip.className = 'v-tooltip'
    tip.textContent = text

    const show = () => { tip.classList.add('show') }
    const hide = () => { tip.classList.remove('show') }

    el.appendChild(tip)
    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
  }
}
