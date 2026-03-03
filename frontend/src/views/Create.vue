<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import { usePostsStore } from '../stores/posts'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const posts = usePostsStore()
const auth = useAuthStore()

const title = ref('')
const content = ref('')
const category = ref('tech')
const preview = ref(false)

const categories = [
  { id: 'tech', name: '技术' },
  { id: 'qna', name: '问答' },
  { id: 'share', name: '分享' },
  { id: 'chat', name: '闲聊' }
]

const renderedPreview = () => {
  return marked(content.value)
}

const submit = async () => {
  if (!title.value.trim() || !content.value.trim()) return
  
  const post = await posts.createPost({
    title: title.value,
    content: content.value,
    category: category.value
  })
  
  router.push('/post/' + post.id)
}
</script>

<template>
  <div v-if="!auth.user" class="text-center py-12">
    <p class="text-text-secondary mb-4">请先登录</p>
    <router-link to="/auth" class="btn-primary">去登录</router-link>
  </div>

  <div v-else class="max-w-4xl mx-auto">
    <h1 class="font-display text-3xl font-bold mb-8 text-primary">发帖</h1>
    
    <div class="card">
      <!-- Title -->
      <div class="mb-6">
        <label class="block text-text-secondary mb-2">标题</label>
        <input
          v-model="title"
          type="text"
          placeholder="输入标题..."
          class="w-full px-4 py-3 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none text-lg"
        />
      </div>

      <!-- Category -->
      <div class="mb-6">
        <label class="block text-text-secondary mb-2">分类</label>
        <div class="flex gap-2">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="category = cat.id"
            :class="[
              'px-4 py-2 rounded-lg transition-all',
              category === cat.id 
                ? 'bg-primary text-base' 
                : 'bg-elevated hover:bg-surface'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <label class="text-text-secondary">内容 (支持 Markdown)</label>
          <button
            @click="preview = !preview"
            class="text-primary text-sm hover:underline"
          >
            {{ preview ? '编辑' : '预览' }}
          </button>
        </div>
        
        <textarea
          v-if="!preview"
          v-model="content"
          placeholder="支持 Markdown 格式..."
          class="w-full p-4 rounded-lg bg-elevated border border-border focus:border-primary focus:outline-none font-mono"
          rows="15"
        ></textarea>
        
        <div
          v-else
          class="markdown-body p-4 rounded-lg bg-elevated border border-border min-h-[400px]"
          v-html="renderedPreview()"
        ></div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <router-link to="/" class="px-6 py-2 rounded-lg bg-elevated hover:bg-surface transition-colors">
          取消
        </router-link>
        <button @click="submit" class="btn-primary">
          发布帖子
        </button>
      </div>
    </div>
  </div>
</template>
