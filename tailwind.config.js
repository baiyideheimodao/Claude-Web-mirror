/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // 字体配置
      fontFamily: {
        sans: 'var(--font-sans-serif)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
        ui: 'var(--font-ui)',
        'ui-serif': 'var(--font-ui-serif)',
        system: 'var(--font-system)',
        'claude-response': 'var(--font-claude-response)',
        'user-message': 'var(--font-user-message)'
      },
      // 颜色系统 - 基于 Claude 官网设计令牌
      colors: {
        // 品牌色
        brand: {
          0: 'hsl(var(--brand-000) / <alpha-value>)',
          100: 'hsl(var(--brand-100) / <alpha-value>)',
          200: 'hsl(var(--brand-200) / <alpha-value>)',
          300: 'hsl(var(--brand-300) / <alpha-value>)',
          400: 'hsl(var(--brand-400) / <alpha-value>)',
          500: 'hsl(var(--brand-500) / <alpha-value>)',
          600: 'hsl(var(--brand-600) / <alpha-value>)',
          700: 'hsl(var(--brand-700) / <alpha-value>)',
          800: 'hsl(var(--brand-800) / <alpha-value>)',
          900: 'hsl(var(--brand-900) / <alpha-value>)'
        },
        // 背景色
        bg: {
          0: 'hsl(var(--bg-000) / <alpha-value>)',
          100: 'hsl(var(--bg-100) / <alpha-value>)',
          200: 'hsl(var(--bg-200) / <alpha-value>)',
          300: 'hsl(var(--bg-300) / <alpha-value>)',
          400: 'hsl(var(--bg-400) / <alpha-value>)'
        },
        // 文字色
        text: {
          0: 'hsl(var(--text-000) / <alpha-value>)',
          100: 'hsl(var(--text-100) / <alpha-value>)',
          200: 'hsl(var(--text-200) / <alpha-value>)',
          300: 'hsl(var(--text-300) / <alpha-value>)',
          400: 'hsl(var(--text-400) / <alpha-value>)',
          500: 'hsl(var(--text-500) / <alpha-value>)'
        },
        // 边框色
        border: {
          100: 'hsl(var(--border-100) / <alpha-value>)',
          200: 'hsl(var(--border-200) / <alpha-value>)',
          300: 'hsl(var(--border-300) / <alpha-value>)',
          400: 'hsl(var(--border-400) / <alpha-value>)'
        },
        // 状态色
        success: {
          0: 'hsl(var(--success-000) / <alpha-value>)',
          100: 'hsl(var(--success-100) / <alpha-value>)',
          200: 'hsl(var(--success-200) / <alpha-value>)',
          900: 'hsl(var(--success-900) / <alpha-value>)'
        },
        warning: {
          0: 'hsl(var(--warning-000) / <alpha-value>)',
          100: 'hsl(var(--warning-100) / <alpha-value>)',
          200: 'hsl(var(--warning-200) / <alpha-value>)',
          900: 'hsl(var(--warning-900) / <alpha-value>)'
        },
        danger: {
          0: 'hsl(var(--danger-000) / <alpha-value>)',
          100: 'hsl(var(--danger-100) / <alpha-value>)',
          200: 'hsl(var(--danger-200) / <alpha-value>)',
          900: 'hsl(var(--danger-900) / <alpha-value>)'
        },
        // 强调色
        accent: {
          100: 'hsl(var(--accent-100) / <alpha-value>)',
          200: 'hsl(var(--accent-200) / <alpha-value>)',
          300: 'hsl(var(--accent-300) / <alpha-value>)'
        },
        // 遮罩色
        overlay: {
          100: 'hsl(var(--overlay-100) / <alpha-value>)'
        }
      },
      // 间距系统 - 基于 4px 网格
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '5.5': '22px',
        '6.5': '26px',
        '7.5': '30px',
        '8.5': '34px',
        '9.5': '38px',
        '10.5': '42px',
        '11.5': '46px',
        '12.5': '50px',
        '13.5': '54px',
        '14.5': '58px',
        '15.5': '62px'
      },
      // 圆角系统
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        'full': '9999px'
      },
      // 动画过渡
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms'
      },
      transitionTimingFunction: {
        'claude-standard': 'cubic-bezier(0.165, 0.85, 0.45, 1)',
        'claude-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      // 阴影系统
      boxShadow: {
        'claude-soft': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'claude-md': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'claude-lg': '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'claude-focus': '0 0 0 3px hsl(var(--accent-100) / 0.1)'
      },
      // 断点系统
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}