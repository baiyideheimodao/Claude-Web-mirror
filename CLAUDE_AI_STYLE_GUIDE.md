# Claude AI 官网样式规范

> 本规范基于对 https://claude.ai/new 的像素级分析生成
> 适用于 Vue 3 + Vite + TailwindCSS 项目
> 最后更新：2026年4月2日

---

## 设计令牌（Design Tokens）

### 🎨 颜色系统

#### 主品牌色
| 名称 | CSS变量 | HSL值 | 用途 |
|------|---------|-------|------|
| Brand Primary | `--brand-000` | `15 54.2% 51.2%` | 主品牌色 |
| Brand Emphasized | `--brand-100` | `15 54.2% 51.2%` | 强调品牌色 |
| Brand Clay | `--brand-200` | `15 63.1% 59.6%` | 粘土色品牌色 |
| Brand Clay Emphasized | `--_brand-clay-emphasized` | `15.1 54.2% 51.2%` | 强调粘土色 |
| Accent Brand | `--accent-brand` | `15 63.1% 59.6%` | 品牌强调色 |

#### 背景色
| 名称 | CSS变量 | HSL值 | 用途 |
|------|---------|-------|------|
| Background 000 | `--bg-000` | `0 0% 100%` | 纯白背景 |
| Background 100 | `--bg-100` | `48 33.3% 97.1%` | 页面背景（浅米色）|
| Background 200 | `--bg-200` | `53 28.6% 94.5%` | 卡片背景 |
| Background 300 | `--bg-300` | `48 25% 92.2%` | 悬浮背景 |
| Background 400 | `--bg-400` | `50 20.7% 88.6%` | 边框背景 |

#### 文字色
| 名称 | CSS变量 | HSL值 | 用途 |
|------|---------|-------|------|
| Text 000 | `--text-000` | `60 2.6% 7.6%` | 主标题文字 |
| Text 100 | `--text-100` | `60 2.6% 7.6%` | 正文文字 |
| Text 200 | `--text-200` | `60 2.5% 23.3%` | 次要文字 |
| Text 300 | `--text-300` | `60 2.5% 23.3%` | 禁用文字 |
| Text 400 | `--text-400` | `51 3.1% 43.7%` | 占位符文字 |
| Text 500 | `--text-500` | `51 3.1% 43.7%` | 辅助文字 |

#### 边框色
| 名称 | CSS变量 | HSL值 | 用途 |
|------|---------|-------|------|
| Border 100 | `--border-100` | `30 3.3% 11.8%` | 主要边框 |
| Border 200 | `--border-200` | `30 3.3% 11.8%` | 次要边框 |
| Border 300 | `--border-300` | `30 3.3% 11.8%` | 分割线 |
| Border 400 | `--border-400` | `30 3.3% 11.8%` | 卡片边框 |

#### 状态色
| 类型 | 名称 | CSS变量 | HSL值 |
|------|------|---------|-------|
| Success | Success 000 | `--success-000` | `125 100% 18%` |
| Success | Success 100 | `--success-100` | `103 72.3% 26.9%` |
| Success | Success 200 | `--success-200` | `103 72.3% 26.9%` |
| Success | Success 900 | `--success-900` | `86 45.1% 90%` |
| Warning | Warning 000 | `--warning-000` | `45 91.8% 19%` |
| Warning | Warning 100 | `--warning-100` | `39 88.8% 28%` |
| Warning | Warning 200 | `--warning-200` | `39 88.8% 28%` |
| Warning | Warning 900 | `--warning-900` | `38 65.9% 92%` |
| Danger | Danger 000 | `--danger-000` | `0 58.6% 34.1%` |
| Danger | Danger 100 | `--danger-100` | `0 56.2% 45.4%` |
| Danger | Danger 200 | `--danger-200` | `0 56.2% 45.4%` |
| Danger | Danger 900 | `--danger-900` | `0 50% 95%` |

### 🔤 字体系统

