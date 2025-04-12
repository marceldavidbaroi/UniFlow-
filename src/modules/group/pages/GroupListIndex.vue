<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center q-ma-md">
      {{ filteredGroups }}
      <div class="col-auto q-pa-sm">
        <q-card class="flip-clock-card q-pa-md rounded-borders shadow-3">
          <q-card-section class="text-center flex flex-center column">
            <div class="text-h6 text-primary font-weight-bold">{{ groupStore.groupCount }}</div>
            <div class="text-caption text-grey-7">Groups</div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="userStore.currentRole === 'teacher'" class="col-auto q-pa-sm">
        <q-card class="flip-clock-card q-pa-md rounded-borders shadow-3">
          <q-card-section class="text-center flex flex-center column">
            <div class="text-h6 text-primary font-weight-bold">
              {{ groupStore.totalMemberCount }}
            </div>
            <div class="text-caption text-grey-7">Members</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-ma-md">
      <div class="col-12 flex justify-center">
        <q-btn
          v-if="userStore.currentRole === 'teacher'"
          label="Create Group"
          color="secondary"
          @click="router.push('/group/create')"
          unelevated
          class="q-mb-lg"
          style="border-radius: 8px"
        />
      </div>
    </div>
    <GroupActionButtons @filter-labgroup="onLabGroupFilter" />
    <div class="q-gutter-md">
      <GroupListItems
        v-for="group in formattedGroupData"
        :key="group.id"
        :group="group"
        @member-removed="onMemberRemoved"
      />
      <span v-if="formattedGroupData.length === 0" class="text-grey-7 text-body1 text-center block"
        >You have no Group</span
      >
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import GroupListItems from '../components/GroupListItems.vue'
import GroupActionButtons from '../components/GroupActionButtons.vue'
import { useGroupStore } from 'src/stores/group-store'
import router from 'src/router'
import { useUserStore } from 'src/stores/user-store'
const userStore = useUserStore()
const groupStore = useGroupStore()

// Make formattedGroupData reactive
const formattedGroupData = computed(() =>
  groupStore.groupList.map((group) => ({
    id: group.id,
    groupName: group.groupName,
    semester: group.semester,
    subjectName: group.subjectName,
    year: group.year,
    labGroup: group.labGroup,
    password: group.password,
    owner: group.owner,
  })),
)

const onMemberRemoved = async () => {
  if (userStore.currentRole === 'student') {
    const response = await groupStore.fetchGroupsByStudent()
    console.log(response)
  }
}
onMounted(async () => {
  if (userStore.currentRole === 'teacher') {
    await groupStore.fetchAllGroups()
  }

  if (userStore.currentRole === 'student') {
    const response = await groupStore.fetchGroupsByStudent()
    console.log(response)
  }
})

const onLabGroupFilter = (value) => {
  console.log('Lab group filter changed:', value)

  // Apply filter logic here, e.g.:
  // fetchFilteredGroups({ labGroup: value })
}
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: auto;
}

.my-card {
  width: 100%;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.flip-clock-card {
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  border-radius: 8px; /* Slightly rounded corners */
  width: 100px; /* Reduced width */
  height: 80px; /* Reduced height */
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  transform-style: preserve-3d; /* Required for 3D transforms */
}

.flip-clock-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1); /* Subtle divider */
}
</style>
