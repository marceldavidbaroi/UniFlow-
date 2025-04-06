<template>
  <div class="q-pa-xl flex flex-center bg-grey-1 full-height">
    <q-card
      class="q-pa-xl shadow-10 bg-white rounded-borders"
      style="max-width: 500px; width: 100%"
    >
      <div class="text-center">
        <q-icon name="error_outline" size="64px" color="red-5" />
        <h1 class="text-h4 text-weight-bold q-mt-md">404 - Page Not Found</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>

        <q-btn
          :label="authStore.isAuthenticated ? 'Go to dashboard' : 'Go to Home'"
          color="primary"
          class="q-mt-lg"
          unelevated
          rounded
          @click="router.push(reditectRoute)"
        />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth-store'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

const reditectRoute = authStore.isAuthenticated ? `/dashboard/${userStore.currentRole}` : '/home'
</script>

<style scoped>
.full-height {
  min-height: 100vh;
}
.rounded-borders {
  border-radius: 20px;
}
</style>