#### 字体系列
| 名称 | CSS变量 | 字体栈 |
|------|---------|--------|
| Sans Serif | `--font-sans-serif` | `"Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |
| Serif | `--font-serif` | `"Anthropic Serif", Georgia, "Times New Roman", serif` |
| Mono | `--font-mono` | `"Anthropic Mono", ui-monospace, monospace` |
| UI | `--font-ui` | `"Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |
| UI Serif | `--font-ui-serif` | `"Anthropic Serif", Georgia, "Times New Roman", serif` |
| System | `--font-system` | `system-ui, sans-serif` |
| Claude Response | `--font-claude-response` | `"Anthropic Serif", Georgia, "Times New Roman", serif` |
| User Message | `--font-user-message` | `"Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |

#### 字号层级
| 层级 | 尺寸 | 用途 |
|------|------|------|
| text-xs | 12px | 标签、小提示 |
| text-sm | 14px | 次要文字、按钮文字 |
| text-base | 16px | 正文、输入框 |
| text-lg | 18px | 段落标题 |
| text-xl | 20px | 小标题 |
| text-2xl | 24px | 副标题 |
| text-3xl | 30px | 二级标题 |
| text-4xl | 36px | 一级标题 |
| text-5xl | 48px | 大标题（Hero） |

#### 字重
| 名称 | 值 | 用途 |
|------|----|------|
| font-normal | 400 | 正文、次要文字 |
| font-medium | 500 | 按钮文字、强调文字 |
| font-semibold | 600 | 标题、重要信息 |
| font-bold | 700 | 主标题、CTA |

### 📐 间距系统（基于 4px 网格）

#### 基础间距
| 名称 | 尺寸 | 用途 |
|------|------|------|
| spacing-0 | 0px | 无间距 |
| spacing-0.5 | 2px | 微调间距 |
| spacing-1 | 4px | 最小间距 |
| spacing-1.5 | 6px | 组件内小间距 |
| spacing-2 | 8px | 组件内间距 |
| spacing-2.5 | 10px | 按钮左右内边距 |
| spacing-3 | 12px | 小卡片内边距 |
| spacing-4 | 16px | 标准内边距 |
| spacing-5 | 20px | 中等间距 |
| spacing-6 | 24px | 大间距 |
| spacing-8 | 32px | 区块间距 |
| spacing-10 | 40px | 大区块间距 |
| spacing-12 | 48px | 超大间距 |
| spacing-16 | 64px | 最大间距 |

#### 组件内边距
- **按钮**：`0px 10px`（高 32px，圆角 6px）
- **输入框**：`12px 16px`
- **卡片**：`16px` 或 `24px`
- **导航项**：`8px 12px`

#### 组件外边距
- **网格间隙**：`16px` 或 `24px`
- **区块间距**：`32px` 或 `48px`
- **页面边距**：`32px`（桌面端）

### 🎩 圆角与阴影

#### 圆角等级
| 名称 | 尺寸 | 用途 |
|------|------|------|
| rounded-none | 0px | 无圆角（导航栏） |
| rounded-sm | 2px | 极小圆角 |
| rounded-md | 6px | 按钮、输入框 |
| rounded-lg | 8px | 卡片、弹窗 |
| rounded-xl | 12px | 大卡片 |
| rounded-2xl | 16px | 特大卡片 |
| rounded-full | 9999px | 标签、圆形按钮 |

#### 阴影层级
从分析结果看，Claude UI 使用极简阴影，主要依赖`box-shadow: none`或极淡阴影。

### ✨ 动画与过渡

#### 过渡时长
| 名称 | 时长 | 用途 |
|------|------|------|
| duration-75 | 75ms | 微交互（按钮点击） |
| duration-100 | 100ms | 快速反馈 |
| duration-150 | 150ms | 标准过渡 |
| duration-200 | 200ms | 悬停效果 |
| duration-300 | 300ms | 主要过渡（页面切换） |
| duration-500 | 500ms | 慢动画（模态框） |

#### 缓动函数
- **标准缓动**：`cubic-bezier(0.4, 0, 0.2, 1)`（Material Design）
- **按钮缓动**：`cubic-bezier(0.165, 0.85, 0.45, 1)`（Claude 定制）
- **平滑缓动**：`ease-in-out`

---

## 🧩 组件规范

### 顶部导航栏

#### 结构
- **高度**：`1313px`（全高侧边栏）
- **宽度**：`288px`
- **背景色**：`--bg-100`（浅米色）
- **边框**：右侧 1px 边框 `--border-400`

#### 样式
- **Logo区域**：顶部 64px 高度，居中
- **菜单项**：14px 字重 430，行高 19.6px
- **内边距**：`8px 12px`
- **圆角**：6px（悬停时）
- **过渡**：`background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)`

#### 响应式
- **移动端**（< 768px）：
  - 宽度：100% 全屏
  - 位置：固定左侧
  - 可折叠
- **桌面端**（≥ 768px）：
  - 固定宽度 288px
  - 始终可见

### Hero 区域

#### 结构
- **主标题**："What can I help you with today?"
- **副标题**：个性化问候语（"Evening, [用户名]"）
- **输入区域**：大文本框

#### 样式
- **主标题**：
  - 字体：`--font-anthropic-serif`
  - 字号：40px
  - 字重：正常
  - 颜色：`--text-100`
- **副标题**：
  - 字体：`--font-anthropic-sans`
  - 字号：16px
  - 颜色：`--text-400`
- **输入框**：
  - 最小高度：96px
  - 边框：1px solid `--border-400`
  - 圆角：12px
  - 内边距：16px
  - 聚焦边框：2px solid `--accent-100`
  - 聚焦阴影：`0 0 0 3px rgba(--accent-100, 0.1)`

#### CTA 按钮
- **主要按钮**：背景 `--brand-000`，文字白色
- **次要按钮**：背景透明，边框 `--border-400`
- **悬停**：背景 `--brand-100`，过渡 0.3s

### 特性卡片

#### 布局
- **列数**：响应式（1/2/3/4 列）
- **间距**：16px 或 24px
- **对齐**：居中对齐

#### 样式
- **背景**：`--bg-000`
- **边框**：1px solid `--border-300`
- **圆角**：12px `--rounded-xl`
- **内边距**：24px
- **阴影**：极轻微或无边框

#### 内部元素
- **图标**：
  - 尺寸：24px × 24px
  - 颜色：`--accent-100`
- **标题**：
  - 字号：16px
  - 字重：500
  - 颜色：`--text-000`
- **描述**：
  - 字号：14px
  - 行高：20px
  - 颜色：`--text-400`
  - 间距：顶部 8px

### 按钮

#### 主要按钮（Primary）
```css
/* 基础样式 */
background-color: var(--brand-000);
color: var(--oncolor-100);
font-size: 14px;
font-weight: 430;
padding: 0px 10px;
height: 32px;
border-radius: 6px;
border: none;
transition: all 0.3s cubic-bezier(0.165, 0.85, 0.45, 1);

