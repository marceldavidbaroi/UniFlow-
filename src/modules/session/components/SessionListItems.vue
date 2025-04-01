<template>
  <div class="container">
    <div class="session-wrapper" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <q-item clickable v-ripple @click="showDetails(session.id)">
        <q-item-section>
          <q-item-label>{{ session.sessionName }}</q-item-label>
          <div class="row justify-between">
            <div>{{ session.sessionLength }}</div>
            <div>
              <span>
                <q-icon
                  name="question_answer"
                  :color="session.discussionOption ? 'green' : 'red'"
                />
              </span>
              <span>
                <q-icon name="fiber_manual_record" :color="session.isActive ? 'green' : 'red'" />
              </span>
            </div>
          </div>
        </q-item-section>
      </q-item>

      <!-- Show only on hover -->
      <div v-if="isHovered" class="row justify-end q-mr-lg">
        <div>
          <q-btn
            dense
            size="sm"
            :color="session.isActive ? 'green' : 'red'"
            :label="session.isActive ? 'Active' : 'Inactive'"
            class="q-px-xs"
            @click="toggleActive(session.id, session.isActive)"
          />
        </div>
        <div>
          <q-btn
            dense
            size="sm"
            :color="session.discussionOption ? 'green' : 'red'"
            :label="session.discussionOption ? 'Discussion' : 'No Discussion'"
            class="q-px-xs q-mx-sm"
            @click="toggleDiscussion(session.id, session.discussionOption)"
          />
        </div>
        <div>
          <q-btn
            dense
            flat
            color="primary"
            size="sm"
            icon="share"
            class="q-px-xs"
            @click="toggleActive"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from 'src/stores/sessionStore'
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
const sessionStore = useSessionStore()
const router = useRouter()
defineProps({
  session: Object,
})
const emit = defineEmits(['updateSessionStatus'])

const isHovered = ref(false)

const toggleActive = (id, isActive) => {
  sessionStore.updateSessionData(id, { isActive: !isActive })
  emit('updateSessionStatus')
}
const toggleDiscussion = (id, discussionOption) => {
  sessionStore.updateSessionData(id, { discussionOption: !discussionOption })
  emit('updateSessionStatus')
}

const showDetails = (id) => {
  router.push(`/session/${id}`)
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.session-wrapper {
  width: 800px;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.session-wrapper:hover {
  background-color: var(--brand-bl);
}
</style>
