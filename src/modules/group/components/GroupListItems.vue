<template>
  <div class="container">
    <q-item clickable v-ripple @click="router.push(`/group/${group.id}`)">
      <q-item-section>
        <q-item-label>{{ group.groupName }}</q-item-label>
        <div class="row">
          <div class="">Subject: {{ group.subjectName }}</div>
          <div class="col text-right text-dark">
            <span class="">&nbsp;{{ group.semester }}</span>
            <span>&nbsp;||&nbsp;{{ group.year }} </span>
            <span v-if="group.labGroup" class="text-bold text-primary"
              >&nbsp;<span class="text-black">||</span>&nbsp;Lab Group</span
            >
          </div>
        </div>
      </q-item-section>
    </q-item>
    <q-btn flat dense size="sm" color="secondary" icon="share" @click="showSharePopup = true" />
    <ShareDialog v-model="showSharePopup" :group="group" />

    <q-btn flat dense size="sm" color="red" icon="delete" @click="showDeletePopup = true" />
    <DeleteDialog
      v-model="showDeletePopup"
      cardTitle="Delete Group"
      description="Confirm your group to delete"
      inputField="true"
      :nameToMatch="group.groupName"
      @confirm-delete="handleDelete"
    />
  </div>
</template>

<script setup>
import { Notify } from 'quasar'
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import DeleteDialog from 'src/components/DeleteDialog.vue'
import ShareDialog from '../components/ShareDialog.vue'

import { useGroupStore } from 'src/stores/group-store'

const router = useRouter()

const props = defineProps({
  group: Object,
})

// const baseUrl = ref()
const groupStore = useGroupStore()

const showSharePopup = ref(false)
// const shareLink = ref()
const showDeletePopup = ref(false)

// onMounted(() => {
//   baseUrl.value = window.location.origin

//   if (props.group && props.group.id) {
//     shareLink.value = `${baseUrl.value}/group/join/${props.group.id}`
//   } else {
//     shareLink.value = 'invalid link'
//   }
// })

const handleDelete = async () => {
  const response = await groupStore.deleteGroup(props.group.id)

  if (response.success) {
    Notify.create({
      type: 'positive',
      message: response.message || 'Group deleted successfully.',
      position: 'top',
      timeout: 3000,
    })
  } else {
    Notify.create({
      type: 'negative',
      message: response.message || response.error || 'Failed to delete the group.',
      position: 'top',
      timeout: 3000,
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.q-item {
  width: 800px;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.q-item:hover {
  background-color: #f5f5f5;
}
</style>
