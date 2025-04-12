<template>
  <q-dialog v-model="model" persistent transition-show="fade" transition-hide="fade">
    <q-card
      class="bg-white rounded-md shadow-md"
      style="width: 400px; max-width: 90vw; border-radius: 8px"
    >
      <q-card-section class="row items-center q-pa-lg">
        <div
          class="bg-red-100 text-red q-mr-md rounded-full flex items-center justify-center"
          style="width: 40px; height: 40px"
        >
          <q-icon name="warning" size="1.5rem" />
        </div>
        <span class="text-subtitle1 text-grey-800">Leave this group?</span>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <p class="text-grey-700 text-sm">
          Are you sure you want to leave this group? You might miss important updates and will need
          to be invited again to rejoin.
        </p>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancel"
          color="secondary"
          v-close-popup
          class="rounded-full q-px-md text-grey-700 hover:bg-grey-100"
        />
        <q-btn
          flat
          label="Leave Group"
          color="negative"
          @click="confirmLeave"
          v-close-popup
          class="rounded-full text-white bg-negative shadow-md hover:bg-negative-darker q-px-md"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'confirm-leave'])

const model = ref(props.modelValue)

// Keep v-model in sync
watch(
  () => props.modelValue,
  (val) => {
    model.value = val
  },
)

watch(model, (val) => {
  emit('update:modelValue', val)
})

// Emit leave event
function confirmLeave() {
  emit('confirm-leave')
}
</script>

<style lang="scss" scoped>
// Optional custom styling if needed
</style>
