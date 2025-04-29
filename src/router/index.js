import { createRouter, createWebHistory } from 'vue-router'
import auth from 'src/modules/auth/routes'
import dashboard from 'src/modules/dashboard/routes'
import home from 'src/modules/home/routes'
import group from 'src/modules/group/routes'
import session from 'src/modules/session/routes'
import todo from 'src/modules/todo/routes'
import task from 'src/modules/task/routes'

// Error and unauthorized fallback pages

const routes = [
  ...auth,
  ...home,
  ...dashboard,
  ...group,
  ...session,
  ...todo,
  ...task,

  // Unauthorized Route
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('src/components/UnauthincatedPage.vue'),
  },

  // Catch-All 404 Not Found Route
  {
    path: '/:catchAll(.*)*',
    name: 'ErrorNotFound',
    component: () => import('src/components/PageNotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