/* 悬停 */
background-color: var(--brand-100);
transform: scale(1.02);

/* 禁用 */
opacity: 0.5;
pointer-events: none;
```

#### 次要按钮（Secondary）
```css
/* 基础样式 */
background-color: transparent;
color: var(--text-000);
border: 1px solid var(--border-400);
padding: 0px 10px;
height: 32px;
border-radius: 6px;
transition: all 0.3s cubic-bezier(0.165, 0.85, 0.45, 1);

/* 悬停 */
background-color: var(--bg-300);
```

#### 文字按钮（Text）
```css
/* 基础样式 */
background-color: transparent;
color: var(--text-400);
border: none;
padding: 0px;
text-decoration: underline;
transition: color 0.15s;

/* 悬停 */
color: var(--text-000);
```

#### 图标按钮
```css
/* 基础样式 */
width: 32px;
height: 32px;
border-radius: 6px;
background-color: transparent;
transition: background-color 0.15s;

/* 悬停 */
background-color: var(--bg-300);
```

### 表单元素

#### 输入框（Input / Textarea）
```css
/* 基础样式 */
background-color: var(--bg-000);
border: 1px solid var(--border-400);
border-radius: 6px;
padding: 12px 16px;
font-size: 16px;
line-height: 24px;
color: var(--text-000);
font-family: var(--font-anthropic-sans);
transition: all 0.15s;

/* 占位符 */
::placeholder {
  color: var(--text-400);
}

/* 聚焦 */
border-color: var(--accent-100);
outline: 2px solid rgba(var(--accent-100-rgb), 0.3);
outline-offset: 2px;

