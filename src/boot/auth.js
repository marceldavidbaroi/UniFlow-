import { boot } from 'quasar/wrappers'
import { useUserStore } from 'src/stores/user-store'
import { useAuthStore } from 'stores/auth-store'

export default boot(({ router }) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.meta?.requiresAuth
    const allowedRoles = to.meta?.roles // Array of allowed roles for this route

    // Redirect to login if route requires auth and user is not authenticated
    if (requiresAuth && !isAuthenticated) {
      return { name: 'login' }
    }

    // If route has role restriction, check if user's single role matches
    if (requiresAuth && allowedRoles && isAuthenticated) {
      const userRole = userStore.currentRole

      const hasAccess = allowedRoles.includes(userRole)

      if (!hasAccess) {
        return { name: 'unauthorized' } // or redirect to 'unauthorized' page
      }
    }

    return true // Allow navigation
  })
})
