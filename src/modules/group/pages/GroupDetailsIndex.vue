<template>
  <q-page class="q-pa-md">
    <div v-if="group">
      <div class="group-header">
        <div class="row justify-end q-pa-none q-gutter-x-md">
          <q-btn
            flat
            dense
            v-if="userStore.currentRole === 'teacher'"
            size="sm"
            color="white"
            icon="delete"
            @click="showDeletePopup = true"
          />
          <DeleteDialog
            v-model="showDeletePopup"
            cardTitle="Delete Group"
            description="Confirm your group to delete"
            inputField="true"
            :nameToMatch="group?.groupName"
            @confirm-delete="handleDelete"
          />
          <!-- leave group for student -->
          <q-btn
            flat
            v-if="userStore.currentRole === 'student'"
            v-model="showLeaveGroup"
            dense
            size="sm"
            color="white"
            icon="logout"
            @click="showLeaveGroup = true"
          >
            <q-tooltip>Leave Group</q-tooltip>
          </q-btn>

          <LeaveGroupDialog
            v-model="showLeaveGroup"
            @confirm-leave="removeMember(userStore.currentUser.id)"
          />
          <q-btn
            v-if="userStore.currentRole === 'teacher'"
            flat
            dense
            size="sm"
            color="white"
            icon="edit"
            @click="router.push(`/group/edit/${groupId}`)"
          />
          <q-btn flat dense size="sm" color="white" icon="share" @click="showSharePopup = true" />
          <ShareDialog v-model="showSharePopup" :group="group" />
        </div>
        <div class="group-title">{{ group?.groupName }}</div>
        <div class="group-details">
          <div class="detail-item">
            <span class="detail-label">Instructor:</span>
            {{ group?.owner?.name }}
            <span v-if="group?.owner?.faculty?.label"> ({{ group?.owner?.faculty?.label }}) </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email:</span> {{ group?.owner?.email }}
          </div>
          <div class="detail-item"><span class="detail-label">Batch:</span> {{ group?.batch }}</div>
          <div class="detail-item">
            <span class="detail-label">Semester:</span> {{ group?.semester }}
          </div>
          <div class="detail-item"><span class="detail-label">Year:</span> {{ group?.year }}</div>
          <div class="detail-item">
            <span class="detail-label">Course:</span> {{ group?.course?.name }}
            <span v-if="group?.course?.code"> ({{ group?.course?.code }})</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Department:</span> {{ group?.department?.name }}
            <span v-if="group?.department?.initial"> ({{ group?.department?.initial }})</span>
          </div>
          <div class="detail-item" v-if="group?.labGroup">
            <span class="detail-label">Lab Group:</span>
          </div>
        </div>
      </div>
      <div class="group-section">
        <div class="section-title">Description</div>
        <div class="section-content">{{ group?.description }}</div>
      </div>
      <div class="group-section">
        <div class="section-title">Group Rules</div>
        <div class="section-content" v-html="group?.groupRules"></div>
      </div>
      <div class="member-table">
        <div class="table-title">Member Details</div>
        <q-table dense :rows="formattedMembers || []" :columns="columns" row-key="id" flat bordered>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="pId" :props="props">{{ props.row.pId }}</q-td>
              <q-td key="email" :props="props">{{ props.row.email }}</q-td>
              <q-td key="department" :props="props">{{ props.row.department }}</q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  flat
                  :disable="userStore.currentRole !== 'teacher'"
                  dense
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="showRemoveMember = true"
                >
                  <q-tooltip>Remove Member</q-tooltip>
                </q-btn>
                <DeleteDialog
                  v-model="showRemoveMember"
                  cardTitle="Remove Member"
                  description="Do you really want to remove this member"
                  buttonLabel="Remove"
                  @confirm-delete="removeMember(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <div v-else class="flex flex-center q-mt-md" style="height: 100vh">
      <div class="text-center">
        <q-spinner-pie color="secondary" size="2em" />
        <div>Loading group details...</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { useGroupStore } from 'src/stores/group-store'
import { useUserStore } from 'src/stores/user-store'
import { onMounted, ref, computed, nextTick } from 'vue'
import DeleteDialog from 'src/components/DeleteDialog.vue'
import ShareDialog from '../components/ShareDialog.vue'
import LeaveGroupDialog from '../components/LeaveGroupDialog.vue'

const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()

const groupId = ref(null)
const group = ref(null)
const showDeletePopup = ref(false)
const showSharePopup = ref(false)
const showLeaveGroup = ref(false)
const showRemoveMember = ref(false)

onMounted(async () => {
  groupId.value = window.location.pathname.split('/group/')[1]
  if (groupId.value) {
    try {
      const result = await groupStore.searchGroupById(groupId.value)
      if (result?.data) {
        group.value = result.data
        await nextTick()
      }
    } catch (error) {
      console.error('Error fetching group data:', error)
    }
  }
})

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'department', label: 'Department', field: 'department', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'center' },
]

const formattedMembers = computed(() => {
  if (!group.value || !group.value.members) {
    return []
  }

  return group.value.members.map((member) => ({
    name: member.faculty?.label
      ? `${member.name || 'N/A'} (${member.faculty.label})`
      : member.name || 'N/A',
    pId: member.personId || 'N/A',
    email: member.email || 'N/A',
    department: member.department.label || 'N/A',
    id: member.id,
  }))
})

const handleDelete = async () => {
  console.log('Deleting group with ID:', groupId.value)
  const response = await groupStore.deleteGroup(groupId.value)

  if (response.success) {
    Notify.create({
      type: 'positive',
      message: response.message || 'Group deleted successfully.',
      position: 'top',
      timeout: 3000,
    })
    router.push('/group/list')
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
    const response = await groupStore.removeMemberFromGroup(groupId.value, memberId)
    if (response.success) {
      Notify.create({ message: response.message, color: 'positive', position: 'top' })
      const result = await groupStore.searchGroupById(groupId.value)
      group.value = result.data
      if (userStore.currentRole === 'student') {
        router.push('/group/list')
      }
    } else {
      Notify.create({ message: response.message, color: 'negative', position: 'top' })
    }
  } catch {
    Notify.create({ message: 'Failed to remove member.', color: 'negative', position: 'top' })
  }
}
</script>

<style scoped>
.group-header {
  background: linear-gradient(135deg, #64b5f6, #1e88e5);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.group-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.group-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.detail-item {
  font-size: 1rem;
}

.detail-label {
  font-weight: bold;
  margin-right: 0.5rem;
}

.group-section {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f8f8;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
}

.section-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

.member-table {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.section-content ol {
  padding-left: 1.2rem;
}

.section-content li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
</style>
