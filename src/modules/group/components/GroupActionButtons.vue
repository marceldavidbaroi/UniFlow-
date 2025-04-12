<template>
  <div class="toolbar row justify-center items-center q-gutter-md q-pa-lg">
    <!-- Create Button -->
    <q-btn
      v-if="!showSearch"
      color="primary"
      icon="add"
      label="Create"
      size="sm"
      class="toolbar-btn"
      @click="onCreate"
    />

    <!-- Lab Group Filter -->
    <q-btn-dropdown
      v-if="!showSearch"
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
    <q-btn-dropdown
      v-if="!showSearch"
      color="info"
      :label="semesterLabel"
      icon="event"
      size="sm"
      class="toolbar-btn"
    >
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

    <q-btn
      v-if="!showSearch && groupStore.filterActive"
      color="negative"
      icon="filter_alt_off"
      label="Clear"
      size="sm"
      class="toolbar-btn"
      @click="getAllGroups"
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
import { useGroupStore } from 'src/stores/group-store'
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
const groupStore = useGroupStore()

const router = useRouter()

// --- Reactive State
const showSearch = ref(false)
const searchText = ref('')
const isLoading = ref(false)
const searchResults = ref([])

// --- Semester Options
const semesterOptions = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
]
const selectedSemester = ref(null)
const semesterLabel = computed(() => selectedSemester.value?.label || 'Semester')
const selectSemester = async (option) => {
  selectedSemester.value = option
  try {
    const filters = {
      semester: option.value,
    }
    await groupStore.filterGroups(filters)
  } catch (error) {
    console.error('An unexpected error occurred:', error)
  }
}

// --- Lab Group Options
const labGroupOptions = [
  { label: 'All Groups', value: 'all' },
  { label: 'Lab Groups Only', value: true },
  { label: 'Non-Lab Groups', value: false },
]
const selectedLabGroup = ref(null)
const labGroupLabel = computed(() => selectedLabGroup.value?.label || 'Lab Group')
const selectLabGroup = async (option) => {
  selectedLabGroup.value = option
  try {
    const filters = {
      labGroup: option.value,
    }
    await groupStore.filterGroups(filters)
  } catch (error) {
    console.error('An unexpected error occurred:', error)
  }
}
async function getAllGroups() {
  try {
    const filters = {} // Empty object means no filters
    const result = await groupStore.filterGroups(filters)
    groupStore.filterActive = false
    if (result.success) {
      console.log('All groups:', result.data)
      // Update your component's data
    } else {
      console.error('Error fetching all groups:', result.error)
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error)
  }
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
      console.log(searchText.value)
      const result = await groupStore.searchGroupByGroupNameForSearchAction(searchText.value)

      searchResults.value = result.data
      console.log('this is the resule ', searchResults.value)
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
