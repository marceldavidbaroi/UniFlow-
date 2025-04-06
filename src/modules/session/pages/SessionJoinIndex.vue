<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card
      style="
        width: 400px;
        max-width: 90vw;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <q-card-section class="q-pa-lg">
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

const password = ref('')
const loading = ref(false)
// const showPassword = ref(false)
const response = ref()

const joinSession = () => {
  sessionStore.joinSession(id, password.value).then((result) => {
    if (result.success) {
      Notify.create({
        message: result.message, // Use the message from the result
        color: 'positive', // Green color for success
        position: 'top',
        timeout: 2500,
      })
      router.push(`/session/${userStore.currentRole}/${id}`)
    } else {
      Notify.create({
        message: result.message || 'An error occurred.', // Use message or generic error
        color: 'negative', // Red color for error
        position: 'top',
        timeout: 2500,
      })
    }
  })
}

onMounted(async () => {
  await sessionStore.searchSessionById(id).then((result) => {
    response.value = result
    console.log(response.value)
  })
})
</script>

<style lang="scss" scoped>
/* Add any custom styling here */
</style>
