<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-pt-md text-center brand_sb">All Sesstions</div>

    <div class="text-body1 q-pb-md text-center text-secondary text-bold">
      Total Session:
      {{ sessionStore.sessionCount }}
    </div>

    <SessionActionButtons />
    <div v-if="formattedSessionData">
      <div v-if="userStore.currentRole === 'teacher'">
        <SessionListItemsTeacher
          v-for="session in formattedSessionData"
          :key="session.id"
          :session="session"
          @updateSessionStatus="handleStatusChange"
        />
      </div>
      <div v-if="userStore.currentRole === 'student'">
        <SessionListItemsStudent
          v-for="session in formattedSessionData"
          :key="session.id"
          :session="session"
          @updateSessionStatus="handleStatusChange"
        />
      </div>
    </div>

    <div v-else class="flex flex-center q-mt-md" style="height: 100vh">
      <div class="text-center">
        <q-spinner-grid color="secondary" size="50px" />
        <div>Loading session list...</div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[50, 50]" style="z-index: 1000">
      <q-btn round icon="keyboard_arrow_up" color="secondary" @click="scrollToTop" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SessionListItemsTeacher from '../components/SessionListItemsTeacher.vue'
import SessionListItemsStudent from '../components/SessionListItemsStudent.vue'
import { useSessionStore } from 'src/stores/sessionStore'
// import { useRouter } from 'vue-router'
import SessionActionButtons from '../components/SessionActionButtons.vue'
import { useUserStore } from 'src/stores/user-store'

// const router = useRouter()
const sessionStore = useSessionStore()
const userStore = useUserStore()

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
    sessionID: session.sessionID,
  })),
)

onMounted(async () => {
  if (userStore.currentRole === 'teacher') {
    await sessionStore.fetchCreatedSessions()
  }
  if (userStore.currentRole === 'student') {
    await sessionStore.fetchParticipatingSessions()
  }
})

const handleStatusChange = async () => {
  await sessionStore.fetchCreatedSessions()
}
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
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
