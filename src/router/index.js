import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {findProblem} from '@/data/problems'

const SITE_TITLE = 'CG:SHOP Instances'

const problemPage = (id, component) => ({
  path: '/' + id,
  name: id,
  component,
  meta: {title: () => findProblem(id).name}
})

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/instances/:problem',
    name: 'instances',
    component: () => import('../views/InstancesView.vue'),
    meta: {title: (route) => `${findProblem(route.params.problem)?.name ?? 'Unknown problem'} Instances`}
  },
  {
    path: '/instance/:problem/:identifier',
    name: 'instance_detail',
    component: () => import('../views/InstanceDetailView.vue'),
    meta: {title: (route) => route.params.identifier}
  },
  problemPage('mpp', () => import('../views/problems/MaximumPolygonPacking.vue')),
  problemPage('mcp', () => import('../views/problems/MinimumConvexPartition.vue')),
  problemPage('mpsp', () => import('../views/problems/MinimumSubgraphPartition.vue')),
  problemPage('mcpc', () => import('../views/problems/MinimumCoverageByConvexPolygons.vue')),
  problemPage('mapf', () => import('../views/problems/MultiAgentPathFinding.vue')),
  problemPage('nonobt_triang', () => import('../views/problems/MinimumNonObtuseTriangulation.vue')),
  // Legacy URL of the multi agent path finding page.
  {path: '/cmp', redirect: '/mapf'},
  {
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {title: () => 'Page not found'}
  }
]

// Scroll positions of the (kept alive) instance search pages, restored when returning to them.
const searchScrollPositions = new Map()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.name === 'instances' && searchScrollPositions.has(to.fullPath)) {
      return {top: searchScrollPositions.get(to.fullPath)}
    }
    if (to.hash) {
      return {el: to.hash, behavior: 'smooth'}
    }
    return {top: 0}
  }
})

router.beforeEach((to, from) => {
  if (from.name === 'instances') {
    searchScrollPositions.set(from.fullPath, window.scrollY)
  }
})

router.afterEach((to) => {
  const title = to.meta.title?.(to)
  document.title = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE
})

export default router
