<template>
  <q-page class="q-pa-md">
    <div class="row justify-center text-center q-ma-md">
      <div class="col q-pa-xl q-mx-xl my-card text-center">
        <div class="text-heading-solid text-h3">10</div>
        <div class="caption">Groups</div>
      </div>
      <div class="col q-pa-xl q-mx-xl my-card">
        <div class="text-heading-solid text-h3">10</div>
        <div class="caption">Students</div>
      </div>
      <!-- <div class="col q-pa-xl q-mx-xl my-card">total sesstions</div> -->
    </div>
    <GroupListItems v-for="group in formattedGroupData" :key="group.id" :group="group" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import GroupListItems from '../components/GroupListItems.vue'
import { useGroupStore } from 'src/stores/group-store'

const groupStore = useGroupStore()

const formattedGroupData = groupStore.groupList.map((group) => ({
  groupName: group.groupName,
  semester: group.semester,
  subjectName: group.subjectName,
  year: group.year,
  labGroup: group.labGroup,
}))

onMounted(groupStore.fetchAllGroups, console.log(groupStore.groupList))

console.log(formattedGroupData)
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: auto;
}

.my-card {
  width: 100%;
  border: 2px solid rgb(194, 157, 72);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.text-heading-solid {
  font-family: 'Londrina Solid', cursive;
  color: #c29d48;
}
</style>
