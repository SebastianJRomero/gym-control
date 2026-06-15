import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'

import DashboardView from '../views/DashboardView.vue'

import MembersView from '../views/MembersView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  
  {
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView
  },
  
  {
  path: '/members',
  name: 'members',
  component: MembersView
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router