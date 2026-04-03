# Claude 官网镜像

基于 Claude AI 官网 (https://claude.ai/new) 的像素级复刻项目，使用 Vue 3 + TypeScript + TailwindCSS 构建。

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 8.0 或更高版本

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```
打开浏览器访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint      # ESLint 检查
npm run format    # Prettier 格式化
```

## 📁 项目结构

```
claude-web-mirror/
├── src/
│   ├── assets/           # 静态资源（图片、字体等）
│   ├── components/       # 通用组件
│   │   ├── ui/          # 基础UI组件（Button, Input等）
│   │   ├── cards/       # 卡片组件
│   │   └── layout/      # 布局组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 页面布局
│   ├── modules/         # 业务模块
│   │   └── home/        # 首页模块
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 样式文件
│   │   ├── design-tokens.css  # 设计令牌（CSS变量）
│   │   └── main.css     # 主样式文件
│   ├── utils/           # 工具函数
│   ├── views/           # 页面视图
│   └── main.ts          # 应用入口
├── .env.example         # 环境变量示例
├── tailwind.config.js   # Tailwind 配置
├── vite.config.ts       # Vite 配置
└── package.json         # 项目配置
```

## 🎨 设计规范

本项目严格遵循 Claude 官网的设计系统：

### 设计令牌
所有样式必须使用设计令牌，禁止硬编码值：

- **颜色系统**：使用 `bg-*`, `text-*`, `brand-*`, `border-*` 等类名
- **字体系统**：使用 `font-sans`, `font-serif`, `font-mono` 等类名
- **间距系统**：基于 4px 网格，使用 Tailwind 间距类
- **圆角系统**：使用 `rounded-*` 类名
- **阴影系统**：使用 `shadow-claude-*` 类名

### 组件规范
所有组件开发必须遵循以下规范：

1. 使用 Composition API 和 `<script setup>` 语法
2. 使用 TypeScript 严格模式
3. 遵循组件命名规范（PascalCase）
4. 使用设计令牌，禁止硬编码样式值
5. 实现完整的响应式适配

### 响应式断点
- **移动端** (< 640px): 单列布局
- **平板** (640px - 1024px): 两列布局
- **桌面端** (> 1024px): 三列布局

## 📚 开发指南

### 创建新组件
```bash
# 在 src/components 下创建新组件
# 组件命名使用 PascalCase，如：UserProfile.vue
```

### 使用设计令牌
```vue
<template>
  <button class="bg-brand-0 text-white px-4 py-2 rounded-md">
    按钮
  </button>
</template>
```

### 添加新页面
1. 在 `src/views` 下创建 Vue 组件
2. 在 `src/main.ts` 中添加路由配置
3. 更新导航菜单（如果需要）

### 环境变量配置
1. 复制 `.env.example` 为 `.env.local`
2. 填写实际的环境变量值
3. 在代码中通过 `import.meta.env.VITE_*` 访问

## 🔧 技术栈

- **前端框架**: Vue 3.3+ (Composition API)
- **构建工具**: Vite 5+
- **开发语言**: TypeScript 5+
- **样式框架**: TailwindCSS 3+
- **状态管理**: Pinia 2+
- **路由管理**: Vue Router 4+
- **代码规范**: ESLint + Prettier
- **HTTP 客户端**: axios

## 📱 功能特性

### 已实现功能
- [x] 像素级复刻 Claude 官网 UI
- [x] 响应式设计（移动端/平板/桌面端）
- [x] 设计令牌系统（颜色、字体、间距等）
- [x] 基础组件库（按钮、输入框、卡片等）
- [x] 导航系统（侧边栏、移动端适配）
- [x] 聊天界面布局
- [x] 特性卡片展示

### 待实现功能
- [ ] 完整的聊天功能
- [ ] 文件上传功能
- [ ] 深色模式切换
- [ ] 用户认证系统
- [ ] API 集成

## 📄 相关文档

- [开发规范](./开发规范.md) - 详细代码规范和项目约定
- [样式规范](./CLAUDE_AI_STYLE_GUIDE.md) - 完整的设计令牌和组件规范
- [API 文档](./docs/api.md) - API 接口文档

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目仅供学习和研究使用，请勿用于商业用途。

## 🙏 致谢

- Claude AI 官网 (https://claude.ai) 提供设计参考
- Vue.js 团队提供优秀的前端框架
- TailwindCSS 团队提供强大的样式工具