/* 禁用 */
opacity: 0.5;
background-color: var(--bg-200);
```

#### 下拉框（Select）
- **边框**：1px solid `--border-400`
- **圆角**：6px
- **内边距**：12px 16px
- **背景**：`--bg-000`
- **箭头**：自定义 SVG，颜色 `--text-400`
- **选项**：悬停背景 `--bg-300`

#### 复选框（Checkbox）
- **尺寸**：16px × 16px
- **边框**：1px solid `--border-400`
- **圆角**：3px
- **背景**：`--bg-000`
- **选中**：背景 `--accent-100`，勾选白色
- **过渡**：all 0.15s

### 页脚

#### 布局
- **链接排列**：水平排列，响应式换行
- **间距**：链接之间 24px
- **对齐**：居中对齐

#### 样式
- **链接**：
  - 颜色：`--text-400`
  - 字号：14px
  - 悬停：`--text-000`
  - 过渡：color 0.15s
- **版权信息**：
  - 颜色：`--text-500`
  - 字号：12px
  - 间距：顶部 32px

#### 社交媒体图标
- **尺寸**：20px × 20px
- **颜色**：`--text-400`
- **悬停**：`--text-000`
- **间距**：8px

---

## 📱 响应式与自适应规则

### 断点阈值
| 设备 | 阈值 | 说明 |
|------|------|------|
| 移动端 | < 640px | 单列布局，全宽组件 |
| 平板 | 640px - 1024px | 两列布局，侧边栏可折叠 |
| 桌面 | 1024px - 1280px | 三列布局，固定侧边栏 |
| 大桌面 | 1280px - 1536px | 四列布局，宽屏适配 |
| 超大桌面 | > 1536px | 最大宽度限制，居中显示 |

### 不同屏幕下的布局变化

#### 移动端（< 640px）
- **导航栏**：
  - 全屏宽度
  - 固定位置
  - 默认隐藏，汉堡菜单触发
- **主内容**：
  - 单栏布局
  - 内边距：16px
  - Hero标题：32px
- **卡片**：
  - 单列显示
  - 全宽度
- **按钮**：
  - 全宽度（主要按钮）
  - 垂直堆叠

#### 平板（640px - 1024px）
- **导航栏**：
  - 宽度 256px
  - 可折叠
  - 半透明遮罩
- **主内容**：
  - 侧边栏+主内容布局
  - 内边距：24px
- **卡片**：
  - 两列网格
- **按钮**：
  - 自动宽度
  - 水平排列

#### 桌面端（> 1024px）
- **导航栏**：
  - 固定宽度 288px
  - 始终可见
  - 独立滚动
- **主内容**：
  - 最大宽度 1200px
  - 居中对齐
  - 内边距：32px
- **卡片**：
  - 三列或四列网格
- **按钮**：
  - 根据内容自动宽度
  - 水平排列，间距 12px

### 字体缩放
- **移动端**：
  - 主标题：32px
  - 正文：14px
  - 小字：12px
- **平板**：
  - 主标题：36px
  - 正文：16px
  - 小字：14px
- **桌面**：
  - 主标题：40px
  - 正文：16px
  - 小字：14px

### 间距缩放
- **移动端**：基础间距 4px，区块间距 16px
- **平板**：基础间距 8px，区块间距 24px
- **桌面**：基础间距 8px，区块间距 32px

---

## 🎯 使用说明

### TailwindCSS 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 品牌色
        brand: {
          0: 'hsl(15 54.2% 51.2%)',
          100: 'hsl(15 54.2% 51.2%)',
          200: 'hsl(15 63.1% 59.6%)',
          900: 'hsl(0 0% 0%)'
        },
        // 背景色
        bg: {
          0: 'hsl(0 0% 100%)',
          100: 'hsl(48 33.3% 97.1%)',
          200: 'hsl(53 28.6% 94.5%)',
          300: 'hsl(48 25% 92.2%)',
          400: 'hsl(50 20.7% 88.6%)',
          500: 'hsl(50 20.7% 88.6%)'
        },
        // 文字色
        text: {
          0: 'hsl(60 2.6% 7.6%)',
          100: 'hsl(60 2.6% 7.6%)',
          200: 'hsl(60 2.5% 23.3%)',
          300: 'hsl(60 2.5% 23.3%)',
          400: 'hsl(51 3.1% 43.7%)',
          500: 'hsl(51 3.1% 43.7%)'
        },
        // 边框色
        border: {
          100: 'hsl(30 3.3% 11.8%)',
          200: 'hsl(30 3.3% 11.8%)',
          300: 'hsl(30 3.3% 11.8%)',
          400: 'hsl(30 3.3% 11.8%)'
        },
        // 强调色
        accent: {
          100: 'hsl(210 70.9% 51.6%)',
          200: 'hsl(210 70.9% 51.6%)',
          900: 'hsl(211 72% 90%)'
        },
        // 状态色
        success: {
          0: 'hsl(125 100% 18%)',
          100: 'hsl(103 72.3% 26.9%)',
          200: 'hsl(103 72.3% 26.9%)',
          900: 'hsl(86 45.1% 90%)'
        },
        warning: {
          0: 'hsl(45 91.8% 19%)',
          100: 'hsl(39 88.8% 28%)',
          200: 'hsl(39 88.8% 28%)',
          900: 'hsl(38 65.9% 92%)'
        },
        danger: {
          0: 'hsl(0 58.6% 34.1%)',
          100: 'hsl(0 56.2% 45.4%)',
          200: 'hsl(0 56.2% 45.4%)',
          900: 'hsl(0 50% 95%)'
        },
        // 图标色
        pictogram: {
          100: 'hsl(50 20.7% 88.6%)',
          200: 'hsl(51 16.5% 84.5%)',
          300: 'hsl(0 0% 100%)',
          400: 'hsl(48 33.3% 97.1%)'
        }
      },
      fontFamily: {
        'anthropic-sans': ['"Anthropic Sans"', 'system-ui', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'anthropic-serif': ['"Anthropic Serif"', 'Georgia', '"Times New Roman"', 'serif'],
        'anthropic-mono': ['"Anthropic Mono"', 'ui-monospace', 'monospace']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px'
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px'
      },
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms'
      },
      transitionTimingFunction: {
        'claude': 'cubic-bezier(0.165, 0.85, 0.45, 1)',
        'material': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  }
}
```

