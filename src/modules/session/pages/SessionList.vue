<template>
  <q-page class="q-pa-md">
    <!-- <div class="row justify-center text-center q-ma-md">
      <div class="col q-pa-xl q-mx-xl my-card text-center">
        <div class="text-heading-solid text-h3">{{ groupStore.groupCount }}</div>
        <div class="caption">Groups</div>
      </div>
      <div class="col q-pa-xl q-mx-xl my-card">
        <div class="text-heading-solid text-h3">10</div>
        <div class="caption">Students</div>
      </div>
    </div> -->
    <div class="text-h4 q-pt-md text-center brand_sb">All Sesstions</div>

    <div class="text-body1 q-pb-md text-center text-secondary text-bold">
      Total Session:
      {{ sessionStore.sessionCount }}
    </div>

    <div class="row justify-center q-ma-md">
      <div class="col-12 flex justify-center">
        <q-btn
          label="Create Session"
          color="secondary"
          @click="router.push('/session/create')"
          unelevated
          class="q-mb-lg"
          style="border-radius: 8px"
        />
      </div>
    </div>
    <div v-if="formattedSessionData">
      <SessionListItems
        v-for="session in formattedSessionData"
        :key="session.id"
        :session="session"
        @updateSessionStatus="handleStatusChange"
      />
    </div>

    <div v-else class="flex flex-center q-mt-md" style="height: 100vh">
      <div class="text-center">
        <q-spinner-pie color="secondary" size="2em" />
        <div>Loading session details...</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SessionListItems from '../components/SessionListItems.vue'
import { useSessionStore } from 'src/stores/sessionStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const sessionStore = useSessionStore()

// Make formattedGroupData reactive
const formattedSessionData = computed(() =>
  sessionStore.sessionList.map((session) => ({
    id: session.id,
    sessionName: session.sessionName,
    sessionLength: session.sessionLength,
    discussionOption: session.discussionOption,
    isActive: session.isActive,
    isEnded: session.isEnded,
    startDate: session.sessionDate,
    endedAt: session.endedAt,
  })),
)

onMounted(async () => {
  await sessionStore.fetchAllSession()
})

const handleStatusChange = async () => {
  await sessionStore.fetchAllSession()
}

// console.log('this is the session', formattedSessionData)
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: auto;
}

.my-card {
  width: 100%;
  border: 2px solid rgb(194, 157, 72);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.text-heading-solid {
  font-family: 'Londrina Solid', cursive;
  color: #c29d48;
}
</style>
