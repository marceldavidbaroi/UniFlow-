<template>
  <div class="container">
    <q-item clickable v-ripple @click="router.push(`/group/${group.id}`)">
      <q-item-section>
        <q-item-label>{{ group.groupName }}</q-item-label>
        <div class="row">
          <div class="">Course: {{ group.courseName }}</div>
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

    <q-btn
      v-if="userStore.currentRole === 'teacher'"
      flat
      dense
      size="sm"
      color="red"
      icon="delete"
      @click="showDeletePopup = true"
    />
    <DeleteDialog
      v-model="showDeletePopup"
      cardTitle="Delete Group"
      description="Confirm your group to delete"
      inputField="true"
      :nameToMatch="group.groupName"
      @confirm-delete="handleDelete"
    />

    <!-- leave group for student -->
    <q-btn
      flat
      v-if="userStore.currentRole === 'student'"
      v-model="showLeaveGroup"
      dense
      size="sm"
      color="negative"
      icon="logout"
      @click="showLeaveGroup = true"
    >
      <q-tooltip>Leave Group</q-tooltip>
    </q-btn>

    <LeaveGroupDialog
      v-model="showLeaveGroup"
      @confirm-leave="removeMember(userStore.currentUser.id)"
    />
  </div>
</template>

<script setup>
import { Notify } from 'quasar'
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import DeleteDialog from 'src/components/DeleteDialog.vue'
import ShareDialog from '../components/ShareDialog.vue'
import LeaveGroupDialog from '../components/LeaveGroupDialog.vue'

import { useGroupStore } from 'src/stores/group-store'
import { useUserStore } from 'src/stores/user-store'

const router = useRouter()

const props = defineProps({
  group: Object,
})
const emit = defineEmits(['member-removed'])

// const baseUrl = ref()
const groupStore = useGroupStore()
const userStore = useUserStore()
const showSharePopup = ref(false)
// const shareLink = ref()
const showDeletePopup = ref(false)
const showLeaveGroup = ref(false)

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

const removeMember = async (memberId) => {
  try {
    const response = await groupStore.removeMemberFromGroup(props.group.id, memberId)
    if (response.success) {
      Notify.create({ message: response.message, color: 'positive', position: 'top' })
      // const result = await groupStore.searchGroupById(props.group.id)
      // group.value = result.data
      // if (userStore.currentRole === 'student') {
      //   router.push('/group/list')
      emit('member-removed', memberId) // ✅ Emit event to update the list

      // }
    } else {
      Notify.create({ message: response.message, color: 'negative', position: 'top' })
    }
  } catch {
    Notify.create({ message: 'Failed to remove member.', color: 'negative', position: 'top' })
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