### CSS 变量（原生支持）

```css
:root {
  /* 颜色 */
  --brand-000: hsl(15 54.2% 51.2%);
  --bg-100: hsl(48 33.3% 97.1%);
  --text-000: hsl(60 2.6% 7.6%);
  --border-400: hsl(30 3.3% 11.8%);
  --accent-100: hsl(210 70.9% 51.6%);
  
  /* 字体 */
  --font-sans-serif: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-serif: "Anthropic Serif", Georgia, "Times New Roman", serif;
  --font-mono: "Anthropic Mono", ui-monospace, monospace;
  
  /* 过渡 */
  --transition-claude: 0.3s cubic-bezier(0.165, 0.85, 0.45, 1);
}
```

### 组件开发规范

1. **必须使用设计令牌**：所有颜色、字体、间距必须使用 CSS 变量或 Tailwind 配置，不得硬编码
2. **响应式优先**：移动端优先设计，使用响应式前缀（sm:/md:/lg:）
3. **过渡动画**：所有交互元素必须有过渡动画，时长 150ms-300ms
4. **圆角规范**：按钮 6px，卡片 12px，小元素 6px，全圆角用 full
5. **字体使用**：标题用 serif，正文用 sans-serif，代码用 mono
6. **间距系统**：使用 4px 网格系统（2, 4, 8, 12, 16, 24, 32, 48, 64）
7. **状态管理**：提供 hover、focus、active、disabled 完整状态
8. **可访问性**：确保颜色对比度 ≥ 4.5:1，支持键盘导航

### 禁止事项

❌ 禁止使用硬编码颜色值（如 `#000`、`#fff`、`rgb(0,0,0)`）
❌ 禁止使用非标准字体栈
❌ 禁止跳过过渡动画
❌ 禁止混合使用不同圆角系统
❌ 禁止使用固定像素值进行布局（除边框外）

---

## 📊 技术参数汇总

- **页面背景**：`rgb(250, 249, 245)`（浅米色）
- **主文字色**：`rgb(20, 20, 19)`（深灰黑）
- **次要文字**：`rgb(61, 61, 58)`（中灰）
- **辅助文字**：`rgb(115, 114, 108)`（浅灰）
- **主品牌色**：`hsl(15 54.2% 51.2%)`（橙红色）
- **强调色**：`hsl(210 70.9% 51.6%)`（蓝色）
- **基础字号**：16px
- **基础行高**：24px（1.5）
- **按钮高度**：32px
- **输入框高度**：40px
- **导航栏宽度**：288px
- **主内容最大宽度**：1200px

## 多页面 MCP 操作规范

当使用 chrome-devtools-mcp 同时操作两个或以上页面时，必须遵守：

1. **每次执行脚本或截图前，先调用 `list_pages` 确认当前页面。**
2. **使用 `select_page` 显式切换到目标页面，禁止依赖“上次操作的页面”。**
3. **切换后立即用 `take_screenshot` 或 `evaluate_script('document.title')` 验证。**
4. **如果需要交替对比两个页面，每次切换都重复上述 1-3 步。**

---

*本规范文档根据实际页面分析生成，确保像素级复刻 Claude AI 官网样式。所有 AI 开发组件时必须严格遵循上述设计令牌。*
