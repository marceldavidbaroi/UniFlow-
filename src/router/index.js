import { createRouter, createWebHistory } from 'vue-router'
// import dashboardRoutes from 'src/modules/dashboard/routes'
// import authRoutes from 'src/modules/auth/routes'
import auth from 'src/modules/auth/routes'
import dashboard from 'src/modules/dashboard/routes'
const routes = [...auth, ...dashboard]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
