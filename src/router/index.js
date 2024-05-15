import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/instances',
    name: 'instances',
    component: () => import('../views/InstancesView.vue')
  },
  {
    path: '/instance/:problem/:identifier',
    name: 'instance_detail',
    component: () => import('../views/InstanceDetailView.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue')
  },
  {
    path: '/jssp',
    name: 'jssp',
    component: () => import('../views/problems/JobShopSchedulingProblem.vue')
  },
  {
    path: '/configuration_sampling',
    name: 'configuration_sampling',
    component: () => import('../views/problems/ConfigurationSamplingProblem.vue')
  },
  {
    path: '/knapsack',
    name: 'knapsack',
    component: () => import('../views/problems/KnapsackProblem.vue')
  },
  /*
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/packages',
    name: 'packages',
    component: () => import('../views/InstancesPackages.vue')
  }*/
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
