<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark q-py-sm">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-img src="/public//images/Logo-nav.svg" height="50px" width="170px" />
        </q-toolbar-title>

        <div>
          <ClockCard />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above elevated class="bg-accent">
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-accent">
      <router-view />
    </q-page-container>

    <q-footer class="bg-accent text-black">
      <q-toolbar>
        <q-toolbar-title>
          <div>this is the footer</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import ClockCard from 'src/components/ClockCard.vue'

const linksList = [
  {
    title: 'Home',
    caption: 'quasar.dev',
    icon: 'school',
    link: '/home',
  },
  {
    title: 'teacher',
    caption: 'quasar.dev',
    icon: 'school',
    link: '/dashboard/teacher',
  },
  {
    title: 'Student',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: '/dashboard/student',
  },
  {
    title: 'Admin',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: '/dashboard/admin',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
