import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {mathjax} from "mathjax/es5/tex-mml-chtml.js"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/instances/:problem',
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
    path: '/mpp',
    name: 'mpp',
    component: () => import('../views/problems/MaximumPolygonPacking.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
