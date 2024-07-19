import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'current',
    component: () => import('../views/v2/NewVersion.vue')
  },
  {
    path: '/v1',
    name: 'new-version',
    component: () => import('../views/v1/CurrentVersion.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
