import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

axios.defaults.baseURL = '/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const login = async (email: string, password: string) => {
    const res = await axios.post('/auth/login', { email, password })
    user.value = res.data.user
    token.value = res.data.token
    localStorage.setItem('token', res.data.token)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await axios.post('/auth/register', { username, email, password })
    user.value = res.data.user
    token.value = res.data.token
    localStorage.setItem('token', res.data.token)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const fetchUser = async () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.value
      try {
        const res = await axios.get('/auth/me')
        user.value = res.data
      } catch {
        logout()
      }
    }
  }

  return { user, token, login, register, logout, fetchUser }
})
