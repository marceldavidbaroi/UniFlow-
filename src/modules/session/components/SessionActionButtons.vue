<template>
  <div class="toolbar row justify-center items-center q-gutter-md q-pa-lg">
    <!-- Conditional rendering based on search state -->
    <template v-if="!showSearch">
      <!-- Create Button -->
      <q-btn
        color="primary"
        icon="add"
        label="Create"
        size="sm"
        square
        unelevated
        class="toolbar-btn"
        @click="onCreate"
      />

      <!-- Sort Dropdown Button -->
      <q-btn-dropdown
        color="info"
        :label="sortLabel"
        icon="sort"
        size="sm"
        square
        dropdown-icon="expand_more"
        unelevated
        class="toolbar-btn"
      >
        <q-list>
          <q-item
            v-for="option in sortOptions"
            :key="option.value"
            clickable
            v-close-popup
            @click="selectSort(option)"
          >
            <q-item-section>{{ option.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <!-- Filter Dropdown Button -->
      <q-btn-dropdown
        color="warning"
        :label="filterLabel"
        icon="filter_list"
        size="sm"
        square
        dropdown-icon="expand_more"
        unelevated
        class="toolbar-btn"
      >
        <q-list>
          <q-item
            v-for="option in filterOptions"
            :key="option.value"
            clickable
            v-close-popup
            @click="selectFilter(option)"
          >
            <q-item-section>{{ option.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>

    <!-- Search Icon + Input -->
    <div class="search-wrapper row items-center q-gutter-sm">
      <q-btn icon="search" size="sm" flat dense square color="secondary" @click="toggleSearch" />
      <q-input
        v-if="showSearch"
        v-model="searchText"
        dense
        standout="secondary"
        rounded
        placeholder="Search..."
        class="search-input"
        debounce="300"
        size="sm"
      >
        <template #append>
          <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedSort = ref(null)
const selectedFilter = ref(null)
const showSearch = ref(false)
const searchText = ref('')

const sortOptions = [
  { label: 'Newest', value: 'createdAt_desc' },
  { label: 'Oldest', value: 'createdAt_asc' },
  { label: 'Session ID', value: 'sessionID' },
]

const filterOptions = [
  { label: 'Active Sessions', value: 'active' },
  { label: 'Ended Sessions', value: 'ended' },
  { label: 'All Sessions', value: 'all' },
]

const sortLabel = computed(() => selectedSort.value?.label || 'Sort')
const filterLabel = computed(() => selectedFilter.value?.label || 'Filter')

const selectSort = (option) => {
  selectedSort.value = option
}

const selectFilter = (option) => {
  selectedFilter.value = option
}

const toggleSearch = () => {
  showSearch.value = true
}

const clearSearch = () => {
  searchText.value = ''
  showSearch.value = false
}

const onCreate = () => {
  console.log('Create clicked')
}
</script>

<style scoped lang="scss">
.toolbar {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.toolbar-btn {
  min-width: 100px;
}

.search-wrapper {
  align-items: center;
}

.search-input {
  max-width: 180px;
}
</style>
