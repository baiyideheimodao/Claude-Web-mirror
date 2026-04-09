<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1a1a1a] flex flex-col transition-colors duration-200">
    <!-- 顶部导航 -->
    <header class="h-11 px-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-1.5 ml-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" @click="$router.push('/')">
          <rect width="22" height="22" x="1" y="1" rx="6" fill="#d97757"/>
          <path d="M7.8 16V9c0-.65.28-1.22.75-1.68C9 6.86 9.64 6.55 10.4 6.55h2.3c1.45 0 2.7 1.18 2.7 2.7 0 .67-.29 1.35-.78 1.83l-2.9 2.92h3.08V16H7.8z" fill="white"/>
        </svg>
        <span class="text-text-100 text-[15px] font-semibold tracking-tight cursor-pointer" @click="$router.push('/')">Claude</span>
      </div>
      <nav v-if="!isRegisterMode" class="hidden md:flex items-center gap-5 mr-2">
        <a href="#" class="text-[13px] text-[#5c5b58] hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white transition-colors">了解 Claude</a>
        <a href="#" class="text-[13px] text-[#5c5b58] hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white transition-colors">平台</a>
        <a href="#" class="text-[13px] text-[#5c5b58] hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white transition-colors">解决方案</a>
        <a href="#" class="text-[13px] text-[#5c5b58] hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white transition-colors">价格</a>
        <a href="#" class="text-[13px] text-[#5c5b58] hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white transition-colors">资源</a>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="flex-1 flex items-start justify-center pt-12 md:pt-20 px-4">
      <div class="w-full max-w-[420px]">
        <!-- 标题区域（仅登录模式显示） -->
        <div v-if="!isRegisterMode" class="text-center mb-8">
          <h1 class="text-[32px] font-serif text-[#1a1a1a] dark:text-white leading-tight mb-2">
            思维敏捷，<br>构建更快
          </h1>
          <p class="text-[14px] text-[#787774] dark:text-gray-400">在 Claude 中头脑风暴，在 Cowork 中构建</p>
        </div>

        <!-- 登录/注册卡片 -->
        <div class="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-claude-lg border border-[#e5e5e4]/70 dark:border-white/10 p-6">
          <!-- 注册模式的返回按钮 -->
          <div v-if="isRegisterMode" class="mb-4">
            <button
              class="flex items-center gap-1 text-[13px] text-[#5c5b58] dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
              @click="isRegisterMode = false; errorMessage = ''"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              返回登录
            </button>
          </div>

          <!-- ========== 登录模式 ========== -->
          <template v-if="!isRegisterMode">
            <!-- 邮箱登录入口 -->
            <div v-if="loginStep === 'email'">
              <!-- 邮箱输入 -->
              <input
                ref="emailInputRef"
                v-model="email"
                type="email"
                class="w-full px-3 py-2.5 bg-transparent border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] focus:outline-none focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]/20 transition-all mb-3"
                placeholder="输入您的邮箱"
                @keydown.enter="handleEmailNext"
              />

              <!-- 继续按钮 -->
              <button
                :disabled="!email || isSubmitting"
                class="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[14px] font-medium"
                @click="handleEmailNext"
              >
                {{ isSubmitting ? '处理中...' : '使用邮箱继续' }}
              </button>

              <!-- 提示文字 -->
              <p class="mt-4 text-[11px] text-[#9b9a97] dark:text-gray-500 leading-relaxed">
                继续即表示您同意 Anthropic 的
                <a href="#" class="underline hover:text-[#5c5b58]">服务条款</a>、
                <a href="#" class="underline hover:text-[#5c5b58]">隐私政策</a>，
                并同意接收产品更新和营销邮件。
              </p>

              <!-- 切换到注册 -->
              <p class="mt-6 text-center text-[13px] text-[#5c5b58] dark:text-gray-400">
                没有账号？
                <button class="font-medium text-[#1a1a1a] dark:text-white hover:underline" @click="switchToRegister">注册</button>
              </p>
            </div>

            <!-- 密码输入步骤 -->
            <div v-else-if="loginStep === 'password'">
              <p class="text-[14px] text-[#1a1a1a] dark:text-white mb-4">{{ email }}</p>

              <input
                ref="passwordInputRef"
                v-model="password"
                type="password"
                autofocus
                class="w-full px-3 py-2.5 bg-transparent border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] focus:outline-none focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]/20 transition-all mb-3"
                placeholder="输入密码"
                @keydown.enter="handleLogin"
              />

              <p v-if="errorMessage" class="mb-3 text-[13px] text-red-500">{{ errorMessage }}</p>

              <button
                :disabled="!password || isSubmitting"
                class="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[14px] font-medium mb-2"
                @click="handleLogin"
              >
                {{ isSubmitting ? '登录中...' : '继续' }}
              </button>

              <button
                class="w-full py-2.5 text-[13px] text-[#d97757] hover:underline"
                @click="handleForgotPassword"
              >
                忘记密码？
              </button>

              <div class="flex items-center gap-3 my-4">
                <div class="flex-1 h-px bg-[#e5e5e4] dark:border-white/10"></div>
                <span class="text-[12px] text-[#9b9a97] dark:text-gray-500">或</span>
                <div class="flex-1 h-px bg-[#e5e5e4] dark:border-white/10"></div>
              </div>

              <button
                class="w-full py-2.5 px-4 bg-white dark:bg-[#333] border border-[#e0e0df] dark:border-white/10 rounded-lg flex items-center justify-center gap-2.5 hover:bg-[#fafafa] dark:hover:bg-[#3a3a3a] transition-colors duration-150"
                @click="switchToRegister"
              >
                <span class="text-[14px] font-medium text-[#1a1a1a] dark:text-white">创建账号</span>
              </button>
            </div>
          </template>

          <!-- ========== 注册模式 ========== -->
          <template v-else>
            <h2 class="text-xl font-semibold text-[#1a1a1a] dark:text-white mb-1">创建您的账号</h2>
            <p class="text-[13px] text-[#9b9a97] dark:text-gray-500 mb-5">加入 Claude Mirror，开始智能对话</p>

            <div class="space-y-3">
              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">用户名</label>
                <input
                  v-model="registerForm.username"
                  type="text"
                  class="auth-input"
                  placeholder="选择用户名"
                  autocomplete="username"
                />
              </div>
              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">邮箱地址</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  class="auth-input"
                  placeholder="name@example.com"
                  autocomplete="email"
                />
              </div>
              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">密码</label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  class="auth-input"
                  placeholder="至少8位字符"
                  autocomplete="new-password"
                />
              </div>

              <p v-if="errorMessage" class="text-[13px] text-red-500">{{ errorMessage }}</p>

              <button
                :disabled="!isRegisterValid || isSubmitting"
                class="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 text-[14px] font-medium mt-1"
                @click="handleRegister"
              >
                {{ isSubmitting ? '创建中...' : '创建账号' }}
              </button>

              <p class="mt-4 text-[11px] text-[#9b9a97] dark:text-gray-500 leading-relaxed">
                点击「创建账号」即表示您同意我们的
                <a href="#" class="underline hover:text-[#5c5b58]">服务条款</a> 和
                <a href="#" class="underline hover:text-[#5c5b58]">隐私政策</a>。
              </p>

              <p class="text-center text-[13px] text-[#5c5b58] dark:text-gray-400 pt-2">
                已有账号？
                <button class="font-medium text-[#1a1a1a] dark:text-white hover:underline" @click="isRegisterMode = false; errorMessage = ''; loginStep = 'email'; email = ''">登录</button>
              </p>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'

