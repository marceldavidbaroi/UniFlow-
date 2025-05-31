<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="q-pa-md q-dialog-plugin" style="min-width: 400px">
      <q-card-section>
        <div class="text-h6 text-secondary">Add {{ capitalizedType }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="submitItem" class="q-gutter-md">
          <!-- Type Selector -->
          <q-select
            v-model="itemType"
            :options="Object.keys(typeConfigs)"
            label="Select Type"
            dense
            filled
            color="secondary"
          />

          <!-- Dynamic Fields -->
          <template v-for="field in typeConfigs[itemType]?.required" :key="field">
            <q-input
              v-if="field !== 'options'"
              v-model="formData[field]"
              :label="formatLabel(field)"
              filled
              dense
              color="secondary"
              :type="field.includes('date') ? 'date' : 'text'"
            />
            <!-- Poll Options -->
            <div v-else>
              <label class="text-subtitle2 text-secondary">Poll Options</label>
              <q-input
                v-for="(opt, index) in formData.options"
                :key="index"
                v-model="formData.options[index]"
                dense
                filled
                color="secondary"
                class="q-mb-sm"
                :label="`Option ${index + 1}`"
              >
                <template #append>
                  <q-btn
                    icon="delete"
                    dense
                    flat
                    color="negative"
                    @click="formData.options.splice(index, 1)"
                  />
                </template>
              </q-input>
              <q-btn
                label="Add Option"
                icon="add"
                flat
                dense
                color="secondary"
                @click="formData.options.push('')"
              />
            </div>
          </template>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn label="Submit" color="secondary" @click="submitItem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

// Item type configs
const typeConfigs = {
  resource: {
    required: ['title', 'link', 'description'],
  },
  task: {
    required: ['name', 'link', 'description', 'dueDate'],
  },
  announcement: {
    required: ['title', 'message'],
  },
  poll: {
    required: ['title', 'options', 'expiresAt'],
  },
}

const itemType = ref('resource')
const formData = reactive({
  title: '',
  link: '',
  name: '',
  message: '',
  description: '',
  dueDate: '',
  expiresAt: '',
  options: ['', ''],
})

// Props
const props = defineProps({
  modelValue: Boolean,
  groupId: String,
  item: Object,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isOpen = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
    if (!val) {
      resetForm()
    }
  },
)

watch(isOpen, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetForm()
  }
})

watch(
  () => props.item,
  (item) => {
    if (item) {
      itemType.value = item.type || 'resource'
      for (const key in formData) {
        if (key === 'options' && Array.isArray(item.options)) {
          formData.options = [...item.options]
        } else if (item[key] !== undefined) {
          formData[key] = item[key]
        } else {
          formData[key] = key === 'options' ? ['', ''] : ''
        }
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

// Helpers
const capitalizedType = computed(
  () => itemType?.value.charAt(0).toUpperCase() + itemType?.value.slice(1),
)

function formatLabel(field) {
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

function resetForm() {
  itemType.value = 'resource'
  for (const key in formData) {
    formData[key] = key === 'options' ? ['', ''] : ''
  }
}

// Submit handler
function submitItem() {
  const type = itemType.value
  const payload = {}
  for (const key of typeConfigs[type]?.required || []) {
    payload[key] = formData[key]
  }
  emit('submit', { type, payload })
  isOpen.value = false
  resetForm()
}
</script>

<style scoped>
.q-dialog-plugin {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
</style>
