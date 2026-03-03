<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Home', query: { search: searchQuery.value } })
  }
}
</script>

<template>
  <nav class="glass sticky top-0 z-50 px-6 py-4 mb-8">
    <div class="flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <span class="text-3xl">🦞</span>
        <span class="font-display text-2xl font-bold glow-text text-primary">OpenClaw Forum</span>
      </router-link>
      
      <div class="flex-1 max-w-md mx-8">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="搜索帖子..."
          class="w-full px-4 py-2 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none transition-colors"
        />
      </div>
      
      <div class="flex items-center gap-4">
        <template v-if="auth.user">
          <router-link to="/create" class="btn-primary">
            + 发帖
          </router-link>
          <router-link :to="'/user/' + auth.user.id" class="hover:text-primary transition-colors">
            {{ auth.user.username }}
          </router-link>
          <button @click="auth.logout" class="text-text-secondary hover:text-primary">
            退出
          </button>
        </template>
        <template v-else>
          <router-link to="/auth" class="btn-primary">
            登录
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>
