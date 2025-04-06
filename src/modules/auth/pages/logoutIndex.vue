<template>
  <div class="q-pa-xl flex flex-center bg-grey-1 full-height full-width">
    <q-card
      class="q-pa-xl shadow-10 bg-white rounded-borders"
      style="max-width: 500px; width: 100%"
    >
      <div class="text-center">
        <q-spinner-dots color="primary" size="48px" />
        <h2 class="text-h5 text-weight-bold q-mt-md">Logging out...</h2>
        <p class="text-subtitle2 text-grey-7 q-mt-sm">Please wait while we log you out safely.</p>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { Notify } from 'quasar'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  try {
    const result = await authStore.logoutUser()
    Notify.create({
      message: result.message,
      color: result.success ? 'green' : 'red',
      position: 'top',
      icon: 'warning',
      timeout: 5000,
      actions: [{ icon: 'close', color: 'white', handler: () => {} }],
    })
    if (result.success) {
      setTimeout(() => {
        router.push('/home') // Redirect after logout
      }, 1500) // small delay to show feedback
    }
  } catch {
    Notify.create({
      message: 'Something went wrong!',
      color: 'red',
      position: 'top',
      icon: 'warning',
      timeout: 5000,
      actions: [{ icon: 'close', color: 'white', handler: () => {} }],
    })
  }
})
</script>

<style scoped>
.full-height {
  min-height: 100vh;
}
.rounded-borders {
  border-radius: 20px;
}
</style>
