<template>
  <q-page class="q-pa-md">
    <div class="group-header">
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
          <span class="detail-label">Subject:</span> {{ group?.subjectName }}
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
      <q-table :rows="formattedMembers || []" :columns="columns" row-key="id" flat bordered>
        <template v-slot:body-cell="props">
          <q-td :props="props" @click="copyToClipboard(props.value)" class="clickable">
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { Notify } from 'quasar'
import { useGroupStore } from 'src/stores/group-store'
import { onMounted, ref, computed, nextTick } from 'vue'

const groupStore = useGroupStore()

const groupId = ref(null)
const group = ref(null)

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

const formattedMembers = computed(() => {
  if (!group.value || !group.value.members) {
    return []
  }

  return group.value.members.map((member) => ({
    name: member.faculty?.label
      ? `${member.name || 'N/A'} (${member.faculty.label})`
      : member.name || 'N/A',
    id: member.personId || 'N/A',
    email: member.email || 'N/A',
    department: member.department.label || 'N/A',
  }))
})

const copyToClipboard = (text) => {
  if (!text) return

  navigator.clipboard
    .writeText(text)
    .then(() => {
      Notify.create({ message: `Copied to clipboard: ${text}`, color: 'positive', position: 'top' })
    })
    .catch(() => {
      Notify.create({ message: 'Copy failed!', color: 'negative', position: 'top' })
    })
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
