<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import PostCard from '../components/PostCard.vue'

const route = useRoute()
const posts = usePostsStore()
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术' },
  { id: 'qna', name: '问答' },
  { id: 'share', name: '分享' },
  { id: 'chat', name: '闲聊' }
]

onMounted(async () => {
  await loadPosts()
})

watch(() => route.query.search, async () => {
  await loadPosts()
})

const loadPosts = async () => {
  const params: any = {}
  if (activeCategory.value !== 'all') params.category = activeCategory.value
  if (route.query.search) params.search = route.query.search
  await posts.fetchPosts(params)
}

const setCategory = (cat: string) => {
  activeCategory.value = cat
  loadPosts()
}
</script>

<template>
  <div>
    <!-- Category tabs -->
    <div class="glass mb-8 p-4 flex gap-4">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="setCategory(cat.id)"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          activeCategory === cat.id 
            ? 'bg-primary text-base glow' 
            : 'hover:bg-elevated'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Posts list -->
    <div v-if="posts.loading" class="text-center py-12">
      <div class="text-primary text-xl animate-pulse">加载中...</div>
    </div>

    <div v-else-if="posts.posts.length === 0" class="text-center py-12">
      <div class="text-text-secondary">暂无帖子</div>
    </div>

    <div v-else class="space-y-4">
      <PostCard
        v-for="post in posts.posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- Floating create button -->
    <router-link
      to="/create"
      class="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-base text-2xl font-bold glow hover:scale-110 transition-transform"
    >
      +
    </router-link>
  </div>
</template>
