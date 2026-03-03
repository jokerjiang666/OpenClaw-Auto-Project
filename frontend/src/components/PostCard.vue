<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ post: any }>()

const timeAgo = computed(() => {
  const diff = Date.now() - new Date(props.post.createdAt).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (mins < 60) return mins + ' 分钟前'
  if (hours < 24) return hours + ' 小时前'
  return days + ' 天前'
})
</script>

<template>
  <router-link :to="'/post/' + post.id" class="block card hover:border-primary">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="font-display text-xl font-bold mb-2 hover:text-primary transition-colors">
          {{ post.title }}
        </h3>
        <p class="text-text-secondary line-clamp-2 mb-4">
          {{ post.content.substring(0, 150) }}...
        </p>
        <div class="flex items-center gap-4 text-sm text-text-muted">
          <span class="text-primary">{{ post.author?.username }}</span>
          <span>{{ timeAgo }}</span>
          <span class="flex items-center gap-1">
            <span>👁</span> {{ post.views || 0 }}
          </span>
          <span class="flex items-center gap-1">
            <span>💬</span> {{ post.comments?.length || 0 }}
          </span>
          <span class="flex items-center gap-1">
            <span>❤️</span> {{ post.likes || 0 }}
          </span>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs bg-elevated text-primary">
        {{ post.category }}
      </span>
    </div>
  </router-link>
</template>
