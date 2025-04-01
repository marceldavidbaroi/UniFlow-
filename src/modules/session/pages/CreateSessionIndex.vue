<template>
  <q-page padding>
    <q-form @submit="handleSubmit" class="q-gutter-md">
      <!-- Session Name -->
      <q-input
        v-model="sessionName"
        label="Session Name"
        filled
        :rules="[(val) => !!val || 'Session Name is required']"
        required
      />

      <!-- Session Length -->
      <q-input
        v-model="sessionLength"
        label="Session Length (in minutes)"
        type="number"
        filled
        :rules="[(val) => val > 0 || 'Session Length must be greater than 0']"
        required
      />

      <!-- Question Add Section -->
      <div class="q-mb-md">
        <div v-for="(question, index) in questions" :key="index" class="q-mb-sm">
          <div class="q-mb-xs">
            <div class="text-h6">Question {{ index + 1 }}</div>
          </div>
          <q-editor
            v-model="questions[index].text"
            label="Question"
            filled
            :rules="[(val) => !!val || 'Question is required']"
            required
          />
          <q-btn
            color="negative"
            icon="delete"
            label="Remove"
            flat
            @click="removeQuestion(index)"
            class="q-mt-sm"
          />
        </div>
        <div class="row justify-between">
          Total question {{ questions.length }}
          <q-btn label="Add Question" color="primary" @click="addQuestion" class="q-mb-sm" />
        </div>
      </div>

      <!-- Session Description -->
      <q-textarea
        v-model="sessionDescription"
        label="Session Description"
        filled
        rows="4"
        required
      />

      <!-- Material Link Section -->
      <div class="q-mb-md">
        <div v-for="(link, index) in materialLinks" :key="index" class="q-mb-sm">
          <q-input v-model="materialLinks[index]" label="Material Link (URL)" filled type="url" />
          <q-btn
            color="negative"
            icon="delete"
            label="Remove"
            flat
            @click="removeLink('materialLinks', index)"
            class="q-mt-sm"
          />
        </div>
        <div class="row justify-between">
          Total material {{ materialLinks.length }}
          <q-btn
            label="Add Material Link"
            color="primary"
            @click="addMaterialLink"
            class="q-mb-sm"
          />
        </div>
      </div>

      <!-- Video Website Link Section -->
      <div class="q-mb-md">
        <div v-for="(link, index) in videoLink" :key="index" class="q-mb-sm">
          <q-input v-model="videoLink[index]" label="Video Website Link (URL)" filled type="url" />
          <q-btn
            color="negative"
            icon="delete"
            label="Remove"
            flat
            @click="removeLink('videoLink', index)"
            class="q-mt-sm"
          />
        </div>
        <div class="row justify-between">
          Total {{ videoLink.length }}
          <q-btn label="Add Video Link" color="primary" @click="addVideoLink" class="q-mb-sm" />
        </div>
      </div>

      <!-- Coding Platform Link Section -->
      <div class="q-mb-md">
        <div v-for="(link, index) in codingPlatformLinks" :key="index" class="q-mb-sm">
          <q-input
            v-model="codingPlatformLinks[index]"
            label="Coding Platform Link (URL)"
            filled
            type="url"
          />
          <q-btn
            color="negative"
            icon="delete"
            label="Remove"
            flat
            @click="removeLink('codingPlatformLinks', index)"
            class="q-mt-sm"
          />
        </div>
        <div class="row justify-between">
          Total {{ codingPlatformLinks.length }}
          <q-btn
            label="Add Coding Platform Link"
            color="primary"
            @click="addCodingPlatformLink"
            class="q-mb-sm"
          />
        </div>
      </div>

      <!-- Real-time Playground Link -->
      <q-input v-model="playgroundLink" label="Real-time Playground Link (URL)" filled type="url" />

      <!-- Discussion Option (Toggle) -->
      <q-toggle
        v-model="discussionOption"
        label="Allow Discussion"
        class="q-mb-md"
        :true-value="true"
        :false-value="false"
      />

      <!-- Add Task Section -->
      <div class="q-mb-md">
        <q-btn label="Add Task" color="primary" @click="addTask" class="q-mb-sm" />
        <div v-for="(task, index) in tasks" :key="index" class="q-mb-sm">
          <div class="q-mb-xs">
            <div class="text-h6">Task {{ index + 1 }}</div>
          </div>
          <q-editor
            v-model="tasks[index].description"
            label="Task Description"
            filled
            :rules="[(val) => !!val || 'Task description is required']"
            required
          />
          <q-btn
            color="negative"
            icon="delete"
            label="Remove"
            flat
            @click="removeTask(index)"
            class="q-mt-sm"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
        <q-btn label="Create Session" color="primary" type="submit" class="q-px-xl q-my-lg" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStore } from 'src/stores/sessionStore'
import { useUserStore } from 'src/stores/user-store'

import { Notify } from 'quasar'

const sesstionStore = useSessionStore()
const userStore = useUserStore()

// Form data
const sessionName = ref('')
const sessionLength = ref('')
const sessionDescription = ref('')
const playgroundLink = ref('')
const discussionOption = ref(true) // default to true (allow discussion)

// Links arrays
const materialLinks = ref([''])
const codingPlatformLinks = ref([''])
const videoLink = ref([''])

// Questions Array
const questions = ref([{ text: '' }])

// Tasks Array
const tasks = ref([])

// Add Question Function
const addQuestion = () => {
  questions.value.push({ text: '' })
}

// Add Material Link Function
const addMaterialLink = () => {
  materialLinks.value.push('')
}

// Add Coding Platform Link Function
const addCodingPlatformLink = () => {
  codingPlatformLinks.value.push('')
}

const addVideoLink = () => {
  videoLink.value.push('')
}

// Add Task Function
const addTask = () => {
  tasks.value.push({ description: '' })
}

// Remove Question Function
const removeQuestion = (index) => {
  questions.value.splice(index, 1)
}

// Remove Task Function
const removeTask = (index) => {
  tasks.value.splice(index, 1)
}

// Remove Link Function (for material, video, and coding platform links)
const removeLink = (arrayName, index) => {
  // Dynamically remove from the correct array (materialLinks, videoLink, codingPlatformLinks)
  if (arrayName === 'materialLinks') {
    materialLinks.value.splice(index, 1)
  } else if (arrayName === 'videoLink') {
    videoLink.value.splice(index, 1)
  } else if (arrayName === 'codingPlatformLinks') {
    codingPlatformLinks.value.splice(index, 1)
  }
}

// Handle form submission
const handleSubmit = () => {
  const payload = {
    sessionName: sessionName.value,
    sessionLength: sessionLength.value,
    sessionDescription: sessionDescription.value,
    videoLink: videoLink.value,
    playgroundLink: playgroundLink.value,
    discussionOption: discussionOption.value,
    questions: questions.value,
    materialLinks: materialLinks.value,
    codingPlatformLinks: codingPlatformLinks.value,
    tasks: tasks.value,
  }

  sesstionStore
    .createSession(userStore.currentUser.id, payload)
    .then((result) => {
      Notify.create({
        message: result.message,
        color: result.success ? 'green' : 'red',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
    })
    .catch(() => {
      Notify.create({
        message: 'Something went wrong!',
        color: 'red',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
    })
}
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: auto;
}
</style>
