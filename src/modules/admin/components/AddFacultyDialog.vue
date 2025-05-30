<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card class="q-pa-md" style="min-width: 480px; max-width: 98vw; border-radius: 16px">
      <q-card-section>
        <div class="text-h6">Add Faculty</div>
        <div v-if="errorMsg" class="text-negative text-caption q-mt-xs q-mb-none">
          {{ errorMsg }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.name"
              label="Faculty Name"
              outlined
              dense
              color="secondary"
              autofocus
              class="q-mb-md"
            />
            <q-input
              v-model="form.initial"
              label="Initial (e.g. IT)"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.code"
              label="Faculty Code (e.g. 15)"
              type="number"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-select
              v-model="form.headOfFaculty"
              :options="headOptions"
              label="Head of Faculty"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
              use-input
              input-debounce="0"
              @filter="filterHead"
            />
            <q-input
              v-model="form.email"
              label="Email"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.phone"
              label="Phone"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.officeLocation"
              label="Office Location"
              outlined
              dense
              color="secondary"
              class="q-mb-md"
            />
            <q-input
              v-model="form.website"
              label="Website"
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
  headOfFaculty: '',
  email: '',
  phone: '',
  officeLocation: '',
  website: '',
})
const headOptions = ref([
  'Dr. Sana Malik',
  'Dr. John Doe',
  'Dr. Jane Smith',
  'Prof. Ahmed Khan',
  'Prof. Maria Lee',
])
const errorMsg = ref('')

function filterHead(val, update) {
  update(() => {
    if (!val) {
      headOptions.value = [
        'Dr. Sana Malik',
        'Dr. John Doe',
        'Dr. Jane Smith',
        'Prof. Ahmed Khan',
        'Prof. Maria Lee',
      ]
    } else {
      const needle = val.toLowerCase()
      headOptions.value = headOptions.value.filter((opt) => opt.toLowerCase().includes(needle))
    }
  })
}

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
    !form.value.headOfFaculty ||
    !form.value.email
  ) {
    errorMsg.value = 'Required fields: Name, Initial, Code, Head of Faculty, Email.'
    return false
  }
  if (!/^\d+$/.test(form.value.code)) {
    errorMsg.value = 'Faculty code must be a number.'
    return false
  }
  if (!/^[A-Z]{2,}$/.test(form.value.initial)) {
    errorMsg.value = 'Initial must be at least 2 uppercase letters.'
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
