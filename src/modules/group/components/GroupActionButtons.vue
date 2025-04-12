<template>
  <div class="toolbar row justify-center items-center q-gutter-md q-pa-lg">
    <!-- Create Button -->
    <q-btn
      color="primary"
      icon="add"
      label="Create"
      size="sm"
      class="toolbar-btn"
      @click="onCreate"
    />

    <!-- Lab Group Filter -->
    <q-btn-dropdown
      color="secondary"
      :label="labGroupLabel"
      icon="filter_alt"
      size="sm"
      class="toolbar-btn"
    >
      <q-list>
        <q-item
          v-for="option in labGroupOptions"
          :key="option.value"
          clickable
          v-close-popup
          @click="selectLabGroup(option)"
        >
          <q-item-section>{{ option.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <!-- Semester Dropdown -->
    <q-btn-dropdown color="info" :label="semesterLabel" icon="event" size="sm" class="toolbar-btn">
      <q-list>
        <q-item
          v-for="option in semesterOptions"
          :key="option.value"
          clickable
          v-close-popup
          @click="selectSemester(option)"
        >
          <q-item-section>{{ option.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <!-- Year Input -->
    <q-input
      v-model="year"
      type="number"
      outlined
      dense
      placeholder="Year"
      class="year-input"
      :rules="[(val) => (val && val > 2000) || 'Enter valid year']"
      style="width: 120px"
    />

    <!-- Search Group Name -->
    <div class="search-wrapper column">
      <div class="row items-center q-gutter-sm">
        <q-btn
          v-if="!showSearch"
          icon="search"
          size="sm"
          flat
          dense
          color="secondary"
          @click="toggleSearch"
        />

        <q-input
          v-if="showSearch"
          v-model="searchText"
          dense
          outlined
          placeholder="Search by group name"
          class="search-input"
          size="sm"
        >
          <template #append>
            <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
          </template>
        </q-input>
      </div>

      <q-list v-if="showSearch" class="q-mt-sm bg-white shadow-2 rounded-borders full-width">
        <q-item v-if="isLoading">
          <q-item-section class="text-center full-width">
            <q-spinner-dots color="primary" size="24px" />
          </q-item-section>
        </q-item>

        <q-item
          v-else-if="searchResults.length"
          v-for="(item, index) in searchResults"
          :key="index"
          clickable
          @click="() => onSelect(item)"
        >
          <q-item-section> {{ item.groupName }} </q-item-section>
        </q-item>

        <q-item v-else-if="!isLoading && searchText">
          <q-item-section class="text-negative"> No results found. </q-item-section>
        </q-item>

        <q-item v-else-if="!searchText">
          <q-item-section class="text-grey"> Search by group name </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const emit = defineEmits(['filter-labgroup'])

// --- Reactive State
const showSearch = ref(false)
const searchText = ref('')
const isLoading = ref(false)
const searchResults = ref([])

const year = ref(new Date().getFullYear())

// --- Semester Options
const semesterOptions = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
]
const selectedSemester = ref(null)
const semesterLabel = computed(() => selectedSemester.value?.label || 'Semester')
const selectSemester = (option) => {
  selectedSemester.value = option
}

// --- Lab Group Options
const labGroupOptions = [
  { label: 'All Groups', value: 'all' },
  { label: 'Lab Groups Only', value: true },
  { label: 'Non-Lab Groups', value: false },
]
const selectedLabGroup = ref(null)
const labGroupLabel = computed(() => selectedLabGroup.value?.label || 'Lab Group')
const selectLabGroup = (option) => {
  selectedLabGroup.value = option
  emit('filter-labgroup', option.value) // or option.value if you're only interested in the value
}

// --- Actions
const toggleSearch = () => {
  showSearch.value = true
}
const clearSearch = () => {
  searchText.value = ''
  showSearch.value = false
  searchResults.value = []
}

const onCreate = () => {
  router.push('/group/create')
}

const onSelect = (item) => {
  router.push(`/group/${item.id}`)
}

// --- Search (mocking for now; replace with real API)
let timeout = null
watch(searchText, (val) => {
  if (timeout) clearTimeout(timeout)

  timeout = setTimeout(async () => {
    if (val.trim().length === 0) {
      searchResults.value = []
      return
    }

    isLoading.value = true
    try {
      // Replace with real API call
      const mockResults = [
        { id: 1, groupName: 'Group Alpha' },
        { id: 2, groupName: 'Lab Beta' },
      ].filter((item) => item.groupName.toLowerCase().includes(val.toLowerCase()))

      searchResults.value = mockResults
    } catch (err) {
      console.error(err)
      searchResults.value = []
    } finally {
      isLoading.value = false
    }
  }, 800)
})
</script>

<style scoped lang="scss">
.toolbar-btn {
  min-width: 100px;
}

.search-wrapper {
  align-items: center;
}

.search-input {
  width: 400px;
}
</style>
