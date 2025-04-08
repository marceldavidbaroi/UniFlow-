<template>
  <q-dialog v-model="internalModel" persistent transition-show="fade" transition-hide="fade">
    <q-card
      class="q-pa-md q-rounded-xl shadow-10"
      style="min-width: 400px; max-width: 90vw; border-radius: 8px"
    >
      <!-- Icon + Title -->
      <q-card-section class="row items-center q-pb-none">
        <q-icon name="warning" color="negative" size="md" class="q-mr-sm" />
        <div class="text-h6 text-negative">
          {{ cardTitle || 'Delete Confirmation' }}
        </div>
      </q-card-section>

      <!-- Description -->
      <q-card-section class="text-body2 q-pt-sm">
        <div class="q-mb-sm text-grey-8">
          {{
            description ||
            'Are you sure you want to delete this item? This action cannot be undone.'
          }}
        </div>

        <div v-if="inputField" class="text-caption text-weight-medium q-mb-sm">
          Please type <span class="text-bold text-red text-bold">"{{ nameToMatch }}"</span> to
          confirm deletion:
        </div>

        <!-- Input -->
        <q-input
          v-if="inputField"
          filled
          dense
          v-model="inputText"
          placeholder="Enter name exactly"
          :error="inputText && inputText !== nameToMatch"
          :error-message="'Must match: ' + nameToMatch"
          class="q-mb-sm"
          input-class="text-subtitle2"
        />
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pt-sm">
        <q-btn flat label="Cancel" color="grey-7" class="text-capitalize" @click="closeDialog" />
        <q-btn
          label="Delete"
          color="negative"
          unelevated
          class="text-capitalize"
          :disable="inputField && inputText !== nameToMatch"
          @click="confirmDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  cardTitle: { type: String, default: '' },
  description: { type: String, default: '' },
  inputField: { type: Boolean, default: false },
  nameToMatch: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'confirm-delete'])

const internalModel = ref(props.modelValue)
const inputText = ref('')

watch(
  () => props.modelValue,
  (val) => {
    internalModel.value = val
    if (!val) inputText.value = ''
  },
)

watch(internalModel, (val) => {
  emit('update:modelValue', val)
})

function closeDialog() {
  internalModel.value = false
}

function confirmDelete() {
  emit('confirm-delete')
  closeDialog()
}
</script>
