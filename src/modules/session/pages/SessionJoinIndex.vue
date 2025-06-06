<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card
      style="
        width: 400px;
        min-height: 400px;
        max-width: 90vw;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <q-card-section class="q-pa-lg">
        <div v-if="response">
          <div class="row justify-end">
            <q-icon name="fiber_manual_record" :color="response?.isActive ? 'green' : 'red'" />
          </div>
          <div class="text-h5 text-center q-mb-lg brand_bb text-bold">Join Session</div>
          <div class="q-mb-md">
            <div class="text-subtitle1 text-grey-8">Session</div>
            <div class="text-body1 brand_sb">
              {{ response?.sessionID }} - {{ response?.sessionName }}
            </div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle1 text-grey-8">Date</div>
            <div class="text-body1 brand_sb">{{ response?.sessionDate }}</div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle1 text-grey-8">Host</div>
            <div class="text-body1 brand_sb">{{ response?.createdBy }}</div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle1 text-grey-8">Current participants</div>
            <div class="text-body1 brand_sb">{{ response?.participants.length }}</div>
          </div>
          <q-btn
            color="secondary"
            label="Join Session"
            class="full-width q-mt-lg"
            @click="joinSession"
            :loading="loading"
            style="border-radius: 8px; padding: 12px 16px"
          />
        </div>
        <div v-else class="flex flex-center q-mt-md" style="height: 400px">
          <div class="text-center">
            <q-spinner-grid color="secondary" size="50px" />
            <div>Loading session details...</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { Notify } from 'quasar'
// import { useGroupStore } from 'src/stores/group-store'
import { useSessionStore } from 'src/stores/sessionStore'
import { useUserStore } from 'src/stores/user-store'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// const groupStore = useGroupStore()
const userStore = useUserStore()
const router = useRouter()
const sessionStore = useSessionStore()
const route = useRoute()

const id = route.params.id

const loading = ref(false)
// const showPassword = ref(false)
const response = ref()

const joinSession = async () => {
  loading.value = true
  try {
    const result = await sessionStore.joinSession(id, userStore.currentUser.id)

    Notify.create({
      message: result.message || (result.success ? 'Success!' : 'An error occurred.'),
      color: result.success ? 'positive' : 'negative',
      position: 'top',
      timeout: 2500,
    })
  } catch (error) {
    Notify.create({
      message: error.message || 'Something went wrong.',
      color: 'negative',
      position: 'top',
      timeout: 2500,
    })
  } finally {
    router.push(`/session/${userStore.currentRole}/${id}`)
    loading.value = false
  }
}

onMounted(async () => {
  await sessionStore.searchSessionById(id).then((result) => {
    response.value = result
  })
})
</script>

<style lang="scss" scoped>
/* Add any custom styling here */
</style>
