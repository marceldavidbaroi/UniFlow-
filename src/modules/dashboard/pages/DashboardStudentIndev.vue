<template>
  <q-page padding> this is for sutdent dashboard {{ userStore.currentUser }} </q-page>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()
</script>

<style lang="scss" scoped></style>
