import { createRouter, createWebHistory } from 'vue-router'
// import dashboardRoutes from 'src/modules/dashboard/routes'
// import authRoutes from 'src/modules/auth/routes'
import auth from 'src/modules/auth/routes'
import dashboard from 'src/modules/dashboard/routes'
import home from 'src/modules/home/routes'
const routes = [...auth, ...home, ...dashboard]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
