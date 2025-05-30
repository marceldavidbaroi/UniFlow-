<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card class="q-pa-md" style="min-width: 480px; max-width: 98vw; border-radius: 16px">
      <q-card-section>
        <div class="text-h6">Add Course</div>
        <div v-if="errorMsg" class="text-negative text-caption q-mt-xs q-mb-none">
          {{ errorMsg }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.name"
              label="Course Name"
              outlined
              dense
              color="secondary"
              autofocus
              class="q-mb-md"
            />
            <q-input
              v-model="form.initial"
              label="Initial (e.g. CS101)"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.code"
              label="Course Code (e.g. IT-CS-101)"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.instructor"
              label="Instructor"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.email"
              label="Instructor Email"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.phone"
              label="Instructor Phone"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.location"
              label="Classroom/Location"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.website"
              label="Course Website"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.description"
              color="secondary"
              label="Description"
              outlined
              dense
              type="textarea"
              class="q-mb-md"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" @click="close" />
        <q-btn unelevated label="Add" color="secondary" @click="submit" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
const props = defineProps({
  show: Boolean,
})
const emit = defineEmits(['close', 'submit'])
const modelValue = ref(props.show)
const loading = ref(false)
const form = ref({
  name: '',
  initial: '',
  code: '',
  description: '',
  instructor: '',
  email: '',
  phone: '',
  location: '',
  website: '',
})
const errorMsg = ref('')

watch(
  () => props.show,
  (val) => {
    modelValue.value = val
  },
)
watch(modelValue, (val) => {
  if (!val) emit('close')
})

function validateForm() {
  if (
    !form.value.name ||
    !form.value.initial ||
    !form.value.code ||
    !form.value.instructor ||
    !form.value.email
  ) {
    errorMsg.value = 'Required fields: Name, Initial, Code, Instructor, Email.'
    return false
  }
  if (!/^\w{2,}-\w{2,}-\d{3,}$/.test(form.value.code)) {
    errorMsg.value = 'Course code must be in the format FAC-DEP-### (e.g. IT-CS-101).'
    return false
  }
  if (!/^\w{2,}$/.test(form.value.initial)) {
    errorMsg.value = 'Initial must be at least 2 characters.'
    return false
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email)) {
    errorMsg.value = 'Invalid email format.'
    return false
  }
  errorMsg.value = ''
  return true
}

function close() {
  modelValue.value = false
  errorMsg.value = ''
}
async function submit() {
  if (!validateForm()) return
  loading.value = true
  emit('submit', { ...form.value })
  loading.value = false
  close()
}
</script>
