<!--
  Usage example:

  <SearchFilter
    :searchTypeOptions="[
      { label: 'Name', value: 'name' },
      { label: 'Code', value: 'code' }
    ]"
    @search="onSearchHandler"
  />

  function onSearchHandler({ type, text }) {
    console.log('Search type:', type, 'Query:', text)
  }
-->

<template>
  <div class="search-filter q-gutter-sm row items-center">
    <q-select
      v-model="localSearchType"
      :options="searchTypeOptions"
      dense
      emit-value
      map-options
      outlined
      color="blue-2"
      text-color="blue-10"
      class="q-mr-sm"
      style="min-width: 120px"
      @update:model-value="onTypeChange"
    />
    <q-input
      v-model="localSearchText"
      dense
      outlined
      color="secondary"
      placeholder="Search..."
      :debounce="350"
      @update:model-value="onTextChange"
      @keyup.enter="emitSearch"
      @blur="emitSearch"
      clearable
      @clear="onSearchClear"
      class="q-mr-sm"
      style="min-width: 180px"
    >
      <template v-slot:append>
        <q-icon name="search" @click="emitSearch" class="cursor-pointer" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  searchTypeOptions: {
    type: Array,
    default: () => [
      { label: 'Name', value: 'name' },
      { label: 'Code', value: 'code' },
    ],
  },
})

const emit = defineEmits(['search'])

const localSearchType = ref(props.searchTypeOptions[0]?.value || '')
const localSearchText = ref('')

// Emit both type and value together
function emitSearch() {
  emit('search', {
    type: localSearchType.value,
    text: localSearchText.value,
  })
}

function onTypeChange(value) {
  localSearchType.value = value
  emitSearch()
}

function onTextChange(value) {
  localSearchText.value = value
  // Debounced input already triggers emitSearch via blur/key events
}

function onSearchClear() {
  localSearchText.value = ''
  emitSearch()
}
</script>

<style scoped>
.search-filter {
  flex-wrap: nowrap;
}
</style>
