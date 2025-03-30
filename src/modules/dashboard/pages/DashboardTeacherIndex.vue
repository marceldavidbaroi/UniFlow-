<template>
  <q-page padding>
    <!-- create session -->
    <section>
      current user {{ userStore.currentUser }}
      this is the create session section
      <q-btn
        color="primary"
        icon="check"
        label="Create session"
        @click="router.push('/group/create')"
      />
      here will be the session list
    </section>

    <!-- group -->
    <section>
      this is the group section
      <q-btn color="primary" icon="check" label="Create Group" @click="createGroup" />
      here will be the list of the groups
    </section>
    <!-- task management -->
    <section>this is the task section all task list will be here</section>
  </q-page>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
const userStore = useUserStore()

const router = useRouter()

const createGroup = () => {
  router.push('/group/create')
}
</script>

<style lang="scss" scoped></style>