const router = useRouter()
const appStore = useAppStore()

// 登录流程：email -> password 两步式
type LoginStep = 'email' | 'password'
const loginStep = ref<LoginStep>('email')
const isRegisterMode = ref(false)

// 表单数据
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const registerForm = ref({
  username: '',
  email: '',
  password: ''
})

const emailInputRef = ref<HTMLInputElement | null>(null)
const passwordInputRef = ref<HTMLInputElement | null>(null)

// 页面加载后自动聚焦邮箱输入框
onMounted(() => {
  emailInputRef.value?.focus()
})

const isRegisterValid = computed(() => {
  const f = registerForm.value
  return f.username && f.email && f.password && f.password.length >= 8 && f.email.includes('@')
})

/** 输入邮箱后进入密码输入 */
const handleEmailNext = async () => {
  if (!email.value || isSubmitting.value) return
  // 简单校验邮箱格式
  if (!email.value.includes('@') || !email.value.includes('.')) {
    errorMessage.value = '请输入有效的邮箱地址'
    return
  }
  errorMessage.value = ''
  loginStep.value = 'password'
  await nextTick()
  passwordInputRef.value?.focus()
}

/** 执行登录 */
const handleLogin = async () => {
  if (!email.value || !password.value || isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // 直接传邮箱作为 username，后端支持邮箱或用户名登录
    const result = await appStore.login(email.value, password.value)
    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message || '登录失败，请检查邮箱和密码'
    }
  } catch (e: any) {
    errorMessage.value = e.message || '登录失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}

/** 执行注册 */
const handleRegister = async () => {
  const f = registerForm.value
  if (!isRegisterValid.value || isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await appStore.register({
      username: f.username,
      email: f.email,
      password: f.password
    })
    if (result.success) {
      // 注册成功，store 已保存 token 和用户信息，直接跳转首页
      router.push('/')
    } else {
      errorMessage.value = result.message || '注册失败'
    }
  } catch (e: any) {
    errorMessage.value = e.message || '注册失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}

/** 切换到注册 */
const switchToRegister = () => {
  isRegisterMode.value = true
  errorMessage.value = ''
  registerForm.value = {
    username: '',
    email: email.value || '',
    password: ''
  }
}

/** 忘记密码 */
const handleForgotPassword = async () => {
  if (!email.value) {
    errorMessage.value = '请先输入邮箱'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const result = await appStore.forgotPassword(email.value)
    if (result.success) {
      errorMessage.value = '重置密码邮件已发送，请检查您的邮箱'
    } else {
      errorMessage.value = result.message || '操作失败'
    }
  } catch (e: any) {
    errorMessage.value = e.message || '操作失败'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-input {
  @apply w-full px-3 py-2.5 bg-transparent border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white placeholder-[#9b9a97] focus:outline-none focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]/20 transition-all;
}
</style>
