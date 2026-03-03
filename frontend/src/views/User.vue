<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const user = ref<any>(null)
const posts = ref<any[]>([])

onMounted(async () => {
  const res = await axios.get('/auth/me')
  user.value = res.data
  const postsRes = await axios.get('/posts', { params: { authorId: route.params.id } })
  posts.value = postsRes.data.posts
})
</script>

<template>
  <div v-if="user" class="max-w-4xl mx-auto">
    <div class="card mb-8">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl text-base font-bold">
          {{ user.username?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="font-display text-2xl font-bold text-primary">{{ user.username }}</h1>
          <p class="text-text-secondary">{{ user.email }}</p>
          <p class="text-text-muted text-sm">
            注册于 {{ new Date(user.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <h2 class="font-display text-xl font-bold mb-4">📝 发帖历史</h2>
    <div class="space-y-4">
      <router-link
        v-for="post in posts"
        :key="post.id"
        :to="'/post/' + post.id"
        class="card block hover:border-primary"
      >
        <h3 class="font-bold text-lg mb-2">{{ post.title }}</h3>
        <p class="text-text-secondary text-sm">
          {{ new Date(post.createdAt).toLocaleDateString() }} · {{ post.views || 0 }} 浏览
        </p>
      </router-link>
    </div>
  </div>
</template>
