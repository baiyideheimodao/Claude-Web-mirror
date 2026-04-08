<template>
  <div class="min-h-screen bg-[#f9f8f5] dark:bg-[#1a1a1a] text-text-100" :class="{ 'dark': appStore.isDarkMode }">
    <AppNavigation @sidebar-change="onSidebarChange" />

    <main :class="['min-h-screen transition-all duration-200 ease-in-out', isCollapsed ? 'ml-[48px]' : 'ml-[260px]']">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-8">
        <h1 class="text-xl font-semibold text-[#1a1a1a] dark:text-white mb-6">设置</h1>

        <div class="flex gap-8">
          <!-- 左侧菜单 -->
          <nav class="w-48 shrink-0">
            <ul class="space-y-0.5">
              <li v-for="item in menuItems" :key="item.key">
                <button
                  :class="['w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors', activeSection === item.key ? 'bg-[#1a1a1a] text-white' : 'text-[#5c5b58] hover:bg-black/[0.04] dark:hover:bg-white/5']"
                  @click="activeSection = item.key"
                >{{ item.label }}</button>
              </li>
            </ul>
          </nav>

          <!-- 右侧内容区 -->
          <div class="flex-1 min-w-0">
            <!-- General / Profile -->
            <section v-if="activeSection === 'general'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white">个人资料</h2>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">姓名</label>
                  <input v-model="profileForm.displayName" type="text" class="settings-input" />
                </div>
                <div>
                  <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">Claude 如何称呼您？</label>
                  <input v-model="profileForm.nickname" type="text" class="settings-input" />
                </div>
              </div>

              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">您从事什么工作？</label>
                <select v-model="profileForm.workFunction" class="settings-input">
                  <option value="">选择职业方向</option>
                  <option>软件工程</option>
                  <option>数据科学</option>
                  <option>产品管理</option>
                  <option>设计</option>
                  <option>市场营销</option>
                  <option>学生</option>
                  <option>其他</option>
                </select>
              </div>

              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-1">Claude 在回复时应考虑哪些偏好？</label>
                <p class="text-[12px] text-[#9b9a97] dark:text-gray-500 mb-2">您的偏好将应用于所有对话，需符合使用规范。</p>
                <textarea v-model="profileForm.preferences" rows="3" class="settings-input resize-none" placeholder="例如：学习新概念时，用类比特别有帮助"></textarea>
              </div>

              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white pt-4 border-t border-[#e5e5e4] dark:border-white/10">通知</h2>

              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-[13px] font-medium text-[#1a1a1a] dark:text-white">回复完成</p>
                  <p class="text-[12px] text-[#9b9a97] dark:text-gray-500">Claude 完成回复时通知您。对工具调用、研究和代码等长时间任务特别有用。</p>
                </div>
                <label class="relative inline-flex cursor-pointer">
                  <input type="checkbox" v-model="notifications.responseComplete" class="sr-only peer" />
                  <div class="w-9 h-5 bg-[#e0e0df] peer-checked:bg-[#d97757] rounded-full peer-focus:ring-2 peer-focus:ring-[#d97757]/30 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
              </div>

              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-[13px] font-medium text-[#1a1a1a] dark:text-white">网页版 Claude Code 邮件</p>
                  <p class="text-[12px] text-[#9b9a97] dark:text-gray-500">网页版 Claude Code 构建完成或需要您响应时发送邮件。</p>
                </div>
                <label class="relative inline-flex cursor-pointer">
                  <input type="checkbox" v-model="notifications.emailCode" class="sr-only peer" />
                  <div class="w-9 h-5 bg-[#e0e0df] peer-checked:bg-[#d97757] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
              </div>

              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white pt-4 border-t border-[#e5e5e4] dark:border-white/10">外观</h2>

              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-2">颜色模式</label>
                <div class="flex gap-3">
                  <button
                    v-for="mode in colorModes" :key="mode.value"
                    :class="['flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[80px]', appStore.theme === mode.value ? 'border-[#d97757] bg-[#fef8f5]' : 'border-[#e5e5e4] hover:border-[#cfcfce]']"
                    @click="appStore.setTheme(mode.value)"
                  >
                    <div :class="['w-full aspect-[4/3] rounded-lg border', mode.bgClass]"></div>
                    <span class="text-[12px] font-medium" :class="appStore.theme === mode.value ? 'text-[#d97757]' : 'text-[#5c5b58]'">{{ mode.label }}</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[13px] font-medium text-[#5c5b58] dark:text-gray-400 mb-2">背景动画</label>
                <div class="flex gap-3">
                  <button
                    v-for="anim in animOptions" :key="anim.value"
                    :class="['flex flex-col items-center gap-2 p-3 rounded-xl border-2 min-w-[80px]', backgroundAnimation === anim.value ? 'border-[#d97757] bg-[#fef8f5]' : 'border-[#e5e5e4] hover:border-[#cfcfce]']"
                    @click="backgroundAnimation = anim.value"
                  >
                    <div :class="['w-full aspect-[4/3] rounded-lg flex items-center justify-center', anim.bgClass]">
                      <span v-if="anim.dots" class="flex gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#d97757]/40 animate-pulse"></span>
                        <span class="w-1.5 h-1.5 rounded-full bg-[#d97757]/60 animate-pulse" style="animation-delay:150ms"></span>
                        <span class="w-1.5 h-1.5 rounded-full bg-[#d97757] animate-pulse" style="animation-delay:300ms"></span>
                      </span>
                    </div>
                    <span class="text-[12px] font-medium" :class="backgroundAnimation === anim.value ? 'text-[#d97757]' : 'text-[#5c5b58]'">{{ anim.label }}</span>
                  </button>
                </div>
              </div>

              <button class="px-4 py-2 bg-[#d97757] hover:bg-[#c96a4a] text-white rounded-lg text-[13px] font-medium mt-4" @click="saveProfile">保存更改</button>
            </section>

            <!-- Account -->
            <section v-else-if="activeSection === 'account'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white">账号</h2>
              <div class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg p-4">
                <p class="text-[13px] text-[#5c5b58] dark:text-gray-400">用户名：<strong class="text-[#1a1a1a] dark:text-white">{{ appStore.user?.username || '-' }}</strong></p>
                <p class="text-[13px] text-[#5c5b58] dark:text-gray-400 mt-1">邮箱：<strong class="text-[#1a1a1a] dark:text-white">{{ appStore.user?.email || '-' }}</strong></p>
              </div>
            </section>

            <!-- Privacy -->
            <section v-else-if="activeSection === 'privacy'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white">隐私与数据</h2>
              <p class="text-[13px] text-[#787774] dark:text-gray-400">管理您的隐私设置和数据偏好。</p>
            </section>

            <!-- Billing -->
            <section v-else-if="activeSection === 'billing'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white">账单</h2>
              <div v-if="appStore.plans.length" class="space-y-3">
                <div v-for="plan in appStore.plans" :key="plan.id" class="bg-white dark:bg-[#2a2a2a] border border-[#e5e5e4] dark:border-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p class="text-[14px] font-medium text-[#1a1a1a] dark:text-white">{{ plan.name }}</p>
                    <p class="text-[12px] text-[#9b9a97] dark:text-gray-500">{{ plan.description }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[16px] font-semibold text-[#1a1a1a] dark:text-white">${{ plan.price }}/{{ plan.duration_days }}d</p>
                    <button class="mt-1 px-3 py-1 bg-[#d97757] text-white rounded text-[12px]" @click="handleBuyPlan(plan)">升级</button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Usage -->
            <section v-else-if="activeSection === 'usage'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white">使用统计</h2>
              <p class="text-[13px] text-[#787774] dark:text-gray-400">查看您的 API 使用和对话统计。</p>
            </section>

            <!-- Connectors -->
            <section v-else-if="activeSection === 'connectors'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white">连接器</h2>
              <p class="text-[13px] text-[#787774] dark:text-gray-400">连接外部服务和集成。</p>
            </section>

            <!-- Claude Code -->
            <section v-else-if="activeSection === 'claude-code'" class="space-y-6">
              <h2 class="text-base font-semibold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                Claude Code
                <span class="px-1.5 py-0.5 bg-[#1a1a1a] text-white text-[10px] rounded font-bold">New</span>
              </h2>
              <p class="text-[13px] text-[#787774] dark:text-gray-400">配置 Claude Code 设置和集成。</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import { useAppStore } from '@/stores/useAppStore'
import { userApi } from '@/api/user'

const appStore = useAppStore()
const isCollapsed = ref(false)
const activeSection = ref('general')
const backgroundAnimation = ref('enabled')

const profileForm = ref({
  displayName: '',
  nickname: '',
  workFunction: '',
  preferences: ''
})

const notifications = ref({
  responseComplete: false,
  emailCode: false
})

const menuItems = [
  { key: 'general', label: '通用' },
  { key: 'account', label: '账号' },
  { key: 'privacy', label: '隐私' },
  { key: 'billing', label: '账单' },
  { key: 'usage', label: '使用量' },
  { key: 'connectors', label: '连接器' },
  { key: 'claude-code', label: 'Claude Code' },
]

const colorModes = [
  { value: 'light', label: '浅色', bgClass: 'bg-white' },
  { value: 'system', label: '自动', bgClass: 'bg-gradient-to-br from-white to-gray-200' },
  { value: 'dark', label: '深色', bgClass: 'bg-[#1a1a1a]' },
]

const animOptions = [
  { value: 'enabled', label: '启用', dots: true, bgClass: 'bg-[#f9f8f5] dark:bg-[#2a2a2a]' },
  { value: 'auto', label: '自动', dots: true, bgClass: 'bg-[#f9f8f5]' },
  { value: 'disabled', label: '禁用', dots: false, bgClass: 'bg-[#f9f8f5] dark:bg-[#2a2a2a]' },
]

const onSidebarChange = (collapsed: boolean) => { isCollapsed.value = collapsed }

const saveProfile = async () => {
  await appStore.updateUserProfile({
    username: profileForm.value.displayName,
  })
  // show success feedback
}

const handleBuyPlan = async (plan: any) => {
  const res = await userApi.buyPlan(plan.id)
  if (res.success) alert('购买成功！')
}
</script>

<style scoped>
.settings-input {
  @apply w-full px-3 py-2 border border-[#e0e0df] dark:border-white/10 rounded-lg text-[14px] text-[#1a1a1a] dark:text-white bg-white dark:bg-[#2a2a2a] focus:outline-none focus:border-[#d97757];
}
</style>
