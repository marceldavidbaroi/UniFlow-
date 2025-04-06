<template>
  <div class="q-pa-xl flex flex-center bg-grey-1 full-height">
    <q-card
      class="q-pa-xl shadow-10 bg-white rounded-borders"
      style="max-width: 500px; width: 100%"
    >
      <div class="text-center">
        <q-icon name="block" size="64px" color="orange-6" />
        <h1 class="text-h4 text-weight-bold q-mt-md">403 - Unauthorized</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">
          You don't have permission to access this page.
        </p>

        <q-btn
          label="Go to dashboard"
          color="primary"
          class="q-mt-lg"
          @click="router.push(`/dashboard/${userStore.currentRole}`)"
          unelevated
          rounded
        />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
</script>

<style scoped>
.full-height {
  min-height: 100vh;
}
.rounded-borders {
  border-radius: 20px;
}
</style>
