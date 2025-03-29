<template>
  <q-page class="q-pa-md">
    this is new new
    {{ groupStore.groupList }}
    <GroupListItems v-for="group in formattedGroupData" :key="group.id" :group="group" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import GroupListItems from '../components/GroupListItems.vue'
import { useGroupStore } from 'src/stores/group-store'

const groupStore = useGroupStore()
const groups = ref()

const formattedGroupData = groupStore.groupList.map((group) => ({
  groupName: group.groupName,
  semester: group.semester,
  subjectName: group.subjectName,
  year: group.year,
  labGroup: group.labGroup,
}))

onMounted(groupStore.fetchAllGroups)

console.log(formattedGroupData)
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: auto;
}
</style>
