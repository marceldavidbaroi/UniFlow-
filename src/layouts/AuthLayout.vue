<template>
  <q-layout view="hHh Lpr fFf" class="auth-layout">
    <q-page-container class="flex flex-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style scoped lang="scss">
.auth-layout {
  background-color: #d7d8d3;
  background-image: url('/public//images/auth-bg-3-light.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
