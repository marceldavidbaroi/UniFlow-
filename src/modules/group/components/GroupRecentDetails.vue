<template>
  <div class="q-pa-md">
    <!-- Header Buttons -->
    <div class="row justify-between items-center q-mb-xl">
      <div class="q-gutter-sm">
        <q-btn-toggle
          v-model="selectedType"
          toggle-color="secondary"
          unelevated
          :options="typeOptions"
          @update:model-value="fetchItems"
        />
      </div>

      <q-btn flat color="secondary" icon="add" @click="showDialog = true" />
    </div>

    <!-- Loading State -->
    <q-inner-loading :showing="loading">
      <q-spinner-grid size="50px" color="secondary" />
    </q-inner-loading>

    <!-- Empty State -->
    <div v-if="!loading && !items.length" class="text-center text-grey q-mt-xl">
      <q-icon name="inbox" size="56px" />
      <div class="text-subtitle1 q-mt-sm">No items found</div>
    </div>

    <!-- Items List -->
    <!-- Items List -->
    <div class="q-gutter-md">
      <q-card v-for="item in items" :key="item.id" class="q-pa-sm" flat bordered>
        <q-card-section class="row items-start justify-between">
          <!-- 📌 Item Content -->
          <div class="col">
            <div class="row items-center q-mb-xs">
              <q-icon :name="getIcon(item.type)" size="20px" class="q-mr-sm text-secondary" />
              <div class="text-h6">{{ item.title || item.name || 'Untitled' }}</div>
            </div>

            <!-- 🔄 Dynamic Content -->
            <div v-if="item.type === 'resource'" class="text-caption text-grey-7">
              <q-icon name="description" size="16px" class="q-mr-xs" /> {{ item.description }}<br />
              <q-icon name="link" size="16px" class="q-mr-xs" />
              <a :href="item.link" target="_blank" class="text-secondary">{{ item.link }}</a>
            </div>

            <div v-else-if="item.type === 'task'" class="text-caption text-grey-7">
              <q-icon name="assignment" size="16px" class="q-mr-xs" /> {{ item.description }}<br />
              <q-icon name="event" size="16px" class="q-mr-xs" /> Due:
              {{ item.dueDate || 'No due date' }}<br />
              <q-icon name="link" size="16px" class="q-mr-xs" />
              <a :href="item.link" target="_blank" class="text-secondary">{{ item.link }}</a>
            </div>

            <div v-else-if="item.type === 'announcement'" class="text-caption text-grey-7">
              <q-icon name="campaign" size="16px" class="q-mr-xs" /> {{ item.message }}
            </div>

            <div v-else-if="item.type === 'poll'" class="text-caption text-grey-7">
              <q-icon name="poll" size="16px" class="q-mr-xs" /> Options:
              <ul class="q-ml-md q-mt-xs">
                <li v-for="(option, idx) in item.options" :key="idx">{{ option }}</li>
              </ul>
              <div v-if="item.expiresAt">
                <q-icon name="timer" size="16px" class="q-mr-xs" />
                Expires: {{ formatTimestamp(item.expiresAt) }}
              </div>
            </div>
          </div>

          <!-- 📅 Metadata + Actions -->
          <div class="column items-end q-ml-md q-gutter-xs">
            <div class="text-caption text-grey text-right">
              <div class="row items-center">
                <q-icon name="category" size="14px" class="q-mr-xs" />
                {{ item.type }}
              </div>
              <div class="row items-center">
                <q-icon name="schedule" size="14px" class="q-mr-xs" />
                {{ formatTimestamp(item.createdAt) }}
              </div>
            </div>

            <!-- ✏️ Edit & ❌ Delete -->
            <div v-if="userStore.currentRole === 'teacher'" class="q-mt-sm">
              <q-btn
                dense
                flat
                round
                icon="edit"
                size="sm"
                color="secondary"
                @click="editItem(item)"
              />
              <q-btn
                dense
                flat
                round
                icon="delete"
                size="sm"
                color="negative"
                @click="deleteItem(item)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Add Dialog -->
    <AddItemsDialog
      v-model="showDialog"
      :group-id="selectedGroupId"
      :item="editingItem"
      @submit="onSubmit"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { date } from 'quasar'
import AddItemsDialog from './AddItemsDialog.vue'
import { useGroupStore } from 'src/stores/group-store'
import { useUserStore } from 'src/stores/user-store'
const userStore = useUserStore()

const groupStore = useGroupStore()

const props = defineProps({
  group: { type: Object, required: true },
})

const selectedGroupId = ref(props.group.id)
const showDialog = ref(false)
const items = ref([])
const loading = ref(false)
const selectedType = ref(null)
const editingItem = ref(null)
const getIcon = (type) => {
  switch (type) {
    case 'resource':
      return 'bookmarks'
    case 'task':
      return 'check_circle'
    case 'announcement':
      return 'campaign'
    case 'poll':
      return 'poll'
    default:
      return 'note'
  }
}

const typeOptions = [
  { label: 'All', value: null },
  { label: 'Resource', value: 'resource' },
  { label: 'Task', value: 'task' },
  { label: 'Announcement', value: 'announcement' },
  { label: 'Poll', value: 'poll' },
]

const fetchItems = async () => {
  loading.value = true
  items.value = await groupStore.getGroupItems(selectedGroupId.value, selectedType.value)
  loading.value = false
}

const onSubmit = async ({ type, payload }) => {
  if (editingItem.value) {
    await groupStore.editGroupItem(selectedGroupId.value, type, editingItem.value.id, payload)
    editingItem.value = null
  } else {
    await groupStore.addGroupItem(selectedGroupId.value, type, payload)
  }
  showDialog.value = false
  fetchItems()
}

const editItem = (item) => {
  editingItem.value = item
  showDialog.value = true
}

const deleteItem = async (item) => {
  await groupStore.deleteGroupItem(selectedGroupId.value, item.type, item.id)
  fetchItems()
}

const formatTimestamp = (ts) => {
  if (!ts?.seconds) return '—'
  const jsDate = new Date(ts.seconds * 1000)
  return date.formatDate(jsDate, 'YYYY-MM-DD HH:mm')
}

watch(showDialog, (val) => {
  if (!val) {
    editingItem.value = null
  }
})

onMounted(fetchItems)
</script>

<style scoped lang="scss">
.text-h6 {
  font-weight: 600;
}
</style>
