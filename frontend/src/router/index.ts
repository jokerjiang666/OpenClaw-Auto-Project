import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import Create from '../views/Create.vue'
import Auth from '../views/Auth.vue'
import User from '../views/User.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail },
  { path: '/create', name: 'Create', component: Create },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/user/:id', name: 'User', component: User }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
