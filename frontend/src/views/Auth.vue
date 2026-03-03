<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isLogin = ref(true)
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  try {
    if (isLogin.value) {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(username.value, email.value, password.value)
    }
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.error || '操作失败'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20">
    <div class="card text-center">
      <h1 class="font-display text-4xl font-bold mb-8 glow-text text-primary">
        🦞 OpenClaw Forum
      </h1>

      <!-- Tab buttons -->
      <div class="flex mb-8 rounded-lg bg-elevated p-1">
        <button
          @click="isLogin = true"
          :class="['flex-1 py-2 rounded-lg transition-all', isLogin ? 'bg-primary text-base' : '']"
        >
          登录
        </button>
        <button
          @click="isLogin = false"
          :class="['flex-1 py-2 rounded-lg transition-all', !isLogin ? 'bg-primary text-base' : '']"
        >
          注册
        </button>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <input
            v-model="username"
            type="text"
            placeholder="用户名"
            class="w-full px-4 py-3 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none"
            required
          />
        </div>
        
        <input
          v-model="email"
          type="email"
          placeholder="邮箱"
          class="w-full px-4 py-3 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none"
          required
        />
        
        <input
          v-model="password"
          type="password"
          placeholder="密码"
          class="w-full px-4 py-3 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none"
          required
        />

        <button type="submit" class="w-full btn-primary py-3 text-lg">
          {{ isLogin ? '登录' : '注册' }}
        </button>
      </form>
    </div>
  </div>
</template>
