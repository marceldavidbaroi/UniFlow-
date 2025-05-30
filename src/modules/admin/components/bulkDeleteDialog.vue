<!--
PasswordConfirmDialog.vue

Usage:

<PasswordConfirmDialog
  v-model="showDialog"
  :password="adminPassword"
  :loading="isLoading"
  :progress="progressValue"
  :progress-message="progressMessage"
  :password-error="passwordError"
  @confirm="handleConfirm"
  @cancel="handleCancel"
/>

Props:
- modelValue (Boolean): Controls dialog visibility (use with v-model).
- password (String): The expected password to validate input against.
- title (String): Dialog title.
- warning (String): Warning message with HTML support.
- note (String): Additional note below warning, HTML supported.
- passwordLabel (String): Label for password input.
- confirmLabel (String): Label for confirm button.
- loading (Boolean): Shows loading state with progress bar.
- progress (Number): Progress bar value (0 to 1).
- progressMessage (String): Text inside progress bar.
- passwordError (String): External error message for password input.

Events:
- update:modelValue (Boolean): Emitted to update visibility.
- confirm (String): Emitted when confirm clicked, passes entered password.
- cancel: Emitted when cancel clicked.

-->

<template>
  <q-dialog :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)">
    <q-card class="q-pa-md" style="min-width: 340px; max-width: 95vw; border-radius: 16px">
      <q-card-section>
        <div class="text-h6 text-negative">{{ title }}</div>
        <div class="text-body2 q-mt-sm">
          <b>Warning:</b> <span v-html="warning"></span>
          <div class="q-mt-sm" v-if="note" v-html="note"></div>

          <q-input
            v-model="localPassword"
            :label="passwordLabel"
            type="password"
            dense
            autofocus
            class="q-mt-md"
            :disable="loading"
            @keyup.enter="onConfirm"
            :error="displayPasswordError !== ''"
            :error-message="displayPasswordError"
          />

          <q-linear-progress v-if="loading" :value="progress" color="negative" class="q-mt-md">
            <div class="absolute-full flex flex-center text-white text-weight-bold">
              {{ Math.round(progress * 100) }}% - {{ progressMessage }}
            </div>
          </q-linear-progress>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" @click="emitCancel" :disable="loading" />
        <q-btn
          unelevated
          :label="confirmLabel"
          color="negative"
          @click="onConfirm"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Add Sample Courses',
  },
  warning: {
    type: String,
    default:
      'This action will <span class="text-negative">permanently delete <u>all existing courses</u></span> and replace them with sample data.<br><span class="text-warning">This cannot be undone.</span>',
  },
  note: {
    type: String,
    default:
      'To proceed, please enter the admin password. <br /><span class="text-caption text-grey-7">(All current course records will be lost and replaced with sample data.)</span>',
  },
  passwordLabel: {
    type: String,
    default: 'Admin Password',
  },
  confirmLabel: {
    type: String,
    default: 'Confirm',
  },
  loading: Boolean,
  progress: {
    type: Number,
    default: 0,
  },
  progressMessage: {
    type: String,
    default: 'Processing...',
  },
  passwordError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const localPassword = ref('')
const internalPasswordError = ref('')

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      localPassword.value = ''
      internalPasswordError.value = ''
    }
  },
)

const displayPasswordError = computed(() => {
  return props.passwordError || internalPasswordError.value
})

function onConfirm() {
  console.log(props.password)
  if (localPassword.value !== props.password) {
    internalPasswordError.value = 'Incorrect password.'
    return
  }
  internalPasswordError.value = ''
  emit('confirm', localPassword.value)
}

function emitCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped></style>
