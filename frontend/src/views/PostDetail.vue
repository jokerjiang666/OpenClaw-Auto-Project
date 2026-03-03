<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { usePostsStore } from '../stores/posts'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const route = useRoute()
const posts = usePostsStore()
const auth = useAuthStore()
const newComment = ref('')
const post = ref<any>(null)

onMounted(async () => {
  post.value = await posts.fetchPost(Number(route.params.id))
})

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked(post.value.content)
})

const handleLike = async () => {
  await posts.likePost(Number(route.params.id))
  post.value = await posts.fetchPost(Number(route.params.id))
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  await axios.post('/comments', {
    content: newComment.value,
    postId: route.params.id
  })
  newComment.value = ''
  post.value = await posts.fetchPost(Number(route.params.id))
}
</script>

<template>
  <div v-if="post" class="max-w-4xl mx-auto">
    <!-- Post content -->
    <article class="card mb-8">
      <header class="mb-6">
        <h1 class="font-display text-3xl font-bold mb-4 glow-text text-primary">
          {{ post.title }}
        </h1>
        <div class="flex items-center gap-4 text-text-secondary">
          <router-link :to="'/user/' + post.author?.id" class="hover:text-primary">
            {{ post.author?.username }}
          </router-link>
          <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          <span class="px-2 py-1 rounded bg-elevated text-primary text-sm">
            {{ post.category }}
          </span>
        </div>
      </header>
      
      <div class="markdown-body" v-html="renderedContent"></div>
      
      <footer class="mt-8 pt-6 border-t border-border flex items-center gap-6">
        <button @click="handleLike" class="flex items-center gap-2 hover:text-primary transition-colors">
          <span class="text-2xl">❤️</span>
          <span>{{ post.likes || 0 }}</span>
        </button>
        <span class="flex items-center gap-2">
          <span>👁</span> {{ post.views || 0 }}
        </span>
      </footer>
    </article>

    <!-- Comments -->
    <section class="card">
      <h2 class="font-display text-xl font-bold mb-6">💬 评论 ({{ post.comments?.length || 0 }})</h2>
      
      <!-- Comment form -->
      <div v-if="auth.user" class="mb-6">
        <textarea
          v-model="newComment"
          placeholder="写下你的评论..."
          class="w-full p-4 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none resize-none"
          rows="3"
        ></textarea>
        <button @click="submitComment" class="btn-primary mt-2">
          发表评论
        </button>
      </div>
      <div v-else class="mb-6 text-text-secondary">
        <router-link to="/auth" class="text-primary hover:underline">登录</router-link> 后参与讨论
      </div>

      <!-- Comments list -->
      <div class="space-y-4">
        <div
          v-for="comment in post.comments"
          :key="comment.id"
          class="p-4 rounded-lg bg-elevated"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="text-primary font-medium">{{ comment.author?.username }}</span>
            <span class="text-text-muted text-sm">
              {{ new Date(comment.createdAt).toLocaleDateString() }}
            </span>
          </div>
          <p class="text-text-secondary">{{ comment.content }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
