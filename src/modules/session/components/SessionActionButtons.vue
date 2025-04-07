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
        class="toolbar-btn"
        @click="onCreate"
      />

      <!-- Sort Dropdown Button -->
      <q-btn-dropdown
        color="info"
        :label="sortLabel"
        icon="sort"
        size="sm"
        dropdown-icon="expand_more"
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
        dropdown-icon="expand_more"
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
          placeholder="Search by session ID"
          class="search-input"
          size="sm"
        >
          <template #append>
            <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
          </template>
        </q-input>
      </div>

      <q-list v-if="showSearch" class="q-mt-sm bg-white shadow-2 rounded-borders full-width">
        <!-- Loading spinner -->
        <q-item v-if="isLoading">
          <q-item-section class="text-center full-width">
            <q-spinner-dots color="primary" size="24px" />
          </q-item-section>
        </q-item>

        <!-- Results -->
        <q-item
          v-else-if="searchResults.success && searchResultsArr.length"
          v-for="(item, index) in searchResultsArr"
          :key="index"
          clickable
          @click="router.push(`/session/${userStore.currentRole}/${item.id}`)"
        >
          <q-item-section> {{ item.sessionID }} - {{ item.sessionName }} </q-item-section>
        </q-item>

        <!-- Error message -->
        <q-item v-else-if="!isLoading && !searchResults.success && searchText">
          <q-item-section class="text-negative">
            {{ searchResults.message }}
          </q-item-section>
        </q-item>

        <!-- Default instruction -->
        <q-item v-else-if="!isLoading && !searchText">
          <q-item-section class="text-grey"> Search by session ID </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from 'src/stores/sessionStore'
import { useUserStore } from 'src/stores/user-store'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()

const router = useRouter()
const sessionStore = useSessionStore()

const selectedSort = ref(null)
const selectedFilter = ref(null)
const showSearch = ref(false)
const searchText = ref('')

const sortOptions = [
  { label: 'Newest', value: { field: 'createdAt', order: 'desc' } },
  { label: 'Oldest', value: { field: 'createdAt', order: 'asc' } },
  { label: 'Session ID (Asc)', value: { field: 'sessionID', order: 'asc' } },
  { label: 'Session ID (Desc)', value: { field: 'sessionID', order: 'desc' } },
  { label: 'Upcoming', value: { field: 'sessionDate', order: 'asc' } }, // Assuming "upcoming" means by start time
  { label: 'Ended (Asc)', value: { field: 'endedAt', order: 'asc' } }, // You can change this logic based on your implementation
  { label: 'Ended (desc)', value: { field: 'endedAt', order: 'desc' } }, // You can change this logic based on your implementation
  { label: 'Session Length (Asc)', value: { field: 'sessionLength', order: 'asc' } }, // You can change this logic based on your implementation
  { label: 'Session Length (Desc)', value: { field: 'sessionLength', order: 'desc' } }, // You can change this logic based on your implementation
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
  console.log(option.value.field)
  sessionStore.sortSessionsBy(option.value.field, option.value.order)
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
  // console.log('Create clicked')
  router.push('/session/create')
}

onMounted(async () => {
  sessionStore.fetchAllSession()
  console.log(sessionStore.sessionList)
})

let timeout = null
const searchResultsArr = ref([])
const searchResults = ref({}) // holds the full response with success, message, data
const isLoading = ref(false)

watch(searchText, (newVal) => {
  if (timeout) clearTimeout(timeout)

  timeout = setTimeout(async () => {
    const id = parseInt(newVal)

    if (!isNaN(id)) {
      isLoading.value = true
      searchResults.value = {}
      try {
        searchResults.value = await sessionStore.searchSessionByIdForSearchAction(id)

        if (searchResults.value.success && searchResults.value.data) {
          searchResultsArr.value = [searchResults.value.data]
        } else {
          searchResultsArr.value = []
        }
      } catch (err) {
        console.error(err)
      } finally {
        isLoading.value = false
      }
    } else {
      searchResultsArr.value = []
      isLoading.value = false
    }
  }, 1000)
})
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
  width: 480px;
}
</style>
