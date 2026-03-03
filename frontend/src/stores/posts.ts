import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<any[]>([])
  const currentPost = ref<any>(null)
  const loading = ref(false)

  const fetchPosts = async (params = {}) => {
    loading.value = true
    const res = await axios.get('/posts', { params })
    posts.value = res.data.posts
    loading.value = false
    return res.data
  }

  const fetchPost = async (id: number) => {
    loading.value = true
    const res = await axios.get('/posts/' + id)
    currentPost.value = res.data
    loading.value = false
    return res.data
  }

  const createPost = async (data: any) => {
    const res = await axios.post('/posts', data)
    return res.data
  }

  const likePost = async (id: number) => {
    const res = await axios.post('/posts/' + id + '/like')
    return res.data
  }

  return { posts, currentPost, loading, fetchPosts, fetchPost, createPost, likePost }
})
