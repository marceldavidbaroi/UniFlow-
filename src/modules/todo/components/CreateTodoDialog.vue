<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card
      class="q-pa-md"
      style="min-width: 500px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)"
    >
      <q-card-section class="text-secondary q-py-md">
        <div class="text-h6">Create Todo</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-input v-model="form.title" label="Title" outlined required color="secondary" />
        <q-input
          v-model="form.description"
          label="Description"
          type="textarea"
          outlined
          color="secondary"
        />
        <q-input
          outlined
          color="secondary"
          v-model="form.dueDate"
          label="Due Date"
          mask="date"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="secondary">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.dueDate" color="secondary">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="secondary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          v-model="form.priority"
          label="Priority"
          :options="['Low', 'Medium', 'High']"
          outlined
          emit-value
          map-options
          color="secondary"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon
                  :name="
                    scope.opt === 'High'
                      ? 'priority_high'
                      : scope.opt === 'Medium'
                        ? 'warning'
                        : 'flag'
                  "
                  :color="
                    scope.opt === 'High' ? 'red-5' : scope.opt === 'Medium' ? 'orange-5' : 'green-5'
                  "
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey-7" @click="closeDialog" />
        <q-btn unelevated :loading="loading" label="Create" color="secondary" @click="createTodo" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { Notify } from 'quasar'
import { useTodoStore } from 'src/stores/todo-store'
import { ref, watch } from 'vue'
const todoStore = useTodoStore()
// Props for v-model
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const form = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
})

// Control local visibility from parent
const showDialog = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    showDialog.value = val
  },
)

watch(showDialog, (val) => {
  emit('update:modelValue', val)
})

function closeDialog() {
  showDialog.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  }
}

const createTodo = async () => {
  loading.value = true
  try {
    const response = await todoStore.createTodo(form.value)
    if (response && response.success) {
      Notify.create({
        message: response?.message || 'Todo created successfully!',
        color: 'positive',
        icon: 'check',
        timeout: 2500,
        position: 'top',
      })
    } else {
      Notify.create({
        message: response?.message || 'Failed to create todo.',
        color: 'negative',
        icon: 'warning',
        timeout: 5000,
        position: 'top',
      })
    }
  } catch {
    Notify.create({
      message: 'An unexpected error occurred while creating the todo.',
      color: 'negative',
      icon: 'error',
      timeout: 5000,
      position: 'top',
    })
  } finally {
    loading.value = false
    closeDialog()
  }
}
</script>